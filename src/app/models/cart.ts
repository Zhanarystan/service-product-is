import { EstablishmentProduct } from "./establishmentProduct";
import { EstablishmentService } from "./establishmentService";

export interface Cart {
    cartProducts: EstablishmentProduct[];
    cartServices: EstablishmentService[];
    sum: number;
}

