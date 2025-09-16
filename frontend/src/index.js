import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Added import
import App from './App';
import { AuthProvider } from './context/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter> {/* Added BrowserRouter */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter> {/* Added BrowserRouter */}
  </React.StrictMode>
);

window.addEventListener('load', () => {
  // small delay for perceived performance
  requestAnimationFrame(() => document.querySelector('body').classList.add('loaded'));
});

document.addEventListener('DOMContentLoaded', () => {
  const applyBtn = document.getElementById('applyBtn');
  if (applyBtn) {
    applyBtn.addEventListener('click', function(e){
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      this.appendChild(ripple);
      const d = Math.max(this.clientWidth, this.clientHeight);
      ripple.style.width = ripple.style.height = d + 'px';
      ripple.style.left = (e.clientX - this.getBoundingClientRect().left - d/2) + 'px';
      ripple.style.top = (e.clientY - this.getBoundingClientRect().top - d/2) + 'px';
      setTimeout(()=> ripple.remove(), 600);
    });
  }

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        obs.unobserve(e.target); // remove if you want one-time reveal
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
});