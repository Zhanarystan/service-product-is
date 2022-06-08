import { makeAutoObservable, runInAction } from "mobx";
import { toast } from "react-toastify";
import agent from "../api/agent";
import { history } from "../..";
import { UserAtEstablishment, UserAtEstablishmentCreate, UserDetail } from "../models/user";
import { ProductCreate, ProductDetail, ProductListItem } from "../models/product";
import { ManufacturerCreate, ManufacturerDetail, ManufacturerListItem } from "../models/manufacturer";
import { MetricListItem } from "../models/metric";
import { store } from "./store";
import { ServiceCreate, ServiceDetail, ServiceListItem } from "../models/service";

export default class AdminStore {
    //user
    users: UserAtEstablishment[] = [];
    userDetail: UserDetail = {} as UserDetail;

    //product 
    products: ProductListItem[] = [];
    productDetail: ProductDetail = {} as ProductDetail;

    //service
    services: ServiceListItem[] = [];
    serviceDetail: ServiceDetail = {} as ServiceDetail;

    //manufacturer
    manufacturers: ManufacturerListItem[] = [];
    manufacturer: ManufacturerDetail = {} as ManufacturerDetail;

    //metric 
    metrics: MetricListItem[] = [];

    //common 
    loading: boolean = false;
    removeLoading: boolean = false;
    errorMessages: string[] = [];
    currentPage: number = 1;
    maxPage: number = 1;


    //methods
    //common methods
    constructor() {
        makeAutoObservable(this);
    }

    setLoading = (value: boolean) => {
        this.loading = value;
    }

    setRemoveLoading = (value: boolean) => {
        this.removeLoading = value;
    }

    setCurrentPage = (value: number) => {
        if(value > this.maxPage || value < 1) {
            return;
        }
        this.currentPage = value;
    }

    //user methods
    getUsers = async () => {
        try {
            this.setLoading(true);
            const users = await agent.UserRequests.list();
            this.maxPage = Math.ceil(users.length / 10);
            runInAction(() => {
                this.users = users;
            });   
        this.setLoading(false);
        } catch(error) {
            console.log(error);
        }
    }

    createUser = async(user: UserAtEstablishmentCreate) => {
        try {
            this.setLoading(true);
            let success = true;
            let errorMessages: string[] = [];
            await agent.UserRequests.create(user).catch(error => {
                errorMessages = error.response.data.errors;
                success = false;
            });
            runInAction(() => this.errorMessages = errorMessages);
            this.setLoading(false);
            if(success) {
                toast.success("Новый пользователь успешно создан");
                history.push('/admin/users');
            } else {
                toast.error("Ошибка сервера! Пользователь не создан.")
            }
        } catch(error) {
            console.log(error);
        }
    }

    getUser = async (id: string) => {
        try {
            this.setLoading(true);
            const user = await agent.UserRequests.get(id);
            console.log(user.value);
            runInAction(() => this.userDetail = user.value);
            this.setLoading(false);
        } catch(error) {
            console.log(error);
        }
    }
    
    //product methods
    getProducts = async () => {
        try {
            this.setLoading(true);
            const products = await agent.ProductRequests.list();
            this.maxPage = Math.ceil(products.length / 10);
            runInAction(() => this.products = products);
            this.setLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    createProduct = async (product: ProductCreate) => {
        try {
            this.setLoading(true);
            await agent.ProductRequests.create(product)
                .then(response => {
                    toast.success("Продукт успешно создан");
                    history.push("/admin/products");
                });
            this.setLoading(false);
        } catch(error) {
            console.log(error);
        }
    }

    getProduct = async (id: string) => {
        try {
            this.setLoading(true);
            const product = await agent.ProductRequests.get(id);
            console.log("ss");
            console.log(product);
            runInAction(() => this.productDetail = product);
            this.setLoading(false);
        } catch(error) {
            console.log(error);
        }
    }

    updateProduct = async (id: string, product: ProductDetail) => {
        try {
            this.setLoading(true);
            const repsonse = await agent.ProductRequests.update(id, product)
                .then(response => {
                    toast.success("Продукт успешно обновлен");
                    history.push("/admin/products");
                })
                .catch(error => {
                    toast.error("Продукт не обновлен. Ошибка сервера");
                    history.push("/admin/products");
                }) 
        } catch(error) {
            console.log(error);
        }
    }

    deleteProduct = async (id: string) => {
        try {
            this.setRemoveLoading(true);
            await agent.ProductRequests.delete(id)
                .then(response => {
                    toast.success("Продукт успешно удален")
                    history.push("/admin/products");
                })
                .catch(error => {
                    toast.error("Продукт не обновлен. Ошибка сервера");
                    history.push("/admin/products");
                });
            this.setRemoveLoading(false);
        } catch(error) {
            console.log(error);
        }
    }

    uploadProductsCSV = async (file: File) => {
        if(!store.userStore.user) return;
        this.setLoading(true);
        try {
            await agent.ProductRequests.uploadCSV(file!)
                .then(response => {
                    toast.success("Данные усепшно добавлены!");
                    runInAction(() => this.products = response.data as ProductListItem[]);
                })
                .catch(err => {
                    toast.error("Данные не добавлены!");
                });
            this.setLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    //service methods
    getServices = async () => {
        try {
            this.setLoading(true);
            const services = await agent.ServiceRequests.list();
            this.maxPage = Math.ceil(services.length / 10);
            runInAction(() => this.services = services);
            this.setLoading(false);
        } catch (error) {
            console.log(error);
        }
    }
    
    createService = async (service: ServiceCreate) => {
        try {
            this.setLoading(true);
            await agent.ServiceRequests.create(service)
                .then(response => {
                    toast.success("Продукт успешно создан");
                    history.push("/admin/services");
                });
            this.setLoading(false);
        } catch(error) {
            console.log(error);
        }
    }
    
    getService = async (id: string) => {
        try {
            this.setLoading(true);
            const service = await agent.ServiceRequests.get(id);
            console.log("ss");
            console.log(service);
            runInAction(() => this.serviceDetail = service);
            this.setLoading(false);
        } catch(error) {
            console.log(error);
        }
    }
    
    updateService = async (id: string, service: ServiceDetail) => {
        try {
            this.setLoading(true);
            const repsonse = await agent.ServiceRequests.update(id, service)
                .then(response => {
                    toast.success("Продукт успешно обновлен");
                    history.push("/admin/services");
                })
                .catch(error => {
                    toast.error("Продукт не обновлен. Ошибка сервера");
                    history.push("/admin/services");
                }) 
        } catch(error) {
            console.log(error);
        }
    }
    
    deleteService = async (id: string) => {
        try {
            this.setRemoveLoading(true);
            await agent.ServiceRequests.delete(id)
                .then(response => {
                    toast.success("Продукт успешно удален")
                    history.push("/admin/services");
                })
                .catch(error => {
                    toast.error("Продукт не обновлен. Ошибка сервера");
                    history.push("/admin/services");
                });
            this.setRemoveLoading(false);
        } catch(error) {
            console.log(error);
        }
    }
    
    uploadServicesCSV = async (file: File) => {
        if(!store.userStore.user) return;
        this.setLoading(true);
        try {
            await agent.ServiceRequests.uploadCSV(file!)
                .then(response => {
                    console.log("yes");
                    toast.success("Данные усепшно добавлены!");
                    runInAction(() => this.services = response.data as ServiceListItem[]);
                })
                .catch(err => {
                    console.log("no");
                    toast.error("Данные не добавлены!");
                });
            this.setLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    //manufacturer methods
    getManufacturers = async() => {
        try {
            this.setLoading(true);
            const manufacturers = await agent.ManufacturerRequests.list();
            this.maxPage = Math.ceil(manufacturers.length / 10);
            runInAction(() => this.manufacturers = manufacturers);
            this.setLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    getManufacturer = async (id: string) => {
        try {
            this.setLoading(true);
            const manufacturer = await agent.ManufacturerRequests.get(id);
            runInAction(() => this.manufacturer = manufacturer);
            this.setLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    createManufacturer = async (manufacturer: ManufacturerCreate) => {
        try {
            this.setLoading(true);
            await agent.ManufacturerRequests.create(manufacturer)
                .then(response => {
                    toast.success("Запись успешно создан");
                    history.push("/admin/manufacturers");
                });
            this.setLoading(false);
        } catch(error) {
            console.log(error);
        }
    }
    
    updateManufacturer = async (id: string, manufacturer: ManufacturerDetail) => {
        try {
            this.setLoading(true);
            const repsonse = await agent.ManufacturerRequests.update(id, manufacturer)
                .then(response => {
                    toast.success("Запись успешно обновлен");
                    history.push("/admin/manufacturers");
                })
                .catch(error => {
                    toast.error("Запись не обновлен. Ошибка сервера");
                    history.push("/admin/manufacturers");
                }) 
            this.setLoading(false);
        } catch(error) {
            console.log(error);
        }
    }
    
    deleteManufacturer = async (id: string) => {
        try {
            this.setRemoveLoading(true);
            await agent.ManufacturerRequests.delete(id)
                .then(response => {
                    toast.success("Запись успешно удален")
                    history.push("/admin/manufacturers");
                })
                .catch(error => {
                    toast.error("Запись не обновлен. Ошибка сервера");
                    history.push("/admin/manufacturers");
                });
            this.setRemoveLoading(false);
        } catch(error) {
            console.log(error);
        }
    }


    //metric methods
    getMetrics = async () => {
        try {
            const metrics = await agent.MetricRequests.list();
            this.maxPage = Math.ceil(metrics.length / 10);
            runInAction(() => this.metrics = metrics);
        } catch(error) {
            console.log(error);
        }
    }
}