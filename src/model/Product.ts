export interface Product {
    id: number;
    type: string;
    description: string;
    packageWeight: number;
    packageQuantity: number;
    pricePerKg: number;
    stock: number;
    entryDate: string; // ISO string format
    expiryDate: string; // ISO string format
    status: string;
}