import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VtpassService {
    private readonly apiKey: string;
    private readonly secretKey: string;
    private readonly baseUrl: string;

    constructor(private config: ConfigService) {
        this.apiKey = this.config.get<string>('VTPASS_API_KEY') || '';
        this.secretKey = this.config.get<string>('VTPASS_SECRET_KEY') || '';
        this.baseUrl = this.config.get<string>('VTPASS_BASE_URL') || 'https://sandbox.vtpass.com/api';
    }

    get isConfigured(): boolean {
        return !!(this.apiKey && this.secretKey);
    }

    private getHeaders() {
        const auth = Buffer.from(`${this.apiKey}:${this.secretKey}`).toString('base64');
        return {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/json',
        };
    }

    private generateRequestId(): string {
        const now = new Date();
        const date = now.toISOString().slice(0, 10).replace(/-/g, '');
        const time = now.toISOString().slice(11, 19).replace(/:/g, '');
        const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
        return `PZ${date}${time}${rand}`;
    }

    async buyAirtime(params: {
        phone: string;
        amount: number;
        serviceID: string; // e.g. 'mtn', 'airtel', 'glo', 'etisalat'
    }) {
        const requestId = this.generateRequestId();

        const response = await fetch(`${this.baseUrl}/pay`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({
                request_id: requestId,
                serviceID: params.serviceID,
                amount: params.amount,
                phone: params.phone,
            }),
        });

        const data = await response.json();

        if (data.code !== '000') {
            throw new BadRequestException(
                data.response_description || 'Airtime purchase failed',
            );
        }

        return {
            requestId,
            transactionId: data.content?.transactions?.transactionId,
            status: data.content?.transactions?.status,
            productName: data.content?.transactions?.product_name,
            amount: data.amount,
        };
    }

    async buyData(params: {
        phone: string;
        serviceID: string; // e.g. 'mtn-data', 'airtel-data', 'glo-data', 'etisalat-data'
        billersCode: string; // phone number
        variationCode: string; // e.g. 'mtn-10mb-100'
        amount: number;
    }) {
        const requestId = this.generateRequestId();

        const response = await fetch(`${this.baseUrl}/pay`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({
                request_id: requestId,
                serviceID: params.serviceID,
                billersCode: params.billersCode,
                variation_code: params.variationCode,
                amount: params.amount,
                phone: params.phone,
            }),
        });

        const data = await response.json();

        if (data.code !== '000') {
            throw new BadRequestException(
                data.response_description || 'Data purchase failed',
            );
        }

        return {
            requestId,
            transactionId: data.content?.transactions?.transactionId,
            status: data.content?.transactions?.status,
            productName: data.content?.transactions?.product_name,
            amount: data.amount,
        };
    }

    async payElectricity(params: {
        serviceID: string; // e.g. 'ikeja-electric', 'eko-electric'
        billersCode: string; // meter number
        variationCode: string; // 'prepaid' or 'postpaid'
        amount: number;
        phone: string;
    }) {
        const requestId = this.generateRequestId();

        const response = await fetch(`${this.baseUrl}/pay`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({
                request_id: requestId,
                serviceID: params.serviceID,
                billersCode: params.billersCode,
                variation_code: params.variationCode,
                amount: params.amount,
                phone: params.phone,
            }),
        });

        const data = await response.json();

        if (data.code !== '000') {
            throw new BadRequestException(
                data.response_description || 'Electricity payment failed',
            );
        }

        return {
            requestId,
            transactionId: data.content?.transactions?.transactionId,
            status: data.content?.transactions?.status,
            token: data.purchased_code || data.token,
            amount: data.amount,
        };
    }

    async subscribeCableTv(params: {
        serviceID: string; // e.g. 'dstv', 'gotv', 'startimes'
        billersCode: string; // smartcard number
        variationCode: string; // bouquet code
        amount: number;
        phone: string;
    }) {
        const requestId = this.generateRequestId();

        const response = await fetch(`${this.baseUrl}/pay`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({
                request_id: requestId,
                serviceID: params.serviceID,
                billersCode: params.billersCode,
                variation_code: params.variationCode,
                amount: params.amount,
                phone: params.phone,
            }),
        });

        const data = await response.json();

        if (data.code !== '000') {
            throw new BadRequestException(
                data.response_description || 'Cable TV subscription failed',
            );
        }

        return {
            requestId,
            transactionId: data.content?.transactions?.transactionId,
            status: data.content?.transactions?.status,
            productName: data.content?.transactions?.product_name,
            amount: data.amount,
        };
    }

    async verifyMeter(params: {
        serviceID: string;
        billersCode: string;
        type: string; // 'prepaid' or 'postpaid'
    }) {
        const response = await fetch(`${this.baseUrl}/merchant-verify`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({
                serviceID: params.serviceID,
                billersCode: params.billersCode,
                type: params.type,
            }),
        });

        const data = await response.json();

        if (data.code !== '000') {
            throw new BadRequestException(
                data.response_description || 'Meter verification failed',
            );
        }

        return {
            customerName: data.content?.Customer_Name || data.content?.customerName || 'Unknown',
            meterNumber: params.billersCode,
            address: data.content?.Address || '',
        };
    }

    async verifySmartcard(params: {
        serviceID: string;
        billersCode: string;
    }) {
        const response = await fetch(`${this.baseUrl}/merchant-verify`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({
                serviceID: params.serviceID,
                billersCode: params.billersCode,
            }),
        });

        const data = await response.json();

        if (data.code !== '000') {
            throw new BadRequestException(
                data.response_description || 'Smartcard verification failed',
            );
        }

        return {
            customerName: data.content?.Customer_Name || data.content?.customerName || 'Unknown',
            smartcardNumber: params.billersCode,
            currentBouquet: data.content?.Current_Bouquet || '',
            dueDate: data.content?.Due_Date || '',
        };
    }

    // Map our disco IDs to VTPass service IDs
    static getElectricityServiceId(discoId: string): string {
        const map: Record<string, string> = {
            ikeja: 'ikeja-electric',
            eko: 'eko-electric',
            abuja: 'abuja-electric',
            portharcourt: 'portharcourt-electric',
            benin: 'benin-electric',
            kaduna: 'kaduna-electric',
            enugu: 'enugu-electric',
            ibadan: 'ibadan-electric',
            jos: 'jos-electric',
            kano: 'kano-electric',
            yola: 'yola-electric',
        };
        return map[discoId] || discoId;
    }

    // Map our network IDs to VTPass service IDs
    static getAirtimeServiceId(network: string): string {
        const map: Record<string, string> = {
            mtn: 'mtn',
            airtel: 'airtel',
            glo: 'glo',
            '9mobile': 'etisalat',
        };
        return map[network] || network;
    }

    static getDataServiceId(network: string): string {
        const map: Record<string, string> = {
            mtn: 'mtn-data',
            airtel: 'airtel-data',
            glo: 'glo-data',
            '9mobile': 'etisalat-data',
        };
        return map[network] || `${network}-data`;
    }
}
