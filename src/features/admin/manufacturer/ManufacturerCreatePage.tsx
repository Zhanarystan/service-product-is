import { observer } from "mobx-react-lite";
import React, { FormEvent, useEffect, useState } from "react";
import { ManufacturerCreate } from "../../../app/models/manufacturer";
import { ProductCreate } from "../../../app/models/product";
import { useStore } from "../../../app/stores/store";

export default observer(function ManufacturerCreatePage() {

    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    
    const {adminStore: { createManufacturer, loading}} = useStore();


    const submit = (e: FormEvent) => {
        e.preventDefault();
        let newObj: ManufacturerCreate = {
            name,
            description,
        };
        createManufacturer(newObj);
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
                            <label>Описание</label>
                            <textarea  onChange={(e) => setDescription(e.target.value)}></textarea>
                        </div>
                    </div>
                    <button className={loading ? `ui loading button green` : 'ui button green'} type="submit">Отправить</button>
                </form>
            </div>
            <div className="col-1"></div>
        </div>
    )
});