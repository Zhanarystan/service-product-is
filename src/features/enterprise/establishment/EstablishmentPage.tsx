import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { useStore } from '../../../app/stores/store';
import Loading from '../../common/Loading';
import EstablishmentFieldGroup from './EstablishmentFieldGroup';
import EstablishmentPicture from './EstablishmentPicture';

export default observer(function EstablishmentPage(){
    const {establishmentStore, userStore} = useStore();

    useEffect(() => {
        if(userStore.user !== null) 
            establishmentStore.getEstablishment(userStore.user.establishmentId!);
    }, [establishmentStore]);
    if(!establishmentStore.establishment) return <Loading/>
    return (
        <>
            <div className="container">
                <EstablishmentPicture establishment={establishmentStore.establishment}/>
                <EstablishmentFieldGroup establishment={establishmentStore.establishment}/>
            </div>
        </>
    )
}) 