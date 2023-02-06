import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaBars } from 'react-icons/fa';

import {
  AiOutlineDashboard, AiOutlineFileImage, AiOutlineUser, AiOutlineLogout,
} from 'react-icons/ai';

import aperamLogo from '../../assets/aperam-logo.png';
import * as actions from '../../store/modules/auth/actions';
import history from '../../services/history';
import './style.css';

export default function Navbar() {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    if (window.screen.width > 767) {
      setShowMenu(true);
    }
  }, [window.screen.width]);

  const { user } = useSelector((state) => state.auth);

  const handleMenu = () => setShowMenu(!showMenu);

  const logOut = () => {
    dispatch(actions.loginFailure());
    history.push('/login');
  };

  window.addEventListener('resize', () => {
    if (window.screen.width > 767) {
      setShowMenu(true);
    } else {
      setShowMenu(false);
    }
  });

  return (
    <>
      <div className="w-full fixed top-0 flex px-8 pt-8 pb-4 bg-gray-200 h-[15vh] z-10">
        <img
          src={aperamLogo}
          alt="Aperam"
          className="w-44"
        />

        <div className="hidden md:block border-2 border-roxo-100 rounded-full ml-auto px-6 py-2 h-min">
          <p>{user.name}</p>
        </div>

        <div className="block md:hidden ml-auto">
          <button type="button" onClick={handleMenu} className="hover:font-red-200">
            <FaBars size={38} className="text-gray-500 hover:text-gray-600" />
          </button>
        </div>
      </div>
      <div className={showMenu ? 'list lg:w-44 lg:h-[85vh]' : 'sm:list sm:hidden'}>
        <div className="flex flex-col justify-center h-full gap-5 md:gap-0 items-center py-3
          lg:gap-0 lg:justify-start lg:mt-0"
        >
          <div className="link-container">
            <Link className="link" to="/dashboard">
              <AiOutlineDashboard size={28} />
              Dashboard
            </Link>
          </div>
          <div className="link-container">
            <Link className="link" to="/fotos">
              <AiOutlineFileImage size={28} />
              Foto
            </Link>
          </div>
          <div className="link-container">
            <Link className="link" to="/usuario">
              <AiOutlineUser size={28} />
              Meu perfil
            </Link>
          </div>
          <div className="link-container">
            <button className="link w-full" type="button" onClick={logOut}>
              <AiOutlineLogout size={28} />
              Sair
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
