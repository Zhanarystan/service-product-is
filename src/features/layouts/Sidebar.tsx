import { observer } from "mobx-react-lite";
import React from "react";
import { Link } from "react-router-dom";

export default observer(function Sidebar() {

    return(
        <>
            <div className="ui vertical inverted sidebar menu left overlay visible" id="toc">
                <div className="item">
                    <Link to={`/admin/manufacturers`}>
                        <div className="header">Производители</div>
                    </Link>
                </div>
                <div className="item">
                    <Link to={`/admin/products`}>
                        <div className="header">Продукты</div>
                    </Link>
                </div>
                <div className="item">
                    <Link to={`/admin/services`}>
                        <div className="header">Сервисы</div>
                    </Link>
                </div>
                <div className="item">
                    <Link to={`/admin/establishments`}>
                        <div className="header">Заведения</div>
                    </Link>
                </div>
                <a href="#">
                <div className="item">
                    <Link to={`/admin/users`}>
                        <div className="header">Пользователи</div>
                    </Link>
                </div>
                </a>          
            </div>
        </>
    )
});