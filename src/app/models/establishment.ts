import { EstablishmentProduct } from "./establishmentProduct";
import { EstablishmentService } from "./establishmentService";

export interface Establishment {
    id: number;
    name: string;
    startWorkingTime: string;
    endWorkingTime: string;
    city: string;
    address: string;
}

export interface EstablishmentCreateValues {
    name: string;
    bankCardNumber: string;
    latitude: number;
    longitude: number;
    startWorkingTime: string;
    endWorkingTime: string;
    address: string;
    cityId: number;
}

export interface EstablishmentWithList {
    name: string;
    bankCardNumber: string;
    latitude: number;
    longitude: number;
    startWorkingTime: string;
    endWorkingTime: string;
    isOpen: boolean;
    address: string;
    city: number;
    products: EstablishmentProduct[];
    services: EstablishmentService[];
}