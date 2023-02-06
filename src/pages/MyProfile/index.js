import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { get } from 'lodash';
// import bcryptjs from 'bcryptjs';
import bcrypt from 'bcryptjs-react';
import Modal from 'react-modal';
import { BsTrash } from 'react-icons/bs';
import { AiOutlineUser } from 'react-icons/ai';

import Navbar from '../../components/Navbar';
import history from '../../services/history';
import axios from '../../services/axios';
import * as actions from '../../store/modules/auth/actions';

export default function MyProfile() {
  const dispatch = useDispatch();

  const sessionData = useSelector((state) => state.auth);
  const { user } = sessionData;

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [showModal, setShowModal] = useState(false);

  const handleNameEmail = async () => {
    let errors = false;
    if (!name) {
      toast.error('Digite um nome');
      errors = true;
    }
    if (!email) {
      toast.error('Digite um nome');
      errors = true;
    }
    if (errors) return;

    try {
      const regTemp = {
        name, email,
      };

      const { data } = await axios.put(`/users/${user.id}`, regTemp);
      toast.success('Seus dados foram atualizados com sucesso.');

      setName(data.name);
      setEmail(data.email);

      dispatch(actions.loginSuccess({ // modificar dados da sessão
        token: sessionData.token,
        user: {
          id: user.id,
          name: data.name,
          email: data.email,
        },
      }));
    } catch (error) {
      const erros = get(error, 'response.data.errors', []);
      erros.map((err) => toast.error(err));
    }
  };

  const handlePassword = async () => {
    try {
      let errors = false;
      const { password_hash } = await getUser();

      if (!currentPassword) {
        toast.error('Digite a sua senha atual.');
      } else if (!await bcrypt.compare(currentPassword, password_hash)) {
        toast.error('A senha atual informada está incorreta.');
        errors = true;
      }

      if (!newPassword) {
        toast.error('Digite a sua nova senha.');
        errors = true;
      } else if (newPassword.length < 8) {
        toast.error('A sua nova senha deve ter no mínimo 8 caracteres.');
        errors = true;
      } else if (newPassword !== confirmNewPassword) {
        toast.error('As senhas não conferem.');
        errors = true;
      }

      if (errors) return;

      const regTemp = {
        password: newPassword,
      };

      await axios.put(`/users/${user.id}`, regTemp);
      toast.success('A sua senha foi atualizada com sucesso.');
    } catch (error) {
      const erros = get(error, 'response.data.errors', []);
      erros.map((err) => toast.error(err));
    }
  };

  const getUser = async () => {
    try {
      const { data } = await axios.get(`/users/${user.id}`);

      return data;
    } catch (error) {
      const erros = get(error, 'response.data.errors', []);
      erros.map((err) => toast.error(err));
      return null;
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/users/${user.id}`);
      toast.success('A sua conta foi excluída com sucesso.');
      dispatch(actions.loginFailure());
      history.push('/login');
    } catch (error) {
      const erros = get(error, 'response.data.errors', []);
      erros.map((err) => toast.error(err));
    }
  };

  return (
    <>
      <Navbar />
      <div className="app-container">
        <div className="flex justify-center gap-2 items-center mb-4">
          <AiOutlineUser size={42} />
          <h1 className="font-black text-3xl">Meu perfil</h1>
        </div>
        <div className="box-container">
          <div className="flex flex-col">
            <h1 className="title">Meus dados</h1>
            <p className="text-sm">Atualize os dados da sua conta, nome e endereço de email.</p>
            <div className="w-full mt-2">
              <label className="mb-1">Nome</label>
              <input
                type="text"
                className="w-full"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <label className="mt-2 mb-1">Email</label>
              <input
                type="email"
                className="w-full"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              type="button"
              className="purple-btn mt-3"
              onClick={handleNameEmail}
            >
              Salvar
            </button>
          </div>

          <hr className="line" />

          <div className="flex flex-col">
            <h1 className="title">Atualizar senha</h1>
            <p className="text-sm">
              Certifique-se de que sua conta esteja usando uma senha
              longa e aleatória para se manter segura.
            </p>
            <div className="mt-2">
              <label className="mb-1">Senha atual</label>
              <input
                type="password"
                name="password"
                className="w-full"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />

              <label className="mt-2 mb-1">Nova senha</label>
              <input
                type="password"
                name="new_password"
                className="w-full"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <label className="mt-2 mb-1">Confirmar a nova senha</label>
              <input
                type="password"
                className="w-full"
                name="confirm_new_password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
            </div>
            <button
              type="button"
              className="purple-btn mt-3"
              onClick={handlePassword}
            >
              Salvar
            </button>
          </div>

          <hr className="line" />

          <div>
            <h1 className="title">Excluir conta</h1>
            <p className="text-sm">
              Depois que sua conta for excluída, não será possível
              efetuar o login com as suas credenciais.
            </p>
            <button
              type="button"
              className="bg-red-500 flex items-center gap-2 text-gray-100 px-8 py-2 rounded-xl mt-4 hover:bg-red-700"
              onClick={() => setShowModal(true)}
            >
              <BsTrash />
              Excluir conta
            </button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        className="Modal"
        overlayClassName="Overlay"
        ariaHideApp={false}
      >
        <div className="m-container">
          <h1 className="m-title title">Voce tem certeza?</h1>
          <p className="m-text">Deseja excluir a sua conta?</p>
          <div className="text-center">
            <button type="button" className="confirm-btn" onClick={handleDelete}>Sim, excluir.</button>
            <button type="button" className="reject-btn" onClick={() => setShowModal(false)}>Não, cancelar.</button>
          </div>
        </div>
      </Modal>
    </>
  );
}
