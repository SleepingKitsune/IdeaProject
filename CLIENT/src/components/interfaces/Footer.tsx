import React from 'react';

const Footer = () => {
  return (
    <footer className="home-footer">
    <div className="footer-contacts">
      <h3>Контакты</h3>
      <ul>
        <li>Телефон: +7 (XXX) XXX-XX-XX</li>
        <li>Email: info@example.com</li>
      </ul>
    </div>
    <div className="footer-links">
      <h3>Полезные ссылки</h3>
      <ul>
        <li><a href="/about">О нас</a></li>
        <li><a href="/privacy">Политика конфиденциальности</a></li>
      </ul>
    </div>
    <div className="footer-social">
      <h3>Мы в соцсетях</h3>
      <div className="social-links">
        <a href="#" className="social-icon">VK</a>
        <a href="#" className="social-icon">TG</a>
      </div>
    </div>
  </footer>
  );
};

export default Footer;