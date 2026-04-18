import React from 'react';

const HomePage = () => {
  return (
    <div className="home-page">
      <main className="home-content">
        <h1>Платформа для начинающих IT-специалистов</h1>
        <p>
          Объединяем талантливых студентов и молодых разработчиков для совместной работы над проектами.
          Получите реальный опыт, создайте портфолио и найдите команду единомышленников!
        </p>
        
        <h2>Почему стоит присоединиться?</h2>
        <ul>
          <li><strong>Командная работа:</strong> Учитесь взаимодействовать в реальном проекте.</li>
          <li><strong>Портфолио:</strong> Покажите работодателям готовый кейс, а не просто тестовые задания.</li>
          <li><strong>Сообщество:</strong> Найдите друзей и будущих коллег по цеху.</li>
        </ul>
        
        <div className="cta-block">
          <a href="/register" className="cta-button">Присоединиться к сообществу</a>
        </div>
      </main>

      <footer className="home-footer">
        <div className="contacts">
          <h3>Контакты с автором</h3>
          <ul>
            <li>Email: my-email@example.com</li>
            <li>Telegram: @my_telegram_handle</li>
          </ul>
        </div>
        
        <div className="social-links">
          <h3>Мы в соцсетях</h3>
          <a href="#" target="_blank" rel="noopener noreferrer">ВКонтакте</a>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;