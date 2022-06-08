import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Button, Grid, Header} from 'semantic-ui-react';
import PhotoWidgetCropper from './PhotoWidgetCropper';
import PhotoWidgetDropzone from './PhotoWidgetDropzone';
interface Props{
    loading: boolean;
    uploadPhoto: (file: Blob) => void;
}

export default function PhotoUploadWidget({loading, uploadPhoto} : Props){
    const [files, setFiles] = useState<any>([]);
    const [cropper, setCropper] = useState<Cropper>();

    function onCrop () {
        if(cropper){
            cropper.getCroppedCanvas().toBlob(blob => uploadPhoto(blob!));
        }
    }

    useEffect(() => {
        return () => {
            files.forEach((file: any) => URL.revokeObjectURL(file.preview))
        }
    }, [files])

    return (
        <>
            <div className='row'>
                <div className="col-3">
                    <p>Step 1 - Add Photo</p>
                    <PhotoWidgetDropzone setFiles={setFiles}/>
                </div>
                <div className="col-1"></div>
                <div className="col-3">
                    <p>Step 2 - Resize image</p>
                    {files && files.length>0 && (
                        <PhotoWidgetCropper setCropper={setCropper} imagePreview={files[0].preview} />
                    )}
                </div>
                <div className="col-1"></div>
                <div className="col-3">
                    <p>Step 3 - Preview and Upload</p>
                    {files && files.length > 0 && 
                        <>
                            <div className='img-preview' style={{minHeight:200, overflow:'hidden'}} /> 
                            <div className="d-flex">
                                <button className='ui button green' onClick={onCrop}>Check</button>
                                <button className='ui button green' onClick={() => setFiles([])}>Close</button>    
                            </div>   
                        </>
                    }
                </div>
            </div>
        </>

    )
}