import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { eq } from 'drizzle-orm';
import { DatabaseService } from '../../database/database.service';
import { users } from '../../database/schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        config: ConfigService,
        private db: DatabaseService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get<string>('JWT_SECRET')!,
        });
    }

    async validate(payload: { sub: string }) {
        const result = await this.db.db
            .select()
            .from(users)
            .where(eq(users.id, payload.sub))
            .limit(1);

        const user = result[0];
        if (!user) {
            throw new UnauthorizedException();
        }

        return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            avatar: user.avatar,
            role: user.role,
            isVerified: user.isVerified === 'true',
            createdAt: user.createdAt,
        };
    }
}
