import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import type { JSX } from 'react';
import './global.css'
import NavBar, { type INavBar } from './components/NavBar';
//ПУБЛИЧНЫЕ СТРАНИЦЫ
import HomePage from './pages/HomePage'; //Страничка, рассказывающая о проекте
import RegisterPage from './pages/RegisterPage';// Страница регистрации
import AllIdeaPage from './pages/AllIdeaPage';// Страница со всеми идеями на сайте
import AuthPage from './pages/AuthPage';//Авторизация
// Приватные страницы
import CreateIdeaPage from './pages/CreateIdeaPage';//Страница создания идеи
import Profile from './pages/Profile'// Профиль пользователя
import EditIdeaPage from './pages/EditIdeaPage';//Страница редактирования идеи
import FavoriteIdeaPage from './pages/FavoriteIdeaPage';//Страница с любимыми идеями (на которые пользователь поставил лайк)
import MyIdeasPage from './pages/MyIdeasPage';// страница с созданными пользователем идеями
import IdeaDetailPage from './pages/DetailIdeaPage'; //страничка с деталями идеи
import Cookies from 'js-cookie';
import Footer from './components/interfaces/Footer';
import DetailIdeaPage from './pages/DetailIdeaPage';
import EditProfilePage from './pages/EditProfilePage';

function App() {
  let [isLoggedIn, setIsloggedIn] = useState(():string=>{if (Cookies.get("Session") != undefined) {
    return "1"
  } else {
    return ""
  }});
  return (
    <Router>
      <div className='page-container'>
        <NavBar isLoggedIn={isLoggedIn} isloggedInSet={setIsloggedIn}/>
        <Routes>
          {/* --- ПУБЛИЧНЫЕ РУТЫ (Доступны всем) --- */}
          <Route path="/" element={<HomePage />} /> {/* Переправляет на страничку о нас*/}
          <Route path="/auth" element={<AuthPage isloggedIn={setIsloggedIn}/>} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/allIdea" element={<AllIdeaPage />} />
          <Route path='/EditIdea' element={<EditIdeaPage/> } />
          <Route path='/DetailIdea' element={<DetailIdeaPage/> } />
          <Route path='/Profile' element={<Profile/> } />

          {/* --- ПРИВАТНЫЕ РУТЫ (Только для авторизованных) --- */}
          <Route
            path="/create-idea"
            element={
              // <ProtectedRoute>
                <CreateIdeaPage />
              // </ProtectedRoute>
            }
          />
          <Route
            path="/edit-profile"
            element={
              // <ProtectedRoute>
                <EditProfilePage/>
              // </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              // <ProtectedRoute>
                <Profile/>
              // </ProtectedRoute>
            }
          />
          
          
            <Route
            path="/favorite-idea"
            element={
              // <ProtectedRoute>
                <FavoriteIdeaPage />
            // </ProtectedRoute>
            }
            />
            <Route
            path="/my-ideas"
            element={
              // <ProtectedRoute>
                <MyIdeasPage />
            // </ProtectedRoute>
            }
            />
            <Route
            path="/idea-detail/:id"
            element={
              // <ProtectedRoute>
                <IdeaDetailPage />
            // </ProtectedRoute>
            }
            />
          

          {/* Редирект на главную, если пользователь ввёл несуществующий адрес */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer/>
      </div>  
    </Router>
  );
}

export default App;