import {
    Injectable,
    BadRequestException,
    UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { DatabaseService } from '../database/database.service';
import { users } from '../database/schema';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class UserService {
    constructor(private db: DatabaseService) {}

    async getProfile(userId: string) {
        const result = await this.db.db
            .select()
            .from(users)
            .where(eq(users.id, userId))
            .limit(1);

        const user = result[0];
        if (!user) {
            throw new BadRequestException('User not found');
        }

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

    async updateProfile(userId: string, dto: UpdateProfileDto) {
        const updateData: Record<string, any> = {};
        if (dto.firstName) updateData.firstName = dto.firstName;
        if (dto.lastName) updateData.lastName = dto.lastName;
        if (dto.phone) updateData.phone = dto.phone;

        if (Object.keys(updateData).length === 0) {
            throw new BadRequestException('No fields to update');
        }

        updateData.updatedAt = new Date();

        await this.db.db
            .update(users)
            .set(updateData)
            .where(eq(users.id, userId));

        const user = await this.getProfile(userId);

        return { message: 'Profile updated successfully', user };
    }

    async changePassword(userId: string, dto: ChangePasswordDto) {
        const result = await this.db.db
            .select()
            .from(users)
            .where(eq(users.id, userId))
            .limit(1);

        const user = result[0];
        if (!user) {
            throw new BadRequestException('User not found');
        }

        const isValid = await bcrypt.compare(dto.currentPassword, user.passwordHash);

        if (!isValid) {
            throw new UnauthorizedException('Current password is incorrect');
        }

        const passwordHash = await bcrypt.hash(dto.newPassword, 12);

        await this.db.db
            .update(users)
            .set({ passwordHash, updatedAt: new Date() })
            .where(eq(users.id, userId));

        return { message: 'Password updated successfully' };
    }
}
