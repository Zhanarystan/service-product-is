import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { EstablishmentWithList } from "../../../../app/models/establishment";
import { useStore } from "../../../../app/stores/store";
import { Map, Placemark, YMaps } from "react-yandex-maps";
import Loading from "../../../common/Loading";
import ProductList from "./ProductList";
import { EstablishmentProduct } from "../../../../app/models/establishmentProduct";
import EditForm from "./EditForm";

export default observer(function EstablishmentEditPage() {

    const {establishmentStore} = useStore();
    const {getEstablishment, setLoadingInitial, loadingInitial, establishment} = establishmentStore;
    
    let { id } = useParams<{id: string}>();

    const [products, setProducts] = useState<EstablishmentProduct[]>([] as EstablishmentProduct[]);


    useEffect(() => {
        getEstablishment(+id).then(result => {
            setProducts(result.products);
        });
    }, [establishmentStore]);

    if(loadingInitial || !establishment) return <Loading />

    return (
        <>
            <h1>Детали заведений</h1>
            <div className="row">
                <div className="col-6">
                    <EditForm establishment={establishment} />
                </div>
                <div className="col-6">
                    <ProductList products={products} />
                </div>
            </div>
        </>
    )
});