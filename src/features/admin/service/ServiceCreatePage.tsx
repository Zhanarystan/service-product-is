import { observer } from "mobx-react-lite";
import React, { FormEvent, useEffect, useState } from "react";
import { ServiceCreate } from "../../../app/models/service";
import { useStore } from "../../../app/stores/store";

export default observer(function ServiceCreatePage() {

    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [metricId, setMetricId] = useState<number>(0);

    const {adminStore: { getMetrics, metrics, createService, loading}} = useStore();

    useEffect(() => {
        getMetrics();
    }, []);

    const submit = (e: FormEvent) => {
        e.preventDefault();
        let newObj: ServiceCreate = {
            name,
            description,
            metricId
        }

        createService(newObj);
    }

    return (
        <div className="row">
            <div className="col-1"></div>
            <div className="col-10">
                <form className="ui form" onSubmit={submit}>
                    <h4 className="ui dividing header">Данные о новом сервисе</h4>
                    <div className="two fields">
                        <div className="field">
                            <label>Наименование</label>
                            <input type="text" placeholder="Наименование" onChange={(e) => setName(e.target.value)}  />
                        </div>
                    </div>
                    <div className="two fields">
                        <div className="field">
                            <label>Описание</label>
                            <textarea  onChange={(e) => setDescription(e.target.value)}></textarea>
                        </div>
                    </div>
                    <div className="two fields">
                        <div className="field">
                            <label>Метрика</label>
                            <select className="ui fluid dropdown" onChange={(e) => setMetricId(+e.target.value)}>
                                <option value="">Метрика</option>
                                {metrics.map(m => (
                                    <option value={m.id}>{m.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <button className={loading ? `ui loading button green` : 'ui button green'} type="submit">Отправить</button>
                </form>
            </div>
            <div className="col-1"></div>
        </div>
    )
});