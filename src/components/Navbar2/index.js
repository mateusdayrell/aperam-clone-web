import React from 'react';

import aperamLogo from '../../assets/aperam-logo.png';

export default function Navbar2() {
  return (
    <>
      <div className="w-full fixed top-0 flex px-8 pt-8 pb-4 bg-gray-200 h-[15vh] z-10">
        <img
          src={aperamLogo}
          alt="Aperam"
          className="w-44"
        />
        <div className="border-2 border-roxo-100 rounded-full ml-auto px-6 py-2 h-min">
          <p>Fernando Francisco</p>
        </div>
      </div>
      <div className="bg-roxo-100 lg:bg-yellow-300 sm:bg-red-500 mt-0 w-28 text-gray-100 h-[85vh] inline-block fixed top-[15vh] z-10">
        <div className="flex flex-col">
          <div>Dashboard</div>
          <div>Foto</div>
          <div>Meu perfil</div>
          <div>Sair</div>
        </div>
      </div>
    </>
  );
}
