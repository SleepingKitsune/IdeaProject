// src/components/NavBar.tsx

import Cookie from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

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
              <NavLink to="/auth" className={({ isActive }) => (isActive ? 'active' : '')}>
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

        {/* Ссылки для авторизованных пользователей.*/}
        {isLoggedIn ? (
          <>
            <li>
                <NavLink to="/allIdea" className={({ isActive }) => (isActive ? 'active' : '')}>
                Все идеи
                </NavLink>
            </li>
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
              <NavLink to="/favorite-idea" className={({ isActive }) => (isActive ? 'active' : '')}>
                Понравившиеся идеи
              </NavLink>
            </li>
            <li>
              <NavLink to="/my-ideas" className={({ isActive }) => (isActive ? 'active' : '')}>
                Мои идеи
              </NavLink>
            </li>
            <li>
              <button className="logout-bottom" 
                onClick={()=>{
                Cookie.remove("Session"); 
                isloggedInSet(""); 
                window.location.href = "/"; 
                }}
              >
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