/* eslint-disable react/no-unknown-property */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { get, uniqueId } from 'lodash';
import Dropzone from 'react-dropzone';
import Modal from 'react-modal';
import { ImageList, ImageListItem } from '@mui/material';
import { filesize } from 'filesize';
import { BsCardImage, BsPlusCircle, BsCloudUpload } from 'react-icons/bs';
import { useSelector } from 'react-redux';

import moment from 'moment/moment';
import Navbar from '../../components/Navbar';
import axios from '../../services/axios';
import './style.css';

export default function Images() {
  const [images, setImages] = useState([]);
  const [uploads, setUploads] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [date, setDate] = useState(false);

  const handleClose = () => {
    setShowModal(false);
    setUploads([]);
  };

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    handleSearch(moment().format('YYYY-MM-DD'));
  }, []);

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
      user_id: user.id,
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
      formData.append('user_id', user.id);

      try {
        // eslint-disable-next-line no-await-in-loop
        await axios.post('/images', formData, header);
        toast.success('Upload realizado com sucesso');
        handleClose();
      } catch (error) {
        const erros = get(error, 'response.data.errors', []);
        erros.map((err) => toast.error(err));
      }
    }
    await handleSearch(moment().format('YYYY-MM-DD'));
  };

  const handleSearch = async (value) => {
    const querys = new URLSearchParams({
      date: value,
    }).toString();
    setDate(value);
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
            <label>Data</label>
            <input
              type="date"
              name="date"
              value={date}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full mb-6"
            />
            <ImageList variant="masonry" cols={3} gap={8}>
              {images?.map((image) => (
                <ImageListItem key={image.id}>
                  <a href={image.file_url} className="flex items-center text-center" target="_blank" title="Acessar" rel="noreferrer">
                    <span className="w-full bg-gray-50 opacity-0 hover:opacity-50 h-full absolute flex items-center justify-center duration-300">{image.originalname}</span>
                    <img src={image.file_url} alt="" loading="lazy" />
                  </a>

                </ImageListItem>
              ))}
            </ImageList>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onRequestClose={handleClose}
        className="fixed top-[20%] bg-gray-100 border shadow-lg py-3 px-5
        w-3/4 md:w-3/4 lg:w-2/5 rounded-md max-h-[60%] z-40 overflow-y-scroll overflow-x-hidden"
        overlayClassName="Overlay"
        ariaHideApp={false}
      >
        <div className="flex flex-col items-center">
          <h1 className="title mb-4 mt-2 mr-auto">Cadastrar foto</h1>
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
                <span className="bg-gray-300 w-48 rounded-lg py-1 mt-2 text-center hover:bg-gray-400">Selecionar arquivos</span>
              </div>
            )}
          </Dropzone>
          {!!uploads.length
           && (
           <ul className="mt-10 flex flex-wrap gap-3 items-center justify-center">
             {uploads.map((file) => (
               <li key={file.id} className="flex flex-col justify-between items-center my-2">
                 <img src={file.preview} className="h-32" alt="" />
                 <span>
                   <strong>{file.name}</strong>
                   {' '}
                   -
                   {' '}
                   {file.readableSize}
                 </span>
               </li>
             ))}

           </ul>
           )}
          <div className="flex mt-5 ml-auto">
            <button
              type="button"
              className="confirm-btn flex w-32 gap-2 items-center ml-auto"
              onClick={handleUpload}
            >
              <BsCloudUpload size={24} />
              Upload
            </button>
            <button
              type="button"
              className="reject-btn w-32"
              onClick={handleClose}
            >
              Cancelar
            </button>
          </div>

        </div>
      </Modal>
    </>
  );
}
