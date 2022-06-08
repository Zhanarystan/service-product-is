import { observer } from "mobx-react-lite";
import React from "react";
import { EstablishmentProduct } from "../../../app/models/establishmentProduct";
import { useStore } from "../../../app/stores/store";
import CartProduct from "./CartProduct";
import CartItem from "./CartProduct";
import CartService from "./CartService";

export default observer(function Cart() {
    const {cashRegisterStore: {cart, sendEstimate}} = useStore();
    return (
        <>
            {cart.cartProducts.length !== 0 ?<div className="card">
                <div className="card-body" style={{height: "300px", overflowY: "scroll"}}>
                    {cart.cartProducts.map(p => (
                        <CartProduct product={p}/>
                    ))}
                </div>
            </div> : ""}
            {cart.cartServices.length !== 0 ? <div className="card">
                <div className="card-body" style={{height: "300px", overflowY: "scroll"}}>
                    {cart.cartServices.map(s => (
                        <CartService service={s}/>
                    ))}
                </div>
            </div> : ""}
            <div className="card">
                <div className="card-body">
                    <div className="row">
                        <div className="col-9">
                            <h3>Итог</h3>
                        </div>
                        <div className="col-3">
                            <h3>{cart.sum}тг</h3>
                        </div>
                    </div>
                </div>
            </div>
            {cart.cartProducts.length !== 0 || cart.cartServices.length !== 0 ?
        <button className="ui button green mt-3" onClick={sendEstimate}>Отправить</button>
            : ""}
        </>
    )
});