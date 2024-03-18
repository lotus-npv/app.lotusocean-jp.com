import React, { useEffect, useState } from 'react';
import axios from 'axios';
// //redux
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { uploadFileRequest  } from "../../../store/upload_image/actions";

function ImageUploadForm() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [filename, setFileName] = useState('');
    const [uploadDone, setUploadDone] = useState(false);
    const [avata, setAvata] = useState({
        key_license_id: 1,
        user_type: 'intern',
        object_id: 1, // Có thể chỉ nhận giá trị 'manual' hoặc 'automatic'
        path: './uploads',
        originalname: '',
        mimetype: null,
        size: null,
        description: '',
        create_at: null,
        create_by: 1,
        update_at: null,
        update_by: 1,
        delete_at: null,
        flag: 1
    })

    // Khai bao du lieu
    const dispatch = useDispatch();

    // const { uploadResult } = useSelector(state => ({
    //     uploadResult: state.UploadFile.data,
    // }), shallowEqual);

    const handleFileChange = (event) => {
        const f = event.target.files[0];
        setSelectedFile(f);
        console.log(selectedFile)
        setAvata({ ...avata, originalname: '', mimetype: f.type, size: f.size });
    };

    useEffect(() => {
        if (uploadDone) {
            axios.post('https://api.lotusocean-jp.com/api/avata/insert', { ...avata, originalname: filename }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            setUploadDone(false);
        }
    }, [filename]);


    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!selectedFile) {
            alert('Please select a file.');
            return;
        }

        // const formData = new FormData();
        // formData.append('image', selectedFile);

        try {
            // const response = await axios.post('https://api.lotusocean-jp.com/upload', formData, {
            //     headers: {
            //         'Content-Type': 'multipart/form-data'
            //     }
            // });

            dispatch(uploadFileRequest(selectedFile));

            // dispatch(uploadFile(selectedFile));
            // console.log('File uploaded successfully:', uploadResult.data);
            // setFileName(uploadResult.data.filename);
            setUploadDone(true);

        } catch (error) {
            console.error('Error uploading file:', error);
            // Xử lý lỗi khi upload file
        }
    };


    console.log(avata)
    // console.log(uploadResult)
    return (
        <div>
            <h2>Image Upload Form</h2>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileChange} />
                <button type="submit">Upload</button>
            </form>
        </div>
    );
}

export default ImageUploadForm;