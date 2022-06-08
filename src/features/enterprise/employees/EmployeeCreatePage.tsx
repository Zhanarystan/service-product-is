import { observer } from "mobx-react-lite";
import React, { FormEvent, useEffect, useState } from "react";
import { UserAtEstablishmentCreate } from "../../../app/models/user";
import { useStore } from "../../../app/stores/store";

interface Props {
    userId: number;
}

export default observer(function EmployeeCreatePage({userId}: Props) {
    
    const {enterpriseAdminStore, userStore} = useStore();
    const [email, setEmail] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [firstName, setFirstName] = useState<string>("");
    const [secondName, setSecondName] = useState<string>("");
    const [iin, setIin] = useState<string>(""); 
    const [day, setDay] = useState<number>(0);
    const [month, setMonth] = useState<number>(0);
    const [year, setYear] = useState<number>(0);

    useEffect(() => {

    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        if(userStore.user !== null) {
            const currentUser = userStore.user;
            const newUser: UserAtEstablishmentCreate = {
                username,
                password,
                firstName,
                secondName,
                email,
                day,
                month,
                year,
                iin,
                establishmentId: currentUser.establishmentId!,
                roles: [
                    "establishment_seller"
                ]
            };
            enterpriseAdminStore.craeteUser(newUser);
        }
    }
    return (
        <div className="row">
            <div className="col-1"></div>
            <div className="col-10">
                <form className="ui form" onSubmit={submit}>
                    <h4 className="ui dividing header">Данные о новом пользователя</h4>
                    <div className="two fields">
                        <div className="field">
                            <label>Имя</label>
                            <input type="text" placeholder="Имя" onChange={(e) => setFirstName(e.target.value)} />
                        </div>
                    </div>
                    <div className="two fields">
                        <div className="field">
                            <label>Фамилия</label>
                            <input type="text" placeholder="Фамилия" onChange={(e) => setSecondName(e.target.value)} />
                        </div>
                    </div>
                    <div className="two fields">
                        <div className="field">
                            <label>Имя пользователя</label>
                            <input type="text" placeholder="Имя пользователя" onChange={(e) => setUsername(e.target.value)} />
                        </div>
                    </div>
                    <div className="two fields">
                        <div className="field">
                            <label>Пароль</label>
                            <input type="text" placeholder="Пароль" onChange={(e) => setPassword(e.target.value)} />
                        </div>
                    </div>
                    <div className="two fields">
                        <div className="field">
                            <label>Электронная почта</label>
                            <input type="email" placeholder="Эл. почта" onChange={(e) => setEmail(e.target.value)} />
                        </div>
                    </div>
                    <label><b>Дата рождения</b></label>
                    <div className="fields">
                        <div className="two wide field">
                            <input type="number" placeholder="День" onChange={(e) => setDay(+e.target.value)}/>
                        </div>
                        <div className="six wide field">
                            <div className="two fields">
                                <div className="field">
                                    <select className="ui fluid search dropdown" onChange={(e) => setMonth(+e.target.value)}>
                                        <option value="" >Месяц</option>
                                        <option value="1">Январь</option>
                                        <option value="2">Февраль</option>
                                        <option value="3">Март</option>
                                        <option value="4">Апрель</option>
                                        <option value="5">Май</option>
                                        <option value="6">Июнь</option>
                                        <option value="7">Июль</option>
                                        <option value="8">Август</option>
                                        <option value="9">Сентябрь</option>
                                        <option value="10">Октябрь</option>
                                        <option value="11">Ноябрь</option>
                                        <option value="12">Декабрь</option>
                                    </select>
                                </div>
                                <div className="field">
                                    <input type="number" placeholder="Год" onChange={(e) => setYear(+e.target.value)}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="two fields">
                        <div className="field">
                            <label>ИИН</label>
                            <input type="text"  placeholder="ИИН" onChange={(e) => setIin(e.target.value)} />
                        </div>
                    </div>
                    <div className="two fields">
                        {enterpriseAdminStore.errorMessages.length !== 0 ? 
                            <div className="alert alert-danger p-5" role="alert">
                                <p>Данные не валидны: </p>
                                <ul>
                                    {enterpriseAdminStore.errorMessages.map(err => (
                                        <li>{err}</li>
                                    ))}
                                </ul>
                            </div>
                            : ""}
                    </div>
                    <button className="ui button" type="submit">Создать пользователя</button>
                </form>
            </div>
            <div className="col-1"></div>
        </div>
    )
});