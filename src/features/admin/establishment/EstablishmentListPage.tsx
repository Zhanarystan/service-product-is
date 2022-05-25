import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../../../app/stores/store";

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
                        establishmentStore.establishmentList.map(establishment => (
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
        </>
    );
});