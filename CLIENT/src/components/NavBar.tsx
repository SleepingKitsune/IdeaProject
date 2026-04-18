// src/components/NavBar.tsx

import React from 'react';
import { NavLink } from 'react-router-dom';
import useLogout from '../hooks/useLogout';
import isAuthenticated from '../App'

const NavBar: React.FC = () => {
  const logout = useLogout();
  const isLoggedIn = isAuthenticated();

  

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
        {isLoggedIn && (
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
              <button onClick={logout} className="logout-button">
                Выход
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;