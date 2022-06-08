export interface EstablishmentProduct {
    productId: number;
    productName: string;
    productBarCode: string | null;
    price: number;
    amount: number;
    metric: string;
}