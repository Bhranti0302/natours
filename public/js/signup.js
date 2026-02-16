/* eslint-disable */
import axios from 'axios';

import { showAlert } from './alert.js';

const signup = async (name, email, password, passwordConfirm, photo) => {
  try {
    const form = new FormData();
    form.append('name', name);
    form.append('email', email);
    form.append('password', password);
    form.append('passwordConfirm', passwordConfirm);
    if (photo) form.append('photo', photo);

    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data: form,
      withCredentials: true,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Account created successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response?.data?.message || 'Signup failed');
  }
};

const signupForm = document.querySelector('.form--signup');

if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    const photo = document.getElementById('photo').files[0];

    signup(name, email, password, passwordConfirm, photo);
  });
}
