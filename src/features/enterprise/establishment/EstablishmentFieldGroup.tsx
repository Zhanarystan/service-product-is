import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { Placemark, YMaps, Map } from 'react-yandex-maps';
import { EstablishmentCreateValues, EstablishmentWithList } from '../../../app/models/establishment';
import { useStore } from '../../../app/stores/store';
import Loading from '../../common/Loading';

interface Props {
    establishment: EstablishmentWithList;
}

export default observer(function EstablishmentFieldGroup({establishment}: Props) {
    const [name, setName] = useState<string>("" as string);
    const [bankCardNumber, setBankCardNumber] = useState<string>("" as string);
    const [latitude, setLatitude] = useState<number>(0 as number);
    const [longitude, setLongitude] = useState<number>(0 as number);
    const [startWorkingTime, setStartWorkingTime] = useState<string>("" as string);
    const [endWorkingTime, setEndWorkingTime] = useState<string>("" as string);
    const [city, setCity] = useState<number>(0 as number);
    const [address, setAddress] = useState<string>("" as string);
    const {establishmentStore: {updateEstablishment, errorMessages, loadingInitial}} = useStore();

    useEffect(() => {
        setName(establishment.name);
        setBankCardNumber(establishment.bankCardNumber);
        setLatitude(establishment.latitude);
        setLongitude(establishment.longitude);
        setStartWorkingTime(establishment.startWorkingTime);
        setEndWorkingTime(establishment.endWorkingTime);
        setCity(establishment.city);
        setAddress(establishment.address);
    }, []);

    const submit = (e: any) => {
        e.preventDefault();
        let newObj: EstablishmentCreateValues = {
            name,
            bankCardNumber,
            latitude,
            longitude,
            startWorkingTime, 
            endWorkingTime,
            cityId:0,
            address
        };
        console.log(establishment.id);
        updateEstablishment(establishment.id, newObj);
    }

    if(loadingInitial) return <Loading/>
    return (
        <form className="ui form" onSubmit={submit}>
            <div className="field">
                <label>Наименование</label>
                <div className="field">
                    <input type="text" placeholder="Наименование" value={name} onChange={(e) => setName(e.target.value)}/>
                </div>
                <label>Номер банковской карты</label>
                <div className="field">
                    <input type="text"  placeholder="Номер банковской карты" value={bankCardNumber} onChange={(e) => setBankCardNumber(e.target.value)}/>
                </div>
            </div>
            <div className="field">
                <div className="fields">
                    <div className="eight wide field">
                        <label>Широта</label>
                        <input type="number"  placeholder="Широта" value={latitude} onChange={(e) => setLatitude(+e.target.value)}/>
                    </div>
                    <div className="eight wide field">
                        <label>Долгота</label>
                        <input type="number" placeholder="Долгота" value={longitude} onChange={(e) => setLongitude(+e.target.value)}/>
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
                        <input type="text" value={city} readOnly />
                    </div>
                    <div className="eight wide field">
                        <label>Аддрес</label>
                        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)}/>
                    </div>
                </div>
            </div>
            <button className="ui button" type="submit">Отправить</button>
            <div className="two fields">
                {errorMessages && errorMessages.length !== 0 ? 
                    <div className="alert alert-danger p-5" role="alert">
                        <p>Данные не валидны: </p>
                        <ul>
                            {errorMessages.map(err => (
                                <li>{err}</li>
                            ))}
                        </ul>
                    </div>
                    : ""}
            </div>
        </form>
    )
});