import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { useStore } from '../../../app/stores/store';
import Loading from '../../common/Loading';

export default observer(function ProductListToAddPage() {
    const 
    {
        adminStore: 
        {
            loading, 
            getProducts, 
            products, 
            currentPage, 
            setCurrentPage
        },
        enterpriseAdminStore: 
        {
            productsAtEstablishment,
            getEstablishment,
            productsToAdd,
            addProduct,
            removeProduct,
            clearProducts
        }
    } = useStore();
    const [searchingString, setSearchString] = useState<string>("");

    useEffect(() => {
        clearProducts();
        getEstablishment();
        getProducts();
    },[]);

    return (
        <div className='container mt-5'>
            {productsToAdd.length !== 0 ?
                    <button className='ui button teal floated right'>Отправить</button>
            : ""}
            <div className="ui fluid icon input" style={{marginTop: "10px"}}>
                <input type="text" placeholder="Имя продукта..." onChange={(e) => setSearchString(e.target.value)} />
                <i className="search icon"></i>
            </div>
            {loading ? <Loading/> : ""}
            <table className="ui striped table">
                <thead>
                    <tr>
                        <th>Наименование</th>
                        <th>Штрих код</th>
                        <th>Производитель</th>
                        <th>Действие</th>
                    </tr>
                </thead>
                <tbody>
                    {products.filter(p => 
                        !productsAtEstablishment.map(pa => pa.productId).includes(p.id) &&
                        p.name.toLowerCase().startsWith(searchingString.toLowerCase()))
                        .slice(currentPage * 10 - 10, currentPage * 10)
                        .map(p => (
                        <tr>
                            <td>{p.name}</td>
                            <td>{p.barCode}</td>
                            <td>{p.manufacturer}</td>
                            <td>
                                <div className="d-flex">
                                    <button 
                                        className={productsToAdd.findIndex(pa => pa.id == p.id) === -1 ? `ui icon button green` : `ui icon button red`}
                                        onClick={() => {
                                            if(productsToAdd.findIndex(pa => pa.id == p.id) === -1) {
                                                addProduct(p);
                                            }
                                            else {
                                                removeProduct(p.id);
                                            }
                                        }}
                                        >
                                        <i className={productsToAdd.findIndex(pa => pa.id == p.id) === -1 ? `plus icon` : `close icon`}></i>
                                    </button>
                                    {productsToAdd.findIndex(pa => pa.id == p.id) !== -1 ? 
                                    <div className="d-flex">
                                        <div className='ui input'>
                                            <input type="number" placeholder='Укажите цену'/>
                                        </div>
                                        {p.metric == "тг/шт" ? 
                                            <div className="ui input">
                                                <input type="number" placeholder='Укажите количество' />
                                            </div>
                                            : ""
                                        }
                                    </div>
                                         : ""    
                                    }
                                </div>
                                
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>        
            <button className="ui left labeled icon button" onClick={() => setCurrentPage(currentPage - 1)}>
                <i className="left arrow icon"></i>
                Предыдущая
            </button>
            <div className="ui input labeled icon" style={{width: "100px"}}>
                <input type="number" value={currentPage} onChange={(e) => setCurrentPage(+e.target.value)}/>
            </div>
            <button className="ui right labeled icon button" onClick={() => setCurrentPage(currentPage + 1)}>
                <i className="right arrow icon"></i>
                Следующая
            </button>
        </div>
    )
});