import { observer } from "mobx-react-lite";
import React, { FormEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ProductDetail } from "../../../app/models/product";
import { useStore } from "../../../app/stores/store";
import Loading from "../../common/Loading";

export default observer(function ProductEditPage() {
    let { productId } = useParams<{productId: string}>();
    const [name, setName] = useState<string>("");
    const [barCode, setBarCode] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [manufacturerName, setManufacturerName] = useState<string>("");
    const [manufacturerId, setManufacturerId] = useState<number>(0);
    const [metricName, setMetricName] = useState<string>("");
    const [metricId, setMetricId] = useState<number>(0);

    const {
        adminStore
    } = useStore();

    useEffect(() => {
        adminStore.getManufacturers();
        adminStore.getMetrics();
        adminStore.getProduct(productId)
            .then(response => {
                setName(adminStore.productDetail!.name!);
                setBarCode(adminStore.productDetail!.barCode);
                setDescription(adminStore.productDetail!.description);
                setManufacturerName(adminStore.productDetail!.manufacturer);
                setManufacturerId(adminStore.productDetail!.manufacturerId);
                setMetricName(adminStore.productDetail!.metric);
                setMetricId(adminStore.productDetail!.metricId);
            })
    }, [adminStore.getProduct]);

    const submit = (e: FormEvent) => {
        e.preventDefault();
        let newObj: ProductDetail = {
            id: +productId,
            name,
            barCode,
            description,
            manufacturerId: adminStore.manufacturers.find(m => m.name == manufacturerName)!.id,
            metricId,
            metric: metricName,
            manufacturer: manufacturerName,
            isCustom: false
        }
        adminStore.updateProduct(productId, newObj);
    }

    return (
        <div className="row">
            <div className="col-1"></div>
            <div className="col-10">
                <form className="ui form" onSubmit={submit}>
                    <h4 className="ui dividing header">Данные о новом продукте</h4>
                    <div className="two fields">
                        <div className="field">
                            <label>Наименование</label>
                            <input type="text" placeholder="Наименование" value={name} onChange={(e) => setName(e.target.value)}  />
                        </div>
                    </div>
                    <div className="two fields">
                        <div className="field">
                            <label>Штрих код</label>
                            <input type="text" placeholder="Штрих код" value={barCode} onChange={(e) => setBarCode(e.target.value)} />
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
                            <label>Заведение</label>
                            <input 
                                type="text"
                                placeholder="Производитель"
                                list="establishment_list"
                                value={manufacturerName}
                                onChange={(e) => setManufacturerName(e.target.value)}
                             />
                             <datalist id="establishment_list">
                                {adminStore.manufacturers.map((es) => {
                                    return <option value={es.name}/>
                                })}
                             </datalist>
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
                    <button className={adminStore.removeLoading ? `ui loading button red` : 'ui button red'} type="button" onClick={() => adminStore.deleteProduct(productId)}>Удалить</button>
                </form>
            </div>
            <div className="col-1"></div>
        </div>
    )
});