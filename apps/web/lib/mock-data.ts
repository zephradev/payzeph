export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
  isVerified: boolean;
  createdAt: string;
}

export interface Transaction {
  id: string;
  type: "airtime" | "data" | "electricity" | "cable-tv" | "wallet-funding";
  description: string;
  amount: number;
  status: "success" | "pending" | "failed";
  reference: string;
  date: string;
  meta?: Record<string, string>;
}

export interface DataBundle {
  id: string;
  name: string;
  amount: number;
  validity: string;
  dataAmount: string;
}

export interface CableBouquet {
  id: string;
  name: string;
  amount: number;
  channels: number;
}

export const mockUser: User = {
  id: "usr_001",
  firstName: "Ifeanyi",
  lastName: "Okafor",
  email: "ifeanyi@example.com",
  phone: "08012345678",
  isVerified: true,
  createdAt: "2024-01-15T10:00:00Z",
};

export const mockWalletBalance = 45750.0;

export const mockTransactions: Transaction[] = [
  {
    id: "txn_001",
    type: "airtime",
    description: "MTN Airtime - 08012345678",
    amount: 1000,
    status: "success",
    reference: "PZ-AIR-20240315-001",
    date: "2024-03-15T14:30:00Z",
  },
  {
    id: "txn_002",
    type: "data",
    description: "Airtel 2GB Data - 08098765432",
    amount: 1200,
    status: "success",
    reference: "PZ-DAT-20240315-002",
    date: "2024-03-15T12:00:00Z",
  },
  {
    id: "txn_003",
    type: "electricity",
    description: "IKEDC Prepaid - 45678901234",
    amount: 10000,
    status: "success",
    reference: "PZ-ELC-20240314-003",
    date: "2024-03-14T09:15:00Z",
  },
  {
    id: "txn_004",
    type: "cable-tv",
    description: "DStv Compact - 7023456789",
    amount: 15700,
    status: "pending",
    reference: "PZ-CAB-20240313-004",
    date: "2024-03-13T16:45:00Z",
  },
  {
    id: "txn_005",
    type: "wallet-funding",
    description: "Wallet Funding via Card",
    amount: 50000,
    status: "success",
    reference: "PZ-WLT-20240312-005",
    date: "2024-03-12T11:30:00Z",
  },
  {
    id: "txn_006",
    type: "airtime",
    description: "Glo Airtime - 08055512345",
    amount: 500,
    status: "failed",
    reference: "PZ-AIR-20240311-006",
    date: "2024-03-11T08:20:00Z",
  },
  {
    id: "txn_007",
    type: "data",
    description: "MTN 5GB Data - 08012345678",
    amount: 2500,
    status: "success",
    reference: "PZ-DAT-20240310-007",
    date: "2024-03-10T13:00:00Z",
  },
  {
    id: "txn_008",
    type: "electricity",
    description: "EKEDC Postpaid - 98765432100",
    amount: 25000,
    status: "success",
    reference: "PZ-ELC-20240309-008",
    date: "2024-03-09T10:30:00Z",
  },
];

export const mockDataBundles: Record<string, DataBundle[]> = {
  mtn: [
    { id: "mtn_1", name: "500MB", amount: 500, validity: "30 days", dataAmount: "500MB" },
    { id: "mtn_2", name: "1GB", amount: 1000, validity: "30 days", dataAmount: "1GB" },
    { id: "mtn_3", name: "2GB", amount: 1200, validity: "30 days", dataAmount: "2GB" },
    { id: "mtn_4", name: "3GB", amount: 1500, validity: "30 days", dataAmount: "3GB" },
    { id: "mtn_5", name: "5GB", amount: 2500, validity: "30 days", dataAmount: "5GB" },
    { id: "mtn_6", name: "10GB", amount: 5000, validity: "30 days", dataAmount: "10GB" },
  ],
  airtel: [
    { id: "air_1", name: "750MB", amount: 500, validity: "14 days", dataAmount: "750MB" },
    { id: "air_2", name: "1.5GB", amount: 1000, validity: "30 days", dataAmount: "1.5GB" },
    { id: "air_3", name: "2GB", amount: 1200, validity: "30 days", dataAmount: "2GB" },
    { id: "air_4", name: "3GB", amount: 1500, validity: "30 days", dataAmount: "3GB" },
    { id: "air_5", name: "4.5GB", amount: 2000, validity: "30 days", dataAmount: "4.5GB" },
    { id: "air_6", name: "10GB", amount: 3000, validity: "30 days", dataAmount: "10GB" },
  ],
  glo: [
    { id: "glo_1", name: "1.35GB", amount: 500, validity: "14 days", dataAmount: "1.35GB" },
    { id: "glo_2", name: "2.9GB", amount: 1000, validity: "30 days", dataAmount: "2.9GB" },
    { id: "glo_3", name: "4.1GB", amount: 1500, validity: "30 days", dataAmount: "4.1GB" },
    { id: "glo_4", name: "7.7GB", amount: 2500, validity: "30 days", dataAmount: "7.7GB" },
    { id: "glo_5", name: "10GB", amount: 3000, validity: "30 days", dataAmount: "10GB" },
  ],
  "9mobile": [
    { id: "9m_1", name: "500MB", amount: 500, validity: "30 days", dataAmount: "500MB" },
    { id: "9m_2", name: "1.5GB", amount: 1000, validity: "30 days", dataAmount: "1.5GB" },
    { id: "9m_3", name: "2GB", amount: 1200, validity: "30 days", dataAmount: "2GB" },
    { id: "9m_4", name: "3GB", amount: 1500, validity: "30 days", dataAmount: "3GB" },
    { id: "9m_5", name: "4.5GB", amount: 2000, validity: "30 days", dataAmount: "4.5GB" },
  ],
};

export const mockCableBouquets: Record<string, CableBouquet[]> = {
  dstv: [
    { id: "ds_1", name: "DStv Padi", amount: 2500, channels: 40 },
    { id: "ds_2", name: "DStv Yanga", amount: 3500, channels: 65 },
    { id: "ds_3", name: "DStv Confam", amount: 6200, channels: 95 },
    { id: "ds_4", name: "DStv Compact", amount: 10500, channels: 130 },
    { id: "ds_5", name: "DStv Compact Plus", amount: 16600, channels: 155 },
    { id: "ds_6", name: "DStv Premium", amount: 37000, channels: 200 },
  ],
  gotv: [
    { id: "go_1", name: "GOtv Smallie", amount: 1300, channels: 30 },
    { id: "go_2", name: "GOtv Jinja", amount: 2700, channels: 45 },
    { id: "go_3", name: "GOtv Jolli", amount: 4150, channels: 65 },
    { id: "go_4", name: "GOtv Max", amount: 5700, channels: 75 },
    { id: "go_5", name: "GOtv Supa", amount: 7600, channels: 90 },
  ],
  startimes: [
    { id: "st_1", name: "Nova", amount: 1200, channels: 25 },
    { id: "st_2", name: "Basic", amount: 2100, channels: 40 },
    { id: "st_3", name: "Smart", amount: 3200, channels: 55 },
    { id: "st_4", name: "Classic", amount: 3200, channels: 70 },
    { id: "st_5", name: "Super", amount: 5700, channels: 85 },
  ],
};

export const discoList = [
  { id: "ikeja", name: "Ikeja Electric (IKEDC)" },
  { id: "eko", name: "Eko Electric (EKEDC)" },
  { id: "abuja", name: "Abuja Electric (AEDC)" },
  { id: "portharcourt", name: "Port Harcourt Electric (PHED)" },
  { id: "benin", name: "Benin Electric (BEDC)" },
  { id: "kaduna", name: "Kaduna Electric (KDEDC)" },
  { id: "enugu", name: "Enugu Electric (EEDC)" },
  { id: "ibadan", name: "Ibadan Electric (IBEDC)" },
  { id: "jos", name: "Jos Electric (JED)" },
  { id: "kano", name: "Kano Electric (KEDC)" },
  { id: "yola", name: "Yola Electric (YEDC)" },
];

export const networkLogos: Record<string, { name: string; color: string }> = {
  mtn: { name: "MTN", color: "#FFCC00" },
  airtel: { name: "Airtel", color: "#FF0000" },
  glo: { name: "Glo", color: "#00A651" },
  "9mobile": { name: "9mobile", color: "#006B3F" },
};
