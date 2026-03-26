import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
    constructor(private transactionsService: TransactionsService) {}

    @Get()
    getTransactions(
        @CurrentUser('id') userId: string,
        @Query('page') page?: string,
        @Query('perPage') perPage?: string,
    ) {
        return this.transactionsService.getTransactions(
            userId,
            page ? parseInt(page, 10) : 1,
            perPage ? parseInt(perPage, 10) : 10,
        );
    }
}
