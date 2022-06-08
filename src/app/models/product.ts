export interface ProductListItem {
    id: number;
    name: string;
    barCode: string;
    manufacturer: string;
    metric: string;
}

export interface ProductDetail {
    id: number;
    name: string;
    barCode: string;
    manufacturerId: number;
    manufacturer: string;
    metricId: number;
    metric: string;
    isCustom: boolean;
}

export interface ProductCreate {
    name: string;
    barCode: string;
    description: string;
    manufacturerId: number;
    metricId: number;
    isCustom: boolean;
}

export interface ProductDetail {
    id: number;
    name: string;
    barCode: string;
    description: string;
    manufacturerId: number;
    manufacturer: string;
    metricId: number;
    metric: string;
    isCustom: boolean;
}