import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import type { JSX } from 'react';
import NavBar from './components/NavBar';
//ПУБЛИЧНЫЕ СТРАНИЦЫ
import HomePage from './pages/HomePage'; //Страничка, рассказывающая о проекте
import LoginPage from './pages/LoginPage'; //Страница авторизации
import RegisterPage from './pages/RegisterPage';// Страница регистрации
import AllIdeaPage from './pages/AllIdeaPage';// Страница со всеми идеями на сайте
// Приватные страницы
import CreateIdeaPage from './pages/CreateIdeaPage';//Страница создания идеи
import ProfilePage from './pages/ProfilePage';// Профиль пользователя
import EditIdeaPage from './pages/EditIdeaPage';//Страница редактирования идеи
import FavoriteIdeaPage from './pages/FavoriteIdeaPage';//Страница с любимыми идеями (на которые пользователь поставил лайк)
import MyIdeasPage from './pages/MyIdeasPage';// страница с созданными пользователем идеями
import IdeaDetailPage from './pages/IdeaDetailPage'; //страничка с деталями идеи


const isAuthenticated = () => {
  return localStorage.getItem('token'); 
};

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        {/* --- ПУБЛИЧНЫЕ РУТЫ (Доступны всем) --- */}
        <Route path="/" element={<HomePage />} /> {/* Переправляет на страничку о нас*/}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/allIdea" element={<AllIdeaPage />} /> {/* Можно сделать редирект на главную */}

        {/* --- ПРИВАТНЫЕ РУТЫ (Только для авторизованных) --- */}
        <Route
          path="/create-idea"
          element={
            <ProtectedRoute>
              <CreateIdeaPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

          <Route
          path="/edit-idea/:id"
          element={
            <ProtectedRoute>
              <EditIdeaPage />
          </ProtectedRoute>
          }
          />
        
        
          <Route
          path="/favorite-idea"
          element={
            <ProtectedRoute>
              <FavoriteIdeaPage />
          </ProtectedRoute>
          }
          />
          <Route
          path="/my-ideas"
          element={
            <ProtectedRoute>
              <MyIdeasPage />
          </ProtectedRoute>
          }
          />
          <Route
          path="/idea-detail/:id"
          element={
            <ProtectedRoute>
              <IdeaDetailPage />
          </ProtectedRoute>
          }
          />
        

        {/* Редирект на главную, если пользователь ввёл несуществующий адрес */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;