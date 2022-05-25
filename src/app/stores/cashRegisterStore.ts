import { makeAutoObservable, runInAction } from "mobx";
import { toast } from "react-toastify";
import { Toast } from "react-toastify/dist/components";
import agent from "../api/agent";
import { Cart } from "../models/cart";
import { Establishment, EstablishmentWithList } from "../models/establishment";
import { EstablishmentProduct } from "../models/establishmentProduct";
import { EstablishmentService } from "../models/establishmentService";
import { store } from "./store";

export default class CashRegisterStore {
    cashRegisterProducts: EstablishmentProduct[] = [];
    cashRegisterServices: EstablishmentService[] = [];
    cart: Cart = {cartProducts: [], cartServices: [], sum: 0};
    message: string = "";

    constructor() {
        makeAutoObservable(this);
    }

    getEstablishment = async () => {
        try {
            if(store.userStore.user === null) 
                return;
            const establishment = await agent.EstablishmentRequests.get(store.userStore.user.establishmentId!) as EstablishmentWithList;
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