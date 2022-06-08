export interface ServiceListItem {
    id: number;
    name: string;
    metric: string;
}

export interface ServiceDetail {
    id: number;
    name: string;
    description: string;
    metricId: number;
    metric: string;
}

export interface ServiceCreate {
    name: string;
    description: string;
    metricId: number;
}
