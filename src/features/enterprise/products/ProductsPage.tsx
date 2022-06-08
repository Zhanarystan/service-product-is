import { observer } from 'mobx-react-lite';
import React, { FormEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { EstablishmentProduct } from "../../../app/models/establishmentProduct";
import enterpriseAdminStore from '../../../app/stores/enterpriseAdminStore';
import { useStore } from '../../../app/stores/store';
import Loading from '../../common/Loading';

export default observer(function ProductsPage() {
    
    const {enterpriseAdminStore: {productsAtEstablishmentCopy, updatedProducts, 
            addProductToUpdate, getEstablishment, updateProductsAtEstablishment, loading}} = useStore();
    const [searchString, setSearchString] = useState<string>("" as string);

    useEffect(() => {
        getEstablishment();
    }, [])

    const updatePrice = (e: any, id: number) => {
        let copyProducts = [...productsAtEstablishmentCopy];
        let index = copyProducts.findIndex(cp => cp.productId == id);
        let product = copyProducts[index];
        product.price = +e.target.value;
        addProductToUpdate(product);
    }

    const updateAmount = (e: any, id: number) => {
        let copyProducts = [...productsAtEstablishmentCopy];
        let index = copyProducts.findIndex(cp => cp.productId == id);
        let product = copyProducts[index];
        product.amount = +e.target.value;
        addProductToUpdate(product); 
    }

    const updateProducts = (e: any) => {
        e.preventDefault();
        updateProductsAtEstablishment();
    }
    return (
        <div className='container mt-5'>
            {loading ? <Loading/> : ""}
            <div className="d-flex">
                <Link to='/enterprise/admin/products-to-add'>
                    <button className='ui button green'>Добавить товар</button>
                </Link>
                <button className='ui button blue'>Запросить на добавление нового товара</button>
                {updatedProducts.length > 0 ? <button className='ui button teal' onClick={(e) => updateProducts(e)}>Обновить</button> : ""}
            </div>
            <div className="ui fluid icon input" style={{marginTop: "10px"}}>
                <input type="text" placeholder="Имя продукта..." onChange={(e) => setSearchString(e.target.value)} />
                <i className="search icon"></i>
            </div>
            <table className="ui very basic table">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Наименование</th>
                        <th>Штрих код</th>
                        <th>Цена</th>
                        <th>Количество</th>
                        <th>Метрика</th>
                    </tr>
                </thead>
                <tbody>
                    {productsAtEstablishmentCopy.filter(p => p.productName.includes(searchString)).map((p, index) => (
                        <tr>
                            <td><div style={{padding: "5px"}}>{p.productId}</div></td>
                            <td><div style={{padding: "5px"}}>{p.productName}</div></td>
                            <td><div style={{padding: "5px"}}>{p.productBarCode}</div></td>
                            <td>
                                <input
                                    type="number" 
                                    value={p.price} 
                                    style={{padding: "5px"}}
                                    onChange={(e) => updatePrice(e, p.productId)}
                                />
                            </td>
                            <td>
                                {p.metric === "тг/шт" ?
                                <input 
                                    type="number" 
                                    value={p.amount} 
                                    style={{padding: "5px"}}
                                    onChange={(e) => updateAmount(e, p.productId)}
                                    />
                                :""}
                            </td>
                            <td><div style={{padding: "5px"}}>{p.metric}</div></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
});