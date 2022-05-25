import { observer } from 'mobx-react-lite';
import React from 'react';
import { EstablishmentProduct } from '../../../../app/models/establishmentProduct';


interface Props {
    products: EstablishmentProduct[];
}

export default observer(function ProductList({products} : Props) {

    return (
        <div style={{maxHeight: "500px", overflowX: "scroll"}}>
            <h2>Продукты</h2>
        <table className="ui basic celled table" >
            <thead>
                <tr>
                    <th>Продукт</th>
                    <th>Цена</th>
                </tr>
            </thead>
            <tbody >
                {products.map( p => (
                    <tr>
                        <td>
                            <h4 className="ui image header">
                                <div className="content">
                                    {p.productName}
                                    <div className="sub header">Осталось: {p.amount}</div>
                                </div>
                            </h4>
                        </td>
                        <td>
                            {p.price}{p.metric}                            
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        </div>
    )
});