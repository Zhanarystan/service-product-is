import { observer } from "mobx-react-lite";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../../../app/stores/store";
import Loading from "../../common/Loading";

export default observer(function ServiceListPage() {

    const {adminStore: {getServices, currentPage, setCurrentPage, maxPage, services, uploadServicesCSV, loading}} = useStore();
    const [uploadSegmentOpened, setUploadSegmentOpened] = useState<boolean>(false);
    const [searchingString, setSearchString] = useState<string>("");

    useEffect(() => {
        getServices();
        setCurrentPage(1);
    }, [])

    return (
        <>
            <h1>Сервисы</h1>
            <Link to={`/admin/service-create`}>
                <button className="medium green ui button">
                    <div className="d-flex">
                        <i className="plus icon"></i>
                        <p>Добавить</p>
                    </div>
                </button>
            </Link>
            <button className="ui left labeled teal icon button" onClick={() => setUploadSegmentOpened(!uploadSegmentOpened)}>
                <i className="cloud upload icon"></i>
                Загрузить с CSV файла
            </button>
            {uploadSegmentOpened ? 
                <div className="ui placeholder segment">
                    <div className="ui icon header">
                        <i className="csv file outline icon"></i>
                        Загрузите документ
                    </div>
                    <input type="file" id="filePicker" style={{visibility:"hidden"}} 
                        onChange={(e) => {
                                console.log("eeeee");
                                if(!e.target.files) return;   
                                uploadServicesCSV(e.target.files[0]);
                            }
                        } />
                    <label htmlFor="filePicker" className={loading ? `ui loading primary button` : 'ui primary button'}>
                        Выбрать файл
                    </label>
                </div> : ""
            }
            <div className="ui fluid icon input" style={{marginTop: "10px"}}>
                <input type="text" placeholder="Имя сервиса..." onChange={(e) => setSearchString(e.target.value)} />
                <i className="search icon"></i>
            </div>
            {loading ? <Loading/> : ""}
            <table className="ui striped table">
                <thead>
                    <tr>
                        <th>Наименование</th>
                        <th>Метрика</th>
                        <th>Действие</th>
                    </tr>
                </thead>
                <tbody>
                    {services.filter(p => p.name.toLowerCase().startsWith(searchingString.toLowerCase()))
                        .slice(currentPage * 10 - 10, currentPage * 10)
                        .map(s => (
                        <tr>
                            <td>{s.name}</td>
                            <td>{s.metric}</td>
                            <td>
                                <Link to={`/admin/services/${s.id}`}>
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
        </>
    )
})