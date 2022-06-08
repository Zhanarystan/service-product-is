import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { useStore } from "../../../app/stores/store";
import Loading from "../../common/Loading";
import Cart from "./Cart";
import ProductList from "./ProductList";
import ServiceList from "./ServiceList";

export default observer(function CashRegister() {

    const {cashRegisterStore: {cashRegisterProducts, cashRegisterServices, getEstablishment, 
            loading, productsTabSelected, setProductsTabSelected}} = useStore();
    const [searchKeyword, setSearchKeyword] = useState<string>("" as string);

    useEffect(() => {
        getEstablishment();
    }, [loading]);

    if(loading) return <Loading/>;
    return (
        <>            
            <div className="row">
                <div className="col-1"></div>      
                <div className="col-6">
                    <div className="ui fluid icon input">
                        <input type="text" placeholder="Search a very wide input..."  onChange={(e) => setSearchKeyword(e.target.value)}/>
                        <i className="search icon"></i>
                    </div>
                    <div id="context2">
                        <div className="ui secondary menu">
                            {cashRegisterProducts.length !== 0 ? <a className={productsTabSelected ? "item active" : "item"} 
                                data-tab="fourth" 
                                onClick={() => setProductsTabSelected(true)}>
                                    Продукты
                            </a>: ""}
                            {cashRegisterServices.length !== 0 ? <a className={!productsTabSelected ? "item active" : "item"} 
                                data-tab="fifth"
                                onClick={() => setProductsTabSelected(false)}>
                                    Сервисы
                            </a> : ""}
                        </div>
                        {productsTabSelected ? <ProductList searchKeyword={searchKeyword}/> : <ServiceList searchKeyword={searchKeyword}/>}
                        
                    </div>
                    
                </div>
                <div className="col-4">
                    <div className="card">
                        <div className="card-body" style={{height: "80px"}}>
                            <h2>Касса</h2>
                        </div>
                    </div>
                    <Cart />    
                </div>
                <div className="col-1"></div>
                <ToastContainer position="bottom-right"/>
            </div>
        
        </>
    )
});