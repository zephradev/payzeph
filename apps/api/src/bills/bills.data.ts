// Reference data for bills — IDs match VTPass variation codes for sandbox/live API

export const dataBundles: Record<string, any[]> = {
    mtn: [
        { id: 'mtn-500', name: '500MB', amount: 500, validity: '30 days', dataAmount: '500MB' },
        { id: 'mtn-1gb', name: '1GB', amount: 1000, validity: '30 days', dataAmount: '1GB' },
        { id: 'mtn-2gb', name: '2GB', amount: 1200, validity: '30 days', dataAmount: '2GB' },
        { id: 'mtn-3gb', name: '3GB', amount: 1500, validity: '30 days', dataAmount: '3GB' },
        { id: 'mtn-5gb', name: '5GB', amount: 2500, validity: '30 days', dataAmount: '5GB' },
        { id: 'mtn-10gb', name: '10GB', amount: 5000, validity: '30 days', dataAmount: '10GB' },
    ],
    airtel: [
        { id: 'airt-750', name: '750MB', amount: 500, validity: '14 days', dataAmount: '750MB' },
        { id: 'airt-1500', name: '1.5GB', amount: 1000, validity: '30 days', dataAmount: '1.5GB' },
        { id: 'airt-2000', name: '2GB', amount: 1200, validity: '30 days', dataAmount: '2GB' },
        { id: 'airt-3000', name: '3GB', amount: 1500, validity: '30 days', dataAmount: '3GB' },
        { id: 'airt-4500', name: '4.5GB', amount: 2000, validity: '30 days', dataAmount: '4.5GB' },
        { id: 'airt-10000', name: '10GB', amount: 3000, validity: '30 days', dataAmount: '10GB' },
    ],
    glo: [
        { id: 'glo-1350', name: '1.35GB', amount: 500, validity: '14 days', dataAmount: '1.35GB' },
        { id: 'glo-2900', name: '2.9GB', amount: 1000, validity: '30 days', dataAmount: '2.9GB' },
        { id: 'glo-4100', name: '4.1GB', amount: 1500, validity: '30 days', dataAmount: '4.1GB' },
        { id: 'glo-7700', name: '7.7GB', amount: 2500, validity: '30 days', dataAmount: '7.7GB' },
        { id: 'glo-10000', name: '10GB', amount: 3000, validity: '30 days', dataAmount: '10GB' },
    ],
    '9mobile': [
        { id: '9mobile-500', name: '500MB', amount: 500, validity: '30 days', dataAmount: '500MB' },
        { id: '9mobile-1500', name: '1.5GB', amount: 1000, validity: '30 days', dataAmount: '1.5GB' },
        { id: '9mobile-2000', name: '2GB', amount: 1200, validity: '30 days', dataAmount: '2GB' },
        { id: '9mobile-3000', name: '3GB', amount: 1500, validity: '30 days', dataAmount: '3GB' },
        { id: '9mobile-4500', name: '4.5GB', amount: 2000, validity: '30 days', dataAmount: '4.5GB' },
    ],
};

export const cableBouquets: Record<string, any[]> = {
    dstv: [
        { id: 'dstv-padi', name: 'DStv Padi', amount: 2500, channels: 40 },
        { id: 'dstv-yanga', name: 'DStv Yanga', amount: 3500, channels: 65 },
        { id: 'dstv-confam', name: 'DStv Confam', amount: 6200, channels: 95 },
        { id: 'dstv79', name: 'DStv Compact', amount: 10500, channels: 130 },
        { id: 'dstv7', name: 'DStv Compact Plus', amount: 16600, channels: 155 },
        { id: 'dstv3', name: 'DStv Premium', amount: 37000, channels: 200 },
    ],
    gotv: [
        { id: 'gotv-smallie', name: 'GOtv Smallie', amount: 1300, channels: 30 },
        { id: 'gotv-jinja', name: 'GOtv Jinja', amount: 2700, channels: 45 },
        { id: 'gotv-jolli', name: 'GOtv Jolli', amount: 4150, channels: 65 },
        { id: 'gotv-max', name: 'GOtv Max', amount: 5700, channels: 75 },
        { id: 'gotv-supa', name: 'GOtv Supa', amount: 7600, channels: 90 },
    ],
    startimes: [
        { id: 'nova', name: 'Nova', amount: 1200, channels: 25 },
        { id: 'basic', name: 'Basic', amount: 2100, channels: 40 },
        { id: 'smart', name: 'Smart', amount: 3200, channels: 55 },
        { id: 'classic', name: 'Classic', amount: 3200, channels: 70 },
        { id: 'super', name: 'Super', amount: 5700, channels: 85 },
    ],
};

export const discoList = [
    { id: 'ikeja', name: 'Ikeja Electric (IKEDC)' },
    { id: 'eko', name: 'Eko Electric (EKEDC)' },
    { id: 'abuja', name: 'Abuja Electric (AEDC)' },
    { id: 'portharcourt', name: 'Port Harcourt Electric (PHED)' },
    { id: 'benin', name: 'Benin Electric (BEDC)' },
    { id: 'kaduna', name: 'Kaduna Electric (KDEDC)' },
    { id: 'enugu', name: 'Enugu Electric (EEDC)' },
    { id: 'ibadan', name: 'Ibadan Electric (IBEDC)' },
    { id: 'jos', name: 'Jos Electric (JED)' },
    { id: 'kano', name: 'Kano Electric (KEDC)' },
    { id: 'yola', name: 'Yola Electric (YEDC)' },
];
