export interface User{
    token: string;
    username: string;
    establishmentId: number | null;
    roles:string[];
}

export interface UserFormValues {
    username: string;
    password: string;
}

export interface UserAtEstablishment {
    id: string;
    username: string;
    email: string;
    iin: string;
    roles: string[];
}

export interface UserAtEstablishmentCreate {
    username: string;
    password: string;
    firstName: string,
    secondName: string,
    email: string;
    iin: string;
    day: number;
    month: number;
    year: number;
    establishmentId: number,
    roles: string[];
}

export interface UserDetail {
    id: string;
    username: string;
    email: string;
    firstName: string;
    secondName: string;
    iin: string;
    day: number;
    month: number;
    year: number;
    establishmentId: number;
    establishment: string;
    roles: string[];
}