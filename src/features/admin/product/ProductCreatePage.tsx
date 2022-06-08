import { observer } from "mobx-react-lite";
import React, { FormEvent, useEffect, useState } from "react";
import { ProductCreate } from "../../../app/models/product";
import { useStore } from "../../../app/stores/store";

export default observer(function ProductCreatePage() {

    const [name, setName] = useState<string>("");
    const [barCode, setBarCode] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [manufacturerName, setManufacturerName] = useState<string>("");
    const [metricId, setMetricId] = useState<number>(0);

    const {adminStore: {getManufacturers, manufacturers, getMetrics, metrics, createProduct, loading}} = useStore();

    useEffect(() => {
        getManufacturers();
        getMetrics();
    }, []);

    const submit = (e: FormEvent) => {
        e.preventDefault();
        let newObj: ProductCreate = {
            name,
            barCode,
            description,
            manufacturerId: manufacturers.find(m => m.name == manufacturerName)!.id,
            metricId,
            isCustom: false
        }

        createProduct(newObj);
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
                            <input type="text" placeholder="Наименование" onChange={(e) => setName(e.target.value)}  />
                        </div>
                    </div>
                    <div className="two fields">
                        <div className="field">
                            <label>Штрих код</label>
                            <input type="text" placeholder="Наименование" onChange={(e) => setBarCode(e.target.value)} />
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
                            <label>Заведение</label>
                            <input 
                                type="text"
                                placeholder="Производитель"
                                list="establishment_list"
                                onChange={(e) => setManufacturerName(e.target.value)}
                             />
                             <datalist id="establishment_list">
                                {manufacturers.map((es) => {
                                    return <option value={es.name}/>
                                })}
                             </datalist>
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