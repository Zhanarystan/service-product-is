import { makeAutoObservable, runInAction } from "mobx";
import { toast } from "react-toastify";
import { history } from "../..";
import agent from "../api/agent";
import { EstablishmentWithList } from "../models/establishment";
import { EstablishmentProduct } from "../models/establishmentProduct";
import { ProductListItem } from "../models/product";
import { UserAtEstablishment, UserAtEstablishmentCreate } from "../models/user";
import { store } from "./store";

export default class EnterpriseAdminStore {
    //common
    loading: boolean = false;
    errorMessages: string[] = [];
    
    //users component
    usersAtEstablishment: UserAtEstablishment[] = [];
    selectedRoles: string[] = [];

    //products component
    productsAtEstablishment: EstablishmentProduct[] = [];
    productsAtEstablishmentCopy: EstablishmentProduct[] = [];
    updatedProducts: EstablishmentProduct[] = [];

    //products-to-add component
    productsToAdd: ProductListItem[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    setLoading = (value: boolean) => {
        this.loading = value;
    }

    getUsersAtCurrentEstablishment = async () => {
        try {
            this.setLoading(true);
            const users = await agent.UserRequests.usersAtCurrentEstablishment();
            runInAction(() => this.usersAtEstablishment = users);
            this.setLoading(false);
        }catch(error) {
            console.log(error);
        }
    }

    addRole = (role: string) => {
        if(this.selectedRoles.includes(role))
            return;
        this.selectedRoles.push(role);
    }

    craeteUser = async (user: UserAtEstablishmentCreate) => {
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
                history.push('/enterprise/admin/employees');
            } else {
                toast.error("Ошибка сервера! Пользователь не создан.")
            }
        } catch (error) {
            console.log(error);
        }
    }

    addProductToUpdate = (product: EstablishmentProduct) => {
        let updatedProducts = this.updatedProducts;
        let productsAtEstablishment = this.productsAtEstablishment;
        let index = updatedProducts.findIndex(p => p.productId === product.productId);
        let index1 = productsAtEstablishment.findIndex(p => p.productId === product.productId);
        if(index !== -1) {
            console.log(product);
            console.log(productsAtEstablishment[index1]);
            if(product.price === productsAtEstablishment[index1].price && 
                product.amount === productsAtEstablishment[index1].amount) {
                updatedProducts.splice(index, 1);
            } else {
                updatedProducts[index] = product;
            }
        } else {
            updatedProducts.push(product);
        }
        runInAction(() => this.updatedProducts = updatedProducts);
    }

    getEstablishment = async () => {
        try {
            if(store.userStore.user === null)
                return;    
            const establishment = await agent.EstablishmentRequests.get(store.userStore.user.establishmentId!) as EstablishmentWithList;
            runInAction(() => {
                this.productsAtEstablishment = establishment.products;
                this.productsAtEstablishmentCopy = establishment.products;
            } );
            console.log(establishment);
        }catch(error) {
            console.log(error);
        }
    }

    updateProductsAtEstablishment = async () => {
        try {
            const updatedProducts = this.updatedProducts;
            this.setLoading(true);
            updatedProducts.forEach(async p => {
                await agent.EstablishmentRequests.updateProduct(p as EstablishmentProduct).catch(err => {
                    toast.error(err.response.data.errors);
                });
                toast.success(`Продукт ${p.productName} успешно обновлен`);
            });
            updatedProducts.splice(0, updatedProducts.length);
            this.setLoading(false);
            runInAction(() => this.updatedProducts = updatedProducts);
        } catch(error) {
            console.log(error);
        }
    }

    //products-to-add methods
    clearProducts = () => {
        const products: [] = [];
        runInAction(() => this.productsToAdd = products);
    }

    addProduct = (product: ProductListItem) => {
        const products = [...this.productsToAdd, product];
        runInAction(() => this.productsToAdd = products);
    }

    removeProduct = (id: number) => {
        const products = [...this.productsToAdd];
        let removedProductIndex = products.findIndex(p => p.id === id);
        products.splice(removedProductIndex, 1);
        runInAction(() => this.productsToAdd = products);
    }
}