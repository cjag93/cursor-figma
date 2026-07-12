const DEMO_EMAIL = 'demo@visionbank.com';
const DEMO_PASSWORD = 'demo1234';

const form = document.getElementById('login-form');
const errorMessage = document.getElementById('login-error');

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const email = form.email.value.trim();
  const password = form.password.value;

  if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
    sessionStorage.setItem('visionbank-user', email);
    window.location.href = '/dashboard';
    return;
  }

  errorMessage.classList.add('visible');
});
