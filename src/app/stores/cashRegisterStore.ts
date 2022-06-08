import { cp } from "fs";
import { makeAutoObservable, runInAction } from "mobx";
import { toast } from "react-toastify";
import { Toast } from "react-toastify/dist/components";
import Swal from "sweetalert2";
import agent from "../api/agent";
import { Cart } from "../models/cart";
import { Establishment, EstablishmentWithList } from "../models/establishment";
import { EstablishmentProduct } from "../models/establishmentProduct";
import { EstablishmentService } from "../models/establishmentService";
import { EstimateProductCreate, EstimateServiceCreate } from "../models/Estimate";
import { store } from "./store";

export default class CashRegisterStore {
    cashRegisterProducts: EstablishmentProduct[] = [];
    cashRegisterServices: EstablishmentService[] = [];
    cart: Cart = {cartProducts: [] as EstablishmentProduct[], cartServices: [] as EstablishmentService[], sum: 0};
    message: string = "";
    loading: boolean = false;
    productsTabSelected = true;
    showModal = false;

    constructor() {
        makeAutoObservable(this);
    }

    setLoading = (value: boolean) => {
        this.loading = value;
    }
    setProductsTabSelected = (value: boolean) => {
        this.productsTabSelected = value;
    }

   
    sendEstimate = async () => {
        this.setLoading(true);
        const cart = this.cart;
        if(store.userStore.user === null) {
            this.setLoading(false);
            return;
        }
        try {
            const establishment = await agent.EstablishmentRequests.get(store.userStore.user.establishmentId!) as EstablishmentWithList;
            const estimate = {
                totalSum: cart.sum,
                establishmentId: establishment.id,                                                                                                                                                      
                products: [] as EstimateProductCreate[],
                services: [] as EstimateServiceCreate[]
            };
            let alertMessage = "";                                                                                                                                          
            if(cart.cartProducts.length > 0) {
                cart.cartProducts.forEach(cp => {
                    estimate.products.push({
                        price: cp.price / cp.amount,
                        amount: cp.amount,
                        totalSum: cp.price,
                        productId: cp.productId
                    });
                });
            }

            if(cart.cartServices.length > 0) {
                cart.cartServices.forEach(cs => {
                    estimate.services.push({
                        price: cs.price/cs.amount!,
                        amount: cs.amount!,
                        totalSum: cs.price,
                        serviceId: cs.serviceId
                    });
                })
            }
            alertMessage += `${cart.sum}`
            const cashRegisterProducts = this.cashRegisterProducts;
            agent.EstimateRequests.createEstimate(estimate)
                .then(response => {
                    Swal.fire({
                        title: 'Смета успешно создана',
                        icon:"success"
                    });
                });
            cart.cartProducts.forEach(p => {
                cashRegisterProducts.find(rp => rp.productId == p.productId)!.amount -= p.amount; 
            })
            runInAction(() => {
                this.cashRegisterProducts = cashRegisterProducts;
                this.cart = {cartProducts: [] as EstablishmentProduct[], cartServices: [] as EstablishmentService[], sum: 0};
            });
            this.setLoading(false);
        } catch (error) {
            console.log(error);
        }
        this.setLoading(false);
    } 

    getEstablishment = async () => {
        try {
            if(store.userStore.user === null) 
                return;
            const establishment = await agent.EstablishmentRequests.get(store.userStore.user.establishmentId!) as EstablishmentWithList;
            if(establishment.products.length === 0) {
                this.productsTabSelected = false;
            }
            runInAction(() => {
                this.cashRegisterProducts = establishment.products;
                this.cashRegisterServices = establishment.services;
            } );
            console.log(establishment);
        }catch(error) {
            console.log(error);
        }
    }

    addProductToCart = (id: number) => {
        let index = this.cart.cartProducts.findIndex(i => i.productId === id);
        let index1 = this.cashRegisterProducts.findIndex(i => i.productId === id);
        if(this.cashRegisterProducts[index1].amount === 0) {
            toast.error('Количество продукта на корзине превышает доступное количество', {position: toast.POSITION.BOTTOM_RIGHT});
            return;
        }
        if(index === -1) {
            let productFromCashRegister = this.cashRegisterProducts[index1];
            let newCartItem = {
                productId: productFromCashRegister.productId,
                productName: productFromCashRegister.productName,
                productBarCode: productFromCashRegister.productBarCode,
                price: productFromCashRegister.price,
                amount: 1,
                metric: productFromCashRegister.metric
            };
            this.cart.cartProducts.push(newCartItem);
            this.updateTotalCost();
        } else { 
            this.setProductAmount(id, this.cart.cartProducts[index].amount + 1);
        }
    }

    addServiceToCart = (id: number) => {
        let index = this.cart.cartServices.findIndex(i => i.serviceId === id);
        let index1 = this.cashRegisterServices.findIndex(i => i.serviceId === id);
        if(index === -1) {
            let serviceFromCashRegister = this.cashRegisterServices[index1];
            let newCartService = {
                serviceId: serviceFromCashRegister.serviceId,
                serviceName: serviceFromCashRegister.serviceName,
                price: serviceFromCashRegister.price,
                amount: 1,
                metric: serviceFromCashRegister.metric
            };
            this.cart.cartServices.push(newCartService);
            this.updateTotalCost();
        } else {
            this.setServiceAmount(id, this.cart.cartServices[index].amount! + 1);
        }
    }

    setProductAmount = (id: number, count: number) => {
        if(count <= 0) {
            toast.error('Неверное количество', {position: toast.POSITION.BOTTOM_RIGHT});
            return;
        }
        let index = this.cart.cartProducts.findIndex(i => i.productId === id);
        let index1 = this.cashRegisterProducts.findIndex(i => i.productId === id);
        if(count > this.cashRegisterProducts[index1].amount) {
            toast.error('Количество продукта на корзине превышает доступное количество', {position: toast.POSITION.BOTTOM_RIGHT});
            return;
        }
        this.cart.cartProducts[index].amount = count;
        this.cart.cartProducts[index].price = +(this.cashRegisterProducts[index1].price * this.cart.cartProducts[index].amount).toFixed(2);
        this.updateTotalCost();
    }

    setServiceAmount = (id: number, count: number) => {
        if(count <= 0) {
            toast.error('Неверное количество', {position: toast.POSITION.BOTTOM_RIGHT});
            return;
        }
        let index = this.cart.cartServices.findIndex(i => i.serviceId === id);
        let index1 = this.cashRegisterServices.findIndex(i => i.serviceId === id);
        this.cart.cartServices[index].amount! = count;
        this.cart.cartServices[index].price = +(this.cashRegisterServices[index1].price * (this.cart.cartServices[index].amount!)).toFixed(2);
        this.updateTotalCost();
    }

    removeFromServiceCart = (id: number) => {
        let index = this.cart.cartServices.findIndex(i => i.serviceId === id);
        this.cart.cartServices.splice(index, 1);
        this.updateTotalCost();
    }

    removeFromProductCart = (id: number) => {
        let index = this.cart.cartProducts.findIndex(i => i.productId === id);
        this.cart.cartProducts.splice(index, 1);
        this.updateTotalCost();
    }

    updateTotalCost = () => {
        let initialValue = 0;
        let productsSum = +this.cart.cartProducts.reduce(function(accumulator, curValue) {
            return accumulator + curValue.price
        }, initialValue).toFixed(2);

        let servicesSum = +this.cart.cartServices.reduce(function(accumulator, curValue) {
            return accumulator + curValue.price
        }, initialValue).toFixed(2);

        this.cart.sum = servicesSum + productsSum;
    }
}