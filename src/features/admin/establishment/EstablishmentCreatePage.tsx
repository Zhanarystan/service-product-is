import { observer } from "mobx-react-lite";
import React, { FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Map, YMaps } from "react-yandex-maps";
import { useStore } from "../../../app/stores/store";
import { history } from '../../../index';

export default observer(function EstablishmentCreatePage() {

    const {establishmentStore} = useStore();
    const [name, setName] = useState<string>("" as string);
    const [bankCardNumber, setBankCardNumber] = useState<string>("" as string);
    const [latitude, setLatitude] = useState<number>(0 as number);
    const [longitude, setLongitude] = useState<number>(0 as number);
    const [startWorkingTime, setStartWorkingTime] = useState<string>("" as string);
    const [endWorkingTime, setEndWorkingTime] = useState<string>("" as string);
    const [cityId, setCityId] = useState<number>(0 as number);
    const [address, setAddress] = useState<string>("" as string);

    const submit = (e: FormEvent) => {
        e.preventDefault();
        establishmentStore.createEstablishment({
            name,
            bankCardNumber,
            latitude,
            longitude,
            startWorkingTime,
            endWorkingTime,
            cityId,
            address
        }).then(isCreated => {
            if(isCreated) {
                establishmentStore.setEstablishmentCreated(false);
                history.push('/admin/establishments');
            }
        });
    }

    return (
        <>
            <h1>Добавить заведение</h1>
            <form className="ui form" onSubmit={submit}>
                <div className="field">
                    <label>Наименование</label>
                    <div className="field">
                        <input type="text" placeholder="Наименование" onChange={(e) => setName(e.target.value)}/>
                    </div>
                    <div className="field">
                        <input type="text"  placeholder="Номер банковской карты" onChange={(e) => setBankCardNumber(e.target.value)}/>
                    </div>
                </div>
                <div className="field">
                    <div className="fields">
                        <div className="eight wide field">
                            <label>Широта</label>
                            <input type="text"  placeholder="Широта" onChange={(e) => setLatitude(+e.target.value)}/>
                        </div>
                        <div className="eight wide field">
                            <label>Долгота</label>
                            <input type="text" placeholder="Долгота" onChange={(e) => setLongitude(+e.target.value)}/>
                        </div>
                    </div>
                </div>
                <YMaps>
                    <div>
                        <Map defaultState={{ center: [43.238949, 76.889709], zoom: 13 }} width={600} height={400}/>
                    </div>
                </YMaps>
                <div className="field">
                    <div className="fields">
                        <div className="eight wide field">
                            <label>Работает с</label>
                            <input type="time" name="time" onChange={(e) => setStartWorkingTime(e.target.value)} />
                        </div>
                        <div className="eight wide field">
                            <label>Работает до</label>
                            <input type="time" name="time" onChange={(e) => setEndWorkingTime(e.target.value)} />
                        </div>
                    </div>
                </div>
                <div className="field">
                    <div className="fields">
                        <div className="eight wide field">
                            <label>Город</label>
                            <select className="ui fluid dropdown" onChange={(e) => setCityId(+e.target.value)}>
                                <option value="">Город</option>
                                <option value={1}>Алматы</option>
                                <option value={2}>Шымкент</option>
                            </select>
                        </div>
                        <div className="eight wide field">
                            <label>Аддрес</label>
                            <input type="text" onChange={(e) => setAddress(e.target.value)} />
                        </div>
                    </div>
                </div>
                <button className="ui button" type="submit">Submit Order</button>
            </form>
        </>
    );
});