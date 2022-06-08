import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../../../app/stores/store";
import Loading from "../../common/Loading";

export default observer(function UserListPage() {
    
    const {adminStore, userStore} = useStore();

    useEffect(() => {
        if(userStore.user)
            adminStore.getUsers();
            adminStore.setCurrentPage(1);
    }, [adminStore]);

    return (
        <>
            <h1>Пользователи</h1>
            <Link to={`/admin/user-create`}>
                <button className="medium green ui button">
                    <div className="d-flex">
                        <i className="plus icon"></i>
                        <p>Добавить</p>
                    </div>
                </button>
            </Link>
            {adminStore.loading ? <Loading/> : ""}
            <table className="ui striped table">
                <thead>
                    <tr>
                        <th>Имя пользователя</th>
                        <th>E-mail</th>
                        <th>ИИН</th>
                        <th>Роли</th>
                        <th>Действие</th>
                    </tr>
                </thead>
                <tbody>
                    {adminStore.users.filter(u => u.username !== userStore.user!.username).map(u => (
                        <tr>
                            <td>{u.username}</td>
                            <td>{u.email}</td>
                            <td>{u.iin}</td>
                            <td>{u.roles.map(r => (
                                <p>{r}</p>
                            ))}</td>
                            <td>
                                <Link to={`/admin/users/${u.id}`}>
                                    <button className="ui icon button">
                                        <div className="d-flex">
                                            <i className="pencil alternate icon"></i>
                                            <p>Изменить</p>
                                        </div>
                                    </button>
                                </Link>
                            </td>
                        </tr>

                    ))}
                </tbody>
            </table>
            <button className="ui left labeled icon button" onClick={() => adminStore.setCurrentPage(adminStore.currentPage - 1)}>
                <i className="left arrow icon"></i>
                Предыдущая
            </button>
            <div className="ui input labeled icon" style={{width: "100px"}}>
                <input type="number" value={adminStore.currentPage} onChange={(e) => adminStore.setCurrentPage(+e.target.value)}/>
            </div>
            <button className="ui right labeled icon button" onClick={() => adminStore.setCurrentPage(adminStore.currentPage + 1)}>
                <i className="right arrow icon"></i>
                Следующая
            </button>
        </>
    )
});