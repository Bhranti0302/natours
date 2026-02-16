/* eslint-disable */
// It’s a JavaScript HTTP client used to make requests to the backend.
import axios from 'axios';

import { showAlert } from './alert.js';

// =======================
// Login function
// =======================
const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: { email, password },
      withCredentials: true, // Allow cookies
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response?.data?.message || 'Login failed');
  }
};

// =======================
// Logout function
// =======================
const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout',
      withCredentials: true,
    });
    if (res.data.status === 'success') location.reload(true);
  } catch (err) {
    console.error('Logout error details:', err); // 👈 add this
    showAlert('error', 'Error logging out! Try again.');
  }
};

// =======================
// DOM Event Listeners
// =======================
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (logOutBtn) {
  logOutBtn.addEventListener('click', logout);
}
