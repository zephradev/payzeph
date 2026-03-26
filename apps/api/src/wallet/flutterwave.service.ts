import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

interface FlutterwaveInitResponse {
    status: string;
    message: string;
    data: {
        link: string;
    };
}

interface FlutterwaveVerifyResponse {
    status: string;
    message: string;
    data: {
        id: number;
        tx_ref: string;
        flw_ref: string;
        status: string;
        amount: number;
        currency: string;
        charged_amount: number;
        customer: {
            email: string;
        };
        meta: Record<string, any>;
    };
}

@Injectable()
export class FlutterwaveService {
    private readonly secretKey: string;
    private readonly baseUrl = 'https://api.flutterwave.com/v3';

    constructor(private config: ConfigService) {
        this.secretKey = this.config.get<string>('FLW_SECRET_KEY')!;
    }

    async initializeTransaction(params: {
        email: string;
        amount: number;
        txRef: string;
        redirectUrl: string;
        customerName?: string;
        meta?: Record<string, any>;
    }): Promise<{ link: string }> {
        const response = await fetch(`${this.baseUrl}/payments`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${this.secretKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                tx_ref: params.txRef,
                amount: params.amount,
                currency: 'NGN',
                redirect_url: params.redirectUrl,
                customer: {
                    email: params.email,
                    name: params.customerName || params.email,
                },
                customizations: {
                    title: 'PayZeph Wallet Funding',
                    description: `Fund wallet with ₦${params.amount.toLocaleString()}`,
                    logo: '',
                },
                meta: params.meta,
            }),
        });

        const data: FlutterwaveInitResponse = await response.json();

        if (data.status !== 'success') {
            throw new BadRequestException(data.message || 'Failed to initialize payment');
        }

        return { link: data.data.link };
    }

    async verifyTransaction(transactionId: string): Promise<FlutterwaveVerifyResponse['data']> {
        const response = await fetch(
            `${this.baseUrl}/transactions/${encodeURIComponent(transactionId)}/verify`,
            {
                headers: {
                    Authorization: `Bearer ${this.secretKey}`,
                },
            },
        );

        const data: FlutterwaveVerifyResponse = await response.json();

        if (data.status !== 'success') {
            throw new BadRequestException(data.message || 'Verification failed');
        }

        return data.data;
    }

    verifyWebhookSignature(signature: string): boolean {
        const secretHash = this.config.get<string>('FLW_WEBHOOK_HASH') || '';
        return signature === secretHash;
    }
}
