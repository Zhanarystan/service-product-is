import { observer } from "mobx-react-lite";
import React, { FormEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ServiceDetail } from "../../../app/models/service";
import { useStore } from "../../../app/stores/store";
import Loading from "../../common/Loading";

export default observer(function ServiceEditPage() {
    let { serviceId } = useParams<{serviceId: string}>();
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [metricName, setMetricName] = useState<string>("");
    const [metricId, setMetricId] = useState<number>(0);

    const {
        adminStore
    } = useStore();

    useEffect(() => {
        adminStore.getMetrics();
        adminStore.getService(serviceId)
            .then(response => {
                setName(adminStore.serviceDetail!.name!);
                setDescription(adminStore.serviceDetail!.description);
                setMetricName(adminStore.serviceDetail!.metric);
                setMetricId(adminStore.serviceDetail!.metricId);
            })
    }, [adminStore.getService]);

    const submit = (e: FormEvent) => {
        e.preventDefault();
        let newObj: ServiceDetail = {
            id: +serviceId,
            name,
            description,
            metricId,
            metric: metricName,
        }
        adminStore.updateService(serviceId, newObj);
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
                            <input type="text" placeholder="Наименование" value={name} onChange={(e) => setName(e.target.value)}  />
                        </div>
                    </div>
                    <div className="two fields">
                        <div className="field">
                            <label>Описание</label>
                            <textarea  onChange={(e) => setDescription(e.target.value)} value={description}></textarea>
                        </div>
                    </div>
                    <div className="two fields">
                        <div className="field">
                            <label>Метрика</label>
                            <select className="ui fluid dropdown" value={metricId} onChange={(e) => setMetricId(+e.target.value)}>
                                <option value="">Метрика</option>
                                {adminStore.metrics.map(m => (
                                    <option value={m.id}>{m.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <button className={adminStore.loading ? `ui loading button green` : 'ui button green'} type="submit">Отправить</button>
                    <button className={adminStore.removeLoading ? `ui loading button red` : 'ui button red'} type="button" onClick={() => adminStore.deleteService(serviceId)}>Удалить</button>
                </form>
            </div>
            <div className="col-1"></div>
        </div>
    )
});