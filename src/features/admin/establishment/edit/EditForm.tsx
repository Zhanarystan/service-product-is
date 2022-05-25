import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { Map, Placemark, YMaps } from "react-yandex-maps";
import { EstablishmentWithList } from "../../../../app/models/establishment";

interface Props {
    establishment: EstablishmentWithList;
}

export default observer(function EditForm({establishment}: Props) {

    const [name, setName] = useState<string>("" as string);
    const [bankCardNumber, setBankCardNumber] = useState<string>("" as string);
    const [latitude, setLatitude] = useState<number>(0 as number);
    const [longitude, setLongitude] = useState<number>(0 as number);
    const [startWorkingTime, setStartWorkingTime] = useState<string>("" as string);
    const [endWorkingTime, setEndWorkingTime] = useState<string>("" as string);
    const [cityId, setCityId] = useState<number>(0 as number);
    const [address, setAddress] = useState<string>("" as string);

    useEffect(() => {
        setName(establishment.name);
        setBankCardNumber(establishment.bankCardNumber);
        setLatitude(establishment.latitude);
        setLongitude(establishment.longitude);
        setStartWorkingTime(establishment.startWorkingTime);
        setEndWorkingTime(establishment.endWorkingTime);
        setCityId(establishment.city);
        setAddress(establishment.address);
    }, []);

    return (
        <form className="ui form" >
            <div className="field">
                <label>Наименование</label>
                <div className="field">
                    <input type="text" placeholder="Наименование" value={name} onChange={(e) => setName(e.target.value)}/>
                </div>
                <div className="field">
                    <input type="text"  placeholder="Номер банковской карты" value={bankCardNumber} onChange={(e) => setBankCardNumber(e.target.value)}/>
                </div>
            </div>
            <div className="field">
                <div className="fields">
                    <div className="eight wide field">
                        <label>Широта</label>
                        <input type="text"  placeholder="Широта" value={latitude} onChange={(e) => setLatitude(+e.target.value)}/>
                    </div>
                    <div className="eight wide field">
                        <label>Долгота</label>
                        <input type="text" placeholder="Долгота" value={longitude} onChange={(e) => setLongitude(+e.target.value)}/>
                    </div>
                </div>
            </div>
            <YMaps>
                <div>
                    <Map defaultState={{ center: [latitude, longitude], zoom: 18 }} width={600} height={400}>
                        <Placemark geometry={[latitude, longitude]}  />
                    </Map>
                </div>
            </YMaps>
            <div className="field">
                <div className="fields">
                    <div className="eight wide field">
                        <label>Работает с</label>
                        <input type="time" name="time" value={startWorkingTime} onChange={(e) => setStartWorkingTime(e.target.value)} />
                    </div>
                    <div className="eight wide field">
                        <label>Работает до</label>
                        <input type="time" name="time" value={endWorkingTime} onChange={(e) => setEndWorkingTime(e.target.value)} />
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
                        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
                    </div>
                </div>
            </div>
            <button className="ui button" type="submit">Submit Order</button>
        </form>
    )
});