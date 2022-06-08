import { observer } from "mobx-react-lite";
import React, { FormEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ManufacturerDetail } from "../../../app/models/manufacturer";
import { useStore } from "../../../app/stores/store";


export default observer(function ManufacturerEditPage() {
    let { manufacturerId } = useParams<{manufacturerId: string}>();
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
 
    const {
        adminStore
    } = useStore();

    useEffect(() => {
        adminStore.getManufacturer(manufacturerId)
            .then(response => {
                setName(adminStore.manufacturer!.name!);
                setDescription(adminStore.manufacturer!.description);
            })
    }, [adminStore.getManufacturer]);

    const submit = (e: FormEvent) => {
        e.preventDefault();
        let newObj: ManufacturerDetail = {
            id: +manufacturerId,
            name,
            description,
        }
        adminStore.updateManufacturer(manufacturerId, newObj);
    }

    return (
        <div className="row">
            <div className="col-1"></div>
            <div className="col-10">
                <form className="ui form" onSubmit={submit}>
                    <h4 className="ui dividing header">Данные о новом производителя</h4>
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
                    <button className={adminStore.loading ? `ui loading button green` : 'ui button green'} type="submit">Отправить</button>
                    <button className={adminStore.removeLoading ? `ui loading button red` : 'ui button red'} type="button" onClick={() => adminStore.deleteManufacturer(manufacturerId)}>Удалить</button>
                </form>
            </div>
            <div className="col-1"></div>
        </div>
    )
});