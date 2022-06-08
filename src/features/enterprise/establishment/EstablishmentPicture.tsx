import { observer } from "mobx-react-lite";
import React, { ChangeEvent, useState } from "react";
import { EstablishmentWithList } from "../../../app/models/establishment";
import { useStore } from "../../../app/stores/store";
import Loading from "../../common/Loading";
import './establishment.css';

interface Props {
    establishment: EstablishmentWithList;
}

export default observer(function EstablishmentPicture({establishment} : Props) {
    const {establishmentStore} = useStore();
    const [selectedFile, setSelectedFile] = useState<any>();

    if(!establishment.photoUrl) establishment.photoUrl = process.env.PUBLIC_URL + '/img/default-establishment.png';
    return (
           <div className="text-center">
                <img src={establishment.photoUrl} />
                <form onSubmit={(e) => {
                        e.preventDefault();
                        console.log(selectedFile);
                        establishmentStore.uploadPhoto(selectedFile);
                }}>
                    <div className="form-group">
                        <input type="file" className="form-control-file" id="exampleFormControlFile1"
                        onChange={(e) => {
                                console.log("eeeee");
                                if(!e.target.files) return;   
                                setSelectedFile(e.target.files[0]); 
                            }
                        } />
                    </div>
                    <div className="form-group">
                        <button className="btn btn-success" type="submit">{establishmentStore.loadingInitial ? <Loading/> : "Загрузить фото"}</button>
                    </div>
                </form>
            </div>
    )
});