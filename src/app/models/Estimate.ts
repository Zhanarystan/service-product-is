export interface EstimateProductCreate {
    price: number; 
    amount: number;
    totalSum: number;
    productId: number;
}

export interface EstimateServiceCreate {
    price: number; 
    amount: number;
    totalSum: number;
    serviceId: number;
}

export interface EstimateCreate {
    totalSum: number;
    establishmentId: number;
    products: EstimateProductCreate[];
    services: EstimateServiceCreate[];
}

export interface Estimate {
    id: number;
    totalSum: number;
    establishmentId: number;
    products: EstimateProduct[];
    services: EstimateService[];
}

export interface EstimateProduct {
    id: number;
    price: number; 
    amount: number;
    totalSum: number;
    productId: number;
}

export interface EstimateService {
    id: number;
    price: number; 
    amount: number;
    totalSum: number;
    serviceId: number;
}