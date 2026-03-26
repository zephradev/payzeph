import {
    Injectable,
    ConflictException,
    UnauthorizedException,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { eq } from 'drizzle-orm';
import { DatabaseService } from '../database/database.service';
import { RedisService } from '../redis/redis.service';
import { users } from '../database/schema';
import { wallets } from '../database/schema';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
    constructor(
        private db: DatabaseService,
        private jwt: JwtService,
        private config: ConfigService,
        private redis: RedisService,
    ) {}

    private generateTokens(userId: string) {
        const accessToken = this.jwt.sign(
            { sub: userId },
            {
                secret: this.config.get('JWT_SECRET'),
                expiresIn: this.config.get('JWT_EXPIRES_IN'),
            },
        );

        const refreshToken = this.jwt.sign(
            { sub: userId, type: 'refresh' },
            {
                secret: this.config.get('JWT_REFRESH_SECRET'),
                expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN'),
            },
        );

        return { accessToken, refreshToken };
    }

    async refreshToken(refreshToken: string) {
        try {
            const payload = this.jwt.verify(refreshToken, {
                secret: this.config.get('JWT_REFRESH_SECRET'),
            });

            if (payload.type !== 'refresh') {
                throw new UnauthorizedException('Invalid token type');
            }

            // Check if refresh token has been blacklisted
            const isBlacklisted = await this.redis.get(`bl:${refreshToken}`);
            if (isBlacklisted) {
                throw new UnauthorizedException('Token has been revoked');
            }

            // Verify user still exists
            const result = await this.db.db
                .select()
                .from(users)
                .where(eq(users.id, payload.sub))
                .limit(1);

            const user = result[0];
            if (!user) {
                throw new UnauthorizedException('User not found');
            }

            // Generate new token pair
            const tokens = this.generateTokens(user.id);

            // Blacklist the old refresh token (remaining TTL)
            const ttl = payload.exp - Math.floor(Date.now() / 1000);
            if (ttl > 0) {
                await this.redis.set(`bl:${refreshToken}`, '1', ttl);
            }

            return {
                user: this.sanitizeUser(user),
                ...tokens,
            };
        } catch (error) {
            if (error instanceof UnauthorizedException) throw error;
            throw new UnauthorizedException('Invalid or expired refresh token');
        }
    }

    async signup(dto: SignupDto) {
        const existing = await this.db.db
            .select()
            .from(users)
            .where(eq(users.email, dto.email.toLowerCase()))
            .limit(1);

        if (existing.length > 0) {
            throw new ConflictException('Email already registered');
        }

        const passwordHash = await bcrypt.hash(dto.password, 12);
        const userId = uuidv4();

        await this.db.db.insert(users).values({
            id: userId,
            firstName: dto.firstName,
            lastName: dto.lastName,
            email: dto.email.toLowerCase(),
            phone: dto.phone,
            passwordHash,
        });

        // Create wallet for user
        await this.db.db.insert(wallets).values({
            id: uuidv4(),
            userId,
            balance: 0,
        });

        // Generate and store OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await this.redis.set(`otp:${dto.email.toLowerCase()}`, otp, 600);

        console.log(`[DEV] OTP for ${dto.email}: ${otp}`);

        return { message: 'Account created successfully. Check your email for OTP.' };
    }

    async login(dto: LoginDto) {
        const result = await this.db.db
            .select()
            .from(users)
            .where(eq(users.email, dto.email.toLowerCase()))
            .limit(1);

        const user = result[0];
        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);

        if (!passwordValid) {
            throw new UnauthorizedException('Invalid email or password');
        }

        if (user.isVerified !== 'true') {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            await this.redis.set(`otp:${user.email}`, otp, 600);
            console.log(`[DEV] OTP for ${user.email}: ${otp}`);

            throw new UnauthorizedException(
                JSON.stringify({
                    message: 'Please verify your email first',
                    requiresVerification: true,
                    email: user.email,
                }),
            );
        }

        const tokens = this.generateTokens(user.id);

        return {
            user: this.sanitizeUser(user),
            ...tokens,
        };
    }

    async verifyOtp(dto: VerifyOtpDto) {
        const storedOtp = await this.redis.get(`otp:${dto.email.toLowerCase()}`);

        if (!storedOtp || storedOtp !== dto.otp) {
            throw new BadRequestException('Invalid or expired OTP');
        }

        await this.redis.del(`otp:${dto.email.toLowerCase()}`);

        await this.db.db
            .update(users)
            .set({ isVerified: 'true' })
            .where(eq(users.email, dto.email.toLowerCase()));

        const result = await this.db.db
            .select()
            .from(users)
            .where(eq(users.email, dto.email.toLowerCase()))
            .limit(1);

        const user = result[0]!;
        const tokens = this.generateTokens(user.id);

        return {
            user: this.sanitizeUser(user),
            ...tokens,
        };
    }

    async resendOtp(email: string) {
        const result = await this.db.db
            .select()
            .from(users)
            .where(eq(users.email, email.toLowerCase()))
            .limit(1);

        if (result.length === 0) {
            throw new NotFoundException('User not found');
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await this.redis.set(`otp:${email.toLowerCase()}`, otp, 600);
        console.log(`[DEV] OTP for ${email}: ${otp}`);

        return { message: 'OTP sent successfully' };
    }

    async forgotPassword(dto: ForgotPasswordDto) {
        const result = await this.db.db
            .select()
            .from(users)
            .where(eq(users.email, dto.email.toLowerCase()))
            .limit(1);

        if (result.length === 0) {
            return { message: 'If that email exists, a reset link has been sent' };
        }

        const token = uuidv4();
        await this.redis.set(`reset:${token}`, dto.email.toLowerCase(), 3600);
        console.log(`[DEV] Reset token for ${dto.email}: ${token}`);

        return { message: 'If that email exists, a reset link has been sent' };
    }

    async resetPassword(dto: ResetPasswordDto) {
        const email = await this.redis.get(`reset:${dto.token}`);

        if (!email) {
            throw new BadRequestException('Invalid or expired reset token');
        }

        const passwordHash = await bcrypt.hash(dto.password, 12);

        await this.db.db
            .update(users)
            .set({ passwordHash })
            .where(eq(users.email, email));

        await this.redis.del(`reset:${dto.token}`);

        return { message: 'Password reset successfully' };
    }

    private sanitizeUser(user: any) {
        return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            avatar: user.avatar,
            isVerified: user.isVerified === 'true',
            createdAt: user.createdAt,
        };
    }
}
