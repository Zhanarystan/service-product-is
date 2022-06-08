import { observer } from "mobx-react-lite";
import React from "react";
import { EstablishmentProduct } from "../../../app/models/establishmentProduct";
import { useStore } from "../../../app/stores/store";

interface Props {
    searchKeyword: string;
}

export default observer(function ServiceList({searchKeyword} : Props) {

    const {cashRegisterStore} = useStore();

    return (
        <>
            {cashRegisterStore.cashRegisterServices.filter(p => p.serviceName.startsWith(searchKeyword)).map(p => (
                <div className="ui middle aligned divided list">
                    <div className="item">
                        <div className="right floated content">
                            <div className="ui green label">
                                {p.price}{p.metric}
                            </div>
                            <button className="ui button" onClick={() => cashRegisterStore.addServiceToCart(p.serviceId)}>Добавить</button>
                        </div>
                        <div className="middle floated content">
                            <h4>{p.serviceName}</h4>
                        </div>
                    </div>
                </div>
            ))}
        </>
    )
});
