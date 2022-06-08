import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { history } from '../..';
import { Establishment, EstablishmentCreateValues, EstablishmentWithList } from "../models/establishment";
import { EstablishmentProduct } from "../models/establishmentProduct";
import { Estimate, EstimateCreate } from "../models/Estimate";
import { ManufacturerCreate, ManufacturerDetail, ManufacturerListItem } from "../models/manufacturer";
import { MetricListItem } from "../models/metric";
import { PaginatedResult } from "../models/pagination";
import { ProductCreate, ProductDetail, ProductListItem } from "../models/product";
import { ServiceCreate, ServiceDetail, ServiceListItem } from "../models/service";
import { User, UserAtEstablishment, UserAtEstablishmentCreate, UserDetail, UserFormValues } from "../models/user";
import { store } from "../stores/store";


const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    })
}

axios.defaults.baseURL = 'http://localhost:5000/api';

axios.interceptors.request.use(config => {
    const token = store.commonStore.token;
    if(token) config.headers!.Authorization = `Bearer ${token}`;
    return config;
})

axios.interceptors.response.use(async response => {
    await sleep(1000);
    return response;
});

// axios.interceptors.response.use(async response => {    
//     await sleep(1000);
//     const pagination = response.headers['pagination'];

//     if(pagination){
//         response.data = new PaginatedResult(response.data, JSON.parse(pagination));
//         return response as AxiosResponse<PaginatedResult<any>>;
//     }

//     return response;
// }, (error: AxiosError) => {
//     const {data, status, config} = error.response!;

//     switch(status) {
//         case 400:
//             if(typeof data === 'string') {
//                 toast.error(data);
//             }
//             if(config.method === 'get' && data.errors.hasOwnProperty('id')){
//                 history.push('/not-found');
//             }
//             if(data.errors) {
//                 const modalStateErrors = [];
//                 for(const key in data.errors) {
//                     if(data.errors[key]) {
//                         modalStateErrors.push(data.errors[key]);
//                     }
//                 }
//                 throw modalStateErrors.flat();
//             }
//             else{
//                 toast.error(data); 
//             }
//             break;
//         case 401:
//             toast.error('unauthorized');
//             break;
//         case 404:
//             history.push('/not-found');
//             break;
//         case 500:
//             store.commonStore.setServerError(data);
//             history.push('/server-error');
//             break;
// }

//     return Promise.reject(error);
// })

const responseBody = <T>(response: AxiosResponse) => response.data;

const requests = {
    get: <T>(url: string) => axios.get<T>(url).then(responseBody),
    post: <T>(url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    del: <T>(url: string) => axios.delete<T>(url).then(responseBody)
}

const Account = {
    current: () => requests.get<User>('/account'),
    login: (user: UserFormValues) => requests.post<User>('/account/login', user),
}

const EstablishmentRequests = {
    list: () => requests.get<Establishment[]>('/establishment'),
    create: (establishment: EstablishmentCreateValues) => requests.post<boolean>('/establishment', establishment),
    get: (id: number) => requests.get<EstablishmentWithList>(`/establishment/${id}`),
    updateProduct: (establishmentProduct: EstablishmentProduct) => 
        requests.put<EstablishmentProduct>(`/establishment/updateProduct`, establishmentProduct),
    uploadPhoto: <EstablishmentWithList>(establishmentId: number, file:File) => {
        let formData = new FormData();
        formData.append('File', file);
        return axios.post<EstablishmentWithList>(`/establishment/uploadPhoto/${establishmentId}`, formData, {
            headers: {'Content-type': 'multipart/form-data'}
        });
    },
    updateEstablishment: (id:number, establishment: EstablishmentCreateValues) => 
        requests.put<EstablishmentCreateValues>(`/establishment/${id}`, establishment),
}

const UserRequests = {
    usersAtCurrentEstablishment: () => requests.get<UserAtEstablishment[]>('/user/usersAtEstablishment'),
    list: () => requests.get<UserAtEstablishment[]>('/user'),
    get: (id: string) => requests.get<UserDetail>(`/user/${id}`),
    create: (user: UserAtEstablishmentCreate) => requests.post<UserAtEstablishment>('/user', user),
}

const EstimateRequests = {
    createEstimate: (estimate: EstimateCreate) => requests.post<Estimate>('/estimate', estimate),
}

const ProductRequests = {
    list: () => requests.get<ProductListItem[]>('/product'),
    create: (product: ProductCreate) => requests.post<ProductCreate>('/product', product),
    get: (id:string) => requests.get<ProductDetail>(`/product/${id}`),
    update: (id: string, product: ProductDetail) => requests.put<ProductDetail>(`/product/${id}`, product),
    delete: (id: string) => requests.del<any>(`/product/${id}`),
    uploadCSV: (file: File) => {
        let formData = new FormData();
        formData.append('File', file);
        return axios.post<ProductListItem[]>(`/product/createFromCsv`, formData, {
            headers: {'Content-type': 'multipart/form-data'}
        });
    }
}

const ServiceRequests = {
    list: () => requests.get<ServiceListItem[]>('/service'),
    create: (service: ServiceCreate) => requests.post<ServiceCreate>('/service', service),
    get: (id:string) => requests.get<ServiceDetail>(`/service/${id}`),
    update: (id: string, service: ServiceDetail) => requests.put<ServiceDetail>(`/service/${id}`, service),
    delete: (id: string) => requests.del<any>(`/service/${id}`),
    uploadCSV: (file: File) => {
        let formData = new FormData();
        formData.append('File', file);
        return axios.post<ServiceListItem[]>(`/service/createFromCsv`, formData, {
            headers: {'Content-type': 'multipart/form-data'}
        });
    }
}

const MetricRequests = {
    list: () => requests.get<MetricListItem[]>('/metric'),
}

const ManufacturerRequests = {
    list: () => requests.get<ManufacturerListItem[]>('/manufacturer'),
    create: (manufacturer: ManufacturerCreate) => requests.post<ManufacturerCreate>('/manufacturer', manufacturer),
    get: (id: string) => requests.get<ManufacturerDetail>(`/manufacturer/${id}`),
    update: (id: string, manufacturer: ManufacturerDetail) => requests.put<ManufacturerDetail>(`/manufacturer/${id}`, manufacturer),
    delete: (id: string) => requests.del<any>(`/manufacturer/${id}`)
}

const agent = {
    EstablishmentRequests,
    Account,
    UserRequests,
    EstimateRequests,
    ProductRequests,
    ServiceRequests,
    MetricRequests,
    ManufacturerRequests,
}

export default agent;