import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { get } from 'lodash';
import { Link } from 'react-router-dom';

import { useDispatch } from 'react-redux/es/exports';
import bgLogin from '../../assets/bg-login.jpg';
import aperamLogo from '../../assets/aperam-logo.png';

import * as actions from '../../store/modules/auth/actions';

export default function Login(props) {
  const dispatch = useDispatch();

  const prevPath = get(props, 'location.state.prevPath', '/dashboard');
  // const isLoading = useSelector((state) => state.auth.isLoading);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    let formErros = false;

    if (!email) {
      formErros = true;
      toast.info('Digite um e-mail');
    }

    if (!password) {
      formErros = true;
      toast.info('Digite uma senha');
    }

    if (formErros) return;

    dispatch(actions.loginRequest({ email, password, prevPath }));
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
          <p className="text-sm">Preencha os campos abaixo e entre em sua conta</p>
        </div>

        <div className="flex flex-col w-3/4 gap-2">
          <div className="flex flex-col">
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
          </div>

          <Link className="ml-auto text-blue-400 hover:text-blue-700 duration-200" to="/cadastrar-usuario">
            Criar uma nova conta
          </Link>
          <button
            type="button"
            onClick={handleSubmit}
            className="purple-btn"
          >
            Entrar
          </button>
        </div>
      </div>
    </div>
  );
}
