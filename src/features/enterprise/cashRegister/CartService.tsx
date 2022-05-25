import { observer } from "mobx-react-lite";
import React from "react";
import { EstablishmentProduct } from "../../../app/models/establishmentProduct";
import { EstablishmentService } from "../../../app/models/establishmentService";
import { useStore } from "../../../app/stores/store";

interface Props {
    service: EstablishmentService;
}
export default observer(function CartService({service} : Props) {
    const {cashRegisterStore: {addServiceToCart, setServiceAmount, removeFromServiceCart}} = useStore();
    return (
        <div className="row mb-4">
            <div className="col-2">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Google_Photos_icon_%282020%29.svg/800px-Google_Photos_icon_%282020%29.svg.png" 
                    alt="img" 
                    style={{width: "50px", height: "50px"}}
                />
            </div>
            <div className="col-3">
                <p>{service.serviceName}</p>
            </div>
            <div className="col-4">
                <div className="d-flex justify-content-between">
                    <button className="ui left attached button" onClick={() => setServiceAmount(service.serviceId, service.amount! - 1)}>-</button>
                    <div className="ui fluid action input" style={{width: "80px"}}>
                        <input type="number" step="any" value={service ? service.amount : 0} onChange={(e) => setServiceAmount(service.serviceId, +e.target.value)} />       
                    </div>
                    <button className="right attached ui button" onClick={() => addServiceToCart(service.serviceId)}>+</button>
                    
                </div>
            </div>
            <div className="col-2"><p>{service.price}{service.metric}</p></div>
            <div className="col-1">
                <button className="circular ui compact icon button" onClick={() => removeFromServiceCart(service.serviceId)}>
                    <i className="x icon"></i>
                </button>
            </div>
        </div>
    )
});