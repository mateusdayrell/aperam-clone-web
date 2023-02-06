/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/button-has-type */
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { get } from 'lodash';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination,
} from '@mui/material';
import { BsDownload, BsPencil, BsTrash } from 'react-icons/bs';
import { saveAs } from 'file-saver';
import Modal from 'react-modal';
import {
  LineChart, ResponsiveContainer, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import moment from 'moment/moment';

import axios from '../../services/axios';
import Navbar from '../../components/Navbar';

export default function Dashboard() {
  const [images, setImages] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [months, setMonths] = useState([]);
  const [weeks, setWeeks] = useState([]);

  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [search, setSearch] = useState('');

  const [showUpdate, setShowUpdate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [panel, setPanel] = useState(0);

  const [active, setActive] = useState(0);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    loadRegisters();
  }, []);

  const loadRegisters = async () => {
    try {
      const { data } = await axios.get('/images');

      setImages(data.images);
      setOriginalData(data.images);
      setWeeks(data.weeks);
      setMonths(data.months);
    } catch (error) {
      const erros = get(error, 'response.data.errors', []);
      erros.map((err) => toast.error(err));
    }
  };

  const handleDownload = (image) => {
    saveAs(image.file_url, image.originalname);
  };

  const handleShowUpdate = (image) => {
    setShowUpdate(true);
    setId(image.id);
    setName(image.originalname);
  };

  const handleShowDelete = (image) => {
    setShowDelete(true);
    setId(image.id);
    setName(image.originalname);
  };

  const handleUpdate = async () => {
    const regTemp = {
      originalname: name,
    };
    try {
      await axios.put(`/images/${id}`, regTemp);
      clearValues();
      toast.success('O nome da foto foi atualizado com sucesso.');
      loadRegisters();
    } catch (error) {
      const erros = get(error, 'response.data.errors', []);
      erros.map((err) => toast.error(err));
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/images/${id}`);
      clearValues();
      toast.success('Foto excluída com sucesso.');
      loadRegisters();
    } catch (error) {
      const erros = get(error, 'response.data.errors', []);
      erros.map((err) => toast.error(err));
    }
  };

  const clearValues = () => {
    setName('');
    setId('');
    setShowUpdate(false);
    setShowDelete(false);
    setSearch('');
  };

  const handleSearch = (value) => {
    setSearch(value);
    if (!value) setImages(originalData);

    const tempArr = [];

    originalData.forEach((data) => {
      const string = `${data.id} ${data.originalname} ${data.user.name} ${moment(data.created_at).format('DD/MM/YYYY')}`;
      if (string.includes(value)) tempArr.push(data);
    });

    setImages(tempArr);
  };

  return (
    <>
      <Navbar />
      <div className="app-container">
        <div className="box-container">
          <div>
            <h1 className="text-3xl">Upload de arquivos</h1>
            <div className="mt-4 mb-3">
              <button
                className={`${active === 0 ? 'bg-gray-300 border' : 'bg-gray-200 border-none'}  px-2 oy-1 rounded-md mx-1`}
                onClick={() => {
                  setPanel(0);
                  setActive(0);
                }}
              >
                Últimos meses
              </button>
              <button
                className={`${active === 1 ? 'bg-gray-300 border' : 'bg-gray-200 border-none'}  px-2 oy-1 rounded-md mx-1`}
                onClick={() => {
                  setPanel(1);
                  setActive(1);
                }}
              >
                Por semana
              </button>
            </div>
            <div className="-full">
              {panel === 0
                ? (
                  <div>
                    <ResponsiveContainer width="100%" height={350}>
                      <LineChart
                        width={500}
                        height={300}
                        data={months}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        {/* <Legend /> */}
                        <Line type="monotone" dataKey="uploads" stroke="#8884d8" strokeWidth={3} activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )
                : (
                  <div>
                    <ResponsiveContainer width="100%" height={350}>
                      <LineChart
                        width={500}
                        height={300}
                        data={weeks}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="atual" stroke="#8884d8" strokeWidth={3} activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="passada" stroke="#82ca9d" strokeWidth={3} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
            </div>
          </div>
          <hr className="line" />
          <div className="bg-gray-100 rounded-md border my-2 border-gray-300 shadow-sm">
            <div className="flex items-center gap-2 pt-2 justify-end px-4">
              <label className="font-bold">Pesquisar</label>
              <input type="text" value={search} onChange={(e) => handleSearch(e.target.value)} />
            </div>
            <TableContainer>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Código</TableCell>
                    <TableCell align="center">Nome</TableCell>
                    <TableCell align="center">Url pública</TableCell>
                    <TableCell align="center">Criado por</TableCell>
                    <TableCell align="center">Criado em</TableCell>
                    <TableCell align="center">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {images
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((image) => (
                      <TableRow key={image.id}>
                        <TableCell align="center">{image.id}</TableCell>
                        <TableCell align="center">{image.originalname}</TableCell>
                        <TableCell align="center">
                          <a
                            href={image.file_url}
                            target="_blank"
                            title={image.file_url}
                            className="text-blue-400 hover:text-blue-600"
                            rel="noopener noreferrer"
                          >
                            Acessar
                          </a>
                        </TableCell>
                        <TableCell align="center">{image.user.name}</TableCell>
                        <TableCell align="center">{moment(image.created_at).format('DD/MM/YYYY')}</TableCell>
                        <TableCell align="center">
                          <span className="flex gap-1 w-full justify-center">
                            <button
                              type="button"
                              title="Download"
                              className="bg-blue-500 hover:bg-blue-600 text-gray-100 px-2 py-2 rounded-md"
                              onClick={() => handleDownload(image)}
                            >
                              <BsDownload />
                            </button>
                            <button
                              type="button"
                              title="Editar"
                              className="bg-yellow-500 hover:bg-yellow-600 text-gray-100 px-2 py-2 rounded-md"
                              onClick={() => handleShowUpdate(image)}
                            >
                              <BsPencil />
                            </button>
                            <button
                              type="button"
                              title="Excluir"
                              className="bg-red-500 hover:bg-red-600 text-gray-100 px-2 py-2 rounded-md"
                              onClick={() => handleShowDelete(image)}
                            >
                              <BsTrash />
                            </button>
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[2, 5, 10, 25]}
                component="div"
                count={images.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableContainer>
          </div>
          <Modal
            isOpen={showUpdate}
            onRequestClose={() => setShowUpdate(false)}
            className="Modal overflow-y-hidden"
            overlayClassName="Overlay"
            ariaHideApp={false}
          >
            <div>
              <h1>Editar nome do arquivo</h1>
              <label>Nome</label>
              <input type="text" onChange={(e) => setName(e.target.value)} value={name} />
              <div>
                <button type="button" onClick={handleUpdate}>Atualizar</button>
                <button type="button" onClick={() => setShowUpdate(false)}>Não, cancelar.</button>
              </div>
            </div>
          </Modal>

          <Modal
            isOpen={showUpdate}
            onRequestClose={() => setShowUpdate(false)}
            className="Modal overflow-y-hidden"
            overlayClassName="Overlay"
            ariaHideApp={false}
          >
            <div>
              <h1>Editar nome do arquivo</h1>
              <label>Nome</label>
              <input type="text" onChange={(e) => setName(e.target.value)} value={name} />
              <div>
                <button type="button" onClick={handleUpdate}>Atualizar</button>
                <button type="button" onClick={() => setShowUpdate(false)}>Não, cancelar.</button>
              </div>
            </div>
          </Modal>

          <Modal
            isOpen={showDelete}
            onRequestClose={() => setShowDelete(false)}
            className="Modal"
            overlayClassName="Overlay"
            ariaHideApp={false}
          >
            <div>
              <h1>Voce tem certeza?</h1>
              <p>
                Deseja excluir a foto
                {' '}
                {name}
                ?
              </p>
              <div>
                <button type="button" onClick={handleDelete}>Sim, excluir.</button>
                <button type="button" onClick={() => setShowDelete(false)}>Não, cancelar.</button>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </>
  );
}
