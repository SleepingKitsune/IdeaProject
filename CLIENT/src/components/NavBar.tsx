// src/components/NavBar.tsx

import Cookie from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

export interface INavBar {
  isLoggedIn:string,
  isloggedInSet:React.Dispatch<React.SetStateAction<string>>
}

const NavBar: React.FC<INavBar> = ({isLoggedIn, isloggedInSet}) => {
  useEffect(()=>{},[isLoggedIn]);
  
  return (
    <nav className="home-nav">
      <ul>
        <li>
          <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
            Главная
          </NavLink>
        </li>
        
        {/* Ссылки для гостей */}
        {!isLoggedIn && (
          <>
            <li>
              <NavLink to="/login" className={({ isActive }) => (isActive ? 'active' : '')}>
                Войти
              </NavLink>
            </li>
            <li>
              <NavLink to="/register" className={({ isActive }) => (isActive ? 'active' : '')}>
                Регистрация
              </NavLink>
            </li>
            <li>
                <NavLink to="/allIdea" className={({ isActive }) => (isActive ? 'active' : '')}>
                Все идеи
                </NavLink>
            </li>
          </>
        )}

        {/* Ссылки для авторизованных пользователей. ПРОПИСАТЬ ОСТАВШИЕСЯ */}
        {isLoggedIn ? (
          <>
            <li>
              <NavLink to="/profile" className={({ isActive }) => (isActive ? 'active' : '')}>
                Профиль
              </NavLink>
            </li>
            <li>
              <NavLink to="/create-idea" className={({ isActive }) => (isActive ? 'active' : '')}>
                Создать идею
              </NavLink>
            </li>

            <li>
              {/* Кнопка выхода */}
              <button className="logout-button" onClick={()=>{Cookie.remove("Session"); isloggedInSet(""); }}>
                Выход
              </button>
            </li>
          </>
        ):null}
      </ul>
    </nav>
  );
};

export default NavBar;