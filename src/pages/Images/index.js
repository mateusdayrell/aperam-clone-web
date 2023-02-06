/* eslint-disable react/no-unknown-property */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { get, uniqueId } from 'lodash';
import Dropzone from 'react-dropzone';
import Modal from 'react-modal';
import { ImageList, ImageListItem } from '@mui/material';
import { filesize } from 'filesize';
import { BsCardImage, BsPlusCircle } from 'react-icons/bs';

import Navbar from '../../components/Navbar';
import axios from '../../services/axios';
import './style.css';

export default function Images() {
  const [images, setImages] = useState([]);
  const [uploads, setUploads] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);

  useEffect(() => {
    loadRegisters();
  }, []);

  const loadRegisters = async () => {
    try {
      const { data } = await axios.get('/images');

      setImages(data.images);
    } catch (error) {
      const erros = get(error, 'response.data.errors', []);
      erros.map((err) => toast.error(err));
    }
  };

  const handleUploads = (files) => {
    const uploadedFiles = files.map((file) => ({
      id: uniqueId(),
      file,
      name: file.name,
      readableSize: filesize(file.size),
      preview: URL.createObjectURL(file),
      progress: 0,
      uploaded: false,
      error: false,
      url: null,
      user_id: 1,
    }));

    setUploads(uploads.concat(uploadedFiles));
  };

  const handleUpload = async () => {
    const header = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    // eslint-disable-next-line no-restricted-syntax
    for (const upload of uploads) {
      const formData = new FormData();
      formData.append('file', upload.file);
      formData.append('user_id', 1);

      try {
        // eslint-disable-next-line no-await-in-loop
        await axios.post('/images', formData, header);
        toast.error('Upload realizado com sucesso');
      } catch (error) {
        const erros = get(error, 'response.data.errors', []);
        erros.map((err) => toast.error(err));
      }
    }
  };

  const handleSearch = async (value) => {
    const querys = new URLSearchParams({
      date: value,
    }).toString();
    try {
      const { data } = await axios.get(`/images/search/${querys}`);
      setImages(data);
    } catch (error) {
      const erros = get(error, 'response.data.errors', []);
      erros.map((err) => toast.error(err));
    }
  };

  return (
    <>
      <Navbar />
      <div className="app-container">
        <div className="flex flex-col">
          <div className="flex flex-col items-center">
            <span className="flex gap-3 items-center">
              <BsCardImage size={42} />
              <h1 className="font-black text-3xl">Galeria de fotos</h1>
            </span>

            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="bg-blue-500 mt-2 mb-4 flex items-center gap-2 ml-auto rounded-md text-gray-100 px-4 py-2"
            >
              <BsPlusCircle size={22} />
              Adicionar foto
            </button>
          </div>

          <div className="box-container">
            <input
              type="date"
              name="date"
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full"
            />
            <ImageList variant="masonry" cols={3} gap={8}>
              {images?.map((image) => (
                <ImageListItem key={image.id}>
                  <span>{image.id}</span>
                  <img src={image.file_url} alt="" loading="lazy" />
                </ImageListItem>
              ))}
            </ImageList>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onRequestClose={handleClose}
        className="Modal"
        overlayClassName="Overlay"
        ariaHideApp={false}
      >
        <div>
          <Dropzone onDropAccepted={handleUploads}>
            {({
              getRootProps, getInputProps, isDragActive, isDragReject,
            }) => (
              <div
                className={`${isDragActive && 'active '} ${isDragReject && ' reject '} dropzone`}
                {...getRootProps()}
                isdragactive={isDragActive.toString()}
                isdragreject={isDragReject.toString()}
              >
                <input {...getInputProps()} />
                Arraste arquivos para dentro da área pontilhada para fazer o upload.
              </div>
            )}
          </Dropzone>
          <button type="button" onClick={handleUpload}>Upload</button>
          {!!uploads.length
           && (
           <ul className="mt-10">
             {uploads.map((file) => (
               <li key={file.id} className="flex justify-between items-center my-2">
                 <img src={file.preview} alt="" />
                 <div className="file-info flex items-center">
                   <strong>{file.name}</strong>
                   <span>
                     {file.readableSize}
                     {' '}
                     <button type="button">Excluir</button>
                   </span>
                 </div>
               </li>
             ))}

           </ul>
           )}
        </div>
      </Modal>
    </>
  );
}
