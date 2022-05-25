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
                            <button className="ui button" onClick={() => cashRegisterStore.addServiceToCart(p.serviceId)}>Add</button>
                        </div>
                        <img className="ui avatar image" src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Google_Photos_icon_%282020%29.svg/800px-Google_Photos_icon_%282020%29.svg.png" />
                        <div className="middle floated content">
                            <h4>{p.serviceName}</h4>
                        </div>
                        <div className="right floated content">
                            <div className="ui green label">
                                {p.price}{p.metric}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </>
    )
});
