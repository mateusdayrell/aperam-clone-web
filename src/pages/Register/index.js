/* eslint-disable consistent-return */
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { get } from 'lodash';
import { Link } from 'react-router-dom';

import { useDispatch } from 'react-redux/es/exports';
import axios from '../../services/axios';
import bgLogin from '../../assets/bg-login.jpg';
import aperamLogo from '../../assets/aperam-logo.png';

import * as actions from '../../store/modules/auth/actions';

export default function Register(props) {
  const dispatch = useDispatch();

  const prevPath = get(props, 'location.state.prevPath', '/');
  // const isLoading = useSelector((state) => state.auth.isLoading);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return false;

    try {
      const regTemp = {
        name, email, password,
      };

      const { data } = await axios.post('/users', regTemp);
      toast.success('Usuário cadastrado com sucesso!');

      if (data) dispatch(actions.loginRequest({ email, password, prevPath }));
    } catch (error) {
      const erros = get(error, 'response.data.errors', []);
      erros.map((err) => toast.error(err));
    }
  };

  const validateForm = () => {
    let control = true;

    if (!name) {
      control = false;
      toast.info('Digite o seu nome.');
    } else if (name.length > 255) {
      control = false;
      toast.info('O nome deve ter no máximo 255 caracteres.');
    }

    if (!email) {
      control = false;
      toast.info('Digite um email.');
    } else if (email.length > 255) {
      control = false;
      toast.info('O nome deve ter no máximo 255 caracteres.');
    }

    if (!password) {
      control = false;
      toast.info('Digite uma senha.');
    } else if (password.length < 8) {
      control = false;
      toast.info('A senha deve ter no mínimo 8 caracteres.');
    } else if (password !== confirmPassword) {
      control = false;
      toast.info('As senhas não conferem.');
    }

    return control;
  };

  return (
    <div className="h-screen">
      <img
        src={bgLogin}
        alt="Floresta"
        className="hidden lg:block"
      />

      {/* RIGTH */}
      <div className="flex flex-col w-full justify-center items-center h-full gap-8">
        <div className="flex flex-col w-2/3 items-center gap-6">
          <img
            src={aperamLogo}
            alt="Aperam"
            className="w-52"
          />
          <p>Preencha os campos abaixo e crie sua conta</p>
        </div>

        <div className="flex flex-col w-3/4 gap-2">
          <div className="flex flex-col">
            <label>Nome</label>
            <input
              className="mt-2"
              type="text"
              name="name"
              placeholder="Digite seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label>E-mail</label>
            <input
              className="mt-2"
              type="email"
              name="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label className="pt-4">Senha</label>
            <input
              className="mt-2"
              type="password"
              name="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label className="pt-4">Confirme sua senha</label>
            <input
              className="mt-2"
              type="password"
              name="confirm-password"
              placeholder="********"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <Link className="ml-auto text-blue-400 hover:text-blue-700 duration-200" to="/login">
            Já tenho uma conta
          </Link>
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-roxo-100 text-gray-100 font-light rounded-md py-2 hover:bg-laranja-100 duration-300"
          >
            Entrar
          </button>
        </div>
      </div>
    </div>
  );
}
