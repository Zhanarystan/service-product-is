import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../../../app/stores/store";
import Loading from "../../common/Loading";

export default observer(function EstablishmentListPage() {

    const {establishmentStore} = useStore();

    useEffect(() => {
        establishmentStore.getEstablishmentList();
    }, [establishmentStore]);

    return (
        <>
            <h1>Заведения</h1>
            <Link to={`/admin/establishments-create`}>
                <button className="medium green ui button">
                    <div className="d-flex">
                        <i className="plus icon"></i>
                        <p>Добавить</p>
                    </div>
                </button>
            </Link>
            {establishmentStore.loadingInitial ? <Loading/> : ""}
            <table className="ui celled table">
                <thead>
                    <tr>
                        <th>Наименование</th>
                        <th>Работает с</th>
                        <th>Работает до</th>
                        <th>Город</th>
                        <th>Аддрес</th>
                        <th>Действие</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        establishmentStore.establishmentList.slice(establishmentStore.currentPage * 10 - 10, establishmentStore.currentPage * 10)
                            .map(establishment => (
                            <tr>
                                <td>{establishment.name}</td>
                                <td>{establishment.startWorkingTime}</td>
                                <td>{establishment.endWorkingTime}</td>
                                <td>{establishment.city}</td>
                                <td>{establishment.address}</td>
                                <td>
                                    <Link to={`/admin/establishments/${establishment.id}`}>
                                        <button className="ui icon button">
                                            <div className="d-flex">
                                                <i className="pencil alternate icon"></i>
                                                <p>Изменить</p>
                                            </div>
                                        </button>
                                    </Link>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
            <button className="ui left labeled icon button" onClick={() => establishmentStore.setCurrentPage(establishmentStore.currentPage - 1)}>
                <i className="left arrow icon"></i>
                Предыдущая
            </button>
            <div className="ui input labeled icon" style={{width: "100px"}}>
                <input type="number" value={establishmentStore.currentPage} onChange={(e) => establishmentStore.setCurrentPage(+e.target.value)}/>
            </div>
            <button className="ui right labeled icon button" onClick={() => establishmentStore.setCurrentPage(establishmentStore.currentPage + 1)}>
                <i className="right arrow icon"></i>
                Следующая
            </button>
        </>
    );
});