import { observer } from "mobx-react-lite";
import React from "react";

export default function Loading() {

    return (
        <>
            <div className="ui active inverted dimmer">
                <div className="ui text loader">Загрузка...</div>
            </div>
        </>
    )
};