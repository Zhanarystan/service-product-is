import { observer } from "mobx-react-lite";
import React from "react";
import { EstablishmentProduct } from "../../../app/models/establishmentProduct";
import { useStore } from "../../../app/stores/store";

interface Props {
    product: EstablishmentProduct;
}
export default observer(function CartProduct({product} : Props) {
    const {cashRegisterStore: {addProductToCart, setProductAmount, removeFromProductCart}} = useStore();
    return (
        <div className="row mb-4">
            <div className="col-5">
                <p>{product.productName}</p>
            </div>
            <div className="col-4">
                <div className="d-flex justify-content-between">
                    <button className="ui left attached button" onClick={() => setProductAmount(product.productId, product.amount - 1)}>-</button>
                    <div className="ui fluid action input" style={{width: "80px"}}>
                        <input type="number" step="any" value={product ? product.amount : 0} onChange={(e) => setProductAmount(product.productId, +e.target.value)} />
                    </div>
                    <button className="right attached ui button" onClick={() => addProductToCart(product.productId)}>+</button>
                </div>
            </div>
            <div className="col-2">
                <p>{product.price}{product.metric}</p>
            </div>
            <div className="col-1">
                <button className="circular ui compact icon button" onClick={() => removeFromProductCart(product.productId)}>
                    <i className="x icon"></i>
                </button>
            </div>
        </div>
    )
});