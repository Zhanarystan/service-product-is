import { observer } from "mobx-react-lite";
import React from "react";
import { EstablishmentProduct } from "../../../app/models/establishmentProduct";
import { useStore } from "../../../app/stores/store";

interface Props {
    searchKeyword: string;
}

export default observer(function ProductList({searchKeyword} : Props) {

    const {cashRegisterStore} = useStore();

    return (
        <>
            {cashRegisterStore.cashRegisterProducts.filter(p => p.productName.startsWith(searchKeyword)).map(p => (
                <div className="ui middle aligned divided list">
                    <div className="item">
                        <div className="right floated content">
                        <div className="ui green label">
                                {Math.ceil(p.price)}{p.metric}
                            </div>
                            <button className="ui button" onClick={() => cashRegisterStore.addProductToCart(p.productId)}>Добавить</button>
                        </div>
                        <div className="middle floated content">
                            <h4>{p.productName}</h4>
                            <p>{p.amount!!}</p>
                        </div>
                    </div>
                </div>
            ))}
        </>
    )
});
