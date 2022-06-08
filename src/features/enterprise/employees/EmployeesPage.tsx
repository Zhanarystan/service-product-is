import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../../../app/stores/store";
import Loading from "../../common/Loading";

export default observer(function EmployeesPage() {
    const {enterpriseAdminStore: {getUsersAtCurrentEstablishment, usersAtEstablishment, loading}} = useStore();

    useEffect(() => {
        getUsersAtCurrentEstablishment();
    }, [getUsersAtCurrentEstablishment])
    
    if(loading) return <Loading/>

    return (
        <>
            <div className="row">
                <div className="col-1"></div>
                <div className="col-10">
                    <Link to="/enterprise/admin/employees/create">
                        <button className="ui button">Создать пользователя</button>
                    </Link>
                    <h2>Сотрудники</h2>
                    <table className="ui striped table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Имя пользователя</th>
                                <th>E-mail</th>
                                <th>ИИН</th>
                                <th>Роли</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usersAtEstablishment.map(u => (
                                <tr>
                                    <td>{u.id}</td>
                                    <td>{u.username}</td>
                                    <td>{u.email}</td>
                                    <td>{u.iin}</td>
                                    <td>{u.roles.map(r => (
                                        <p>{r}</p>
                                    ))}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="col-1"></div>
            </div>
        </>
    )
});