/* eslint-disable */
import axios from 'https://cdn.jsdelivr.net/npm/axios@1.4.0/dist/esm/axios.min.js';
import { showAlert } from './alert.js';

// Update user data or password
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? 'http://localhost:3000/api/v1/users/updateMyPassword'
        : 'http://localhost:3000/api/v1/users/updateMe';

    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', `${type === 'password' ? 'Password' : 'Data'} updated successfully!`);
      window.setTimeout(() => {
        location.reload();
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response?.data?.message || err.message || 'Something went wrong!');
  }
};

// PROFILE UPDATE FORM (name, email, photo)
const userDataForm = document.querySelector('.form-user-data');

if (userDataForm) {
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const photoInput = document.getElementById('photo');

  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Create FormData object for sending text + file
    const form = new FormData();
    form.append('name', nameInput.value);
    form.append('email', emailInput.value);
    if (photoInput.files.length > 0) {
      form.append('photo', photoInput.files[0]);
    }
    console.log(form);

    // Call your API update function
    updateSettings(form, 'data');
  });
}

// PASSWORD UPDATE FORM
const userPasswordForm = document.querySelector('.form-user-password');
if (userPasswordForm) {
  const currentPassword = document.getElementById('password-current');
  const newPassword = document.getElementById('password');
  const confirmPassword = document.getElementById('password-confirm');

  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const passwordBtn = document.querySelector('.btn--save-password');
    passwordBtn.textContent = 'Updating...';

    await updateSettings(
      {
        passwordCurrent: currentPassword.value,
        password: newPassword.value,
        passwordConfirm: confirmPassword.value,
      },
      'password'
    );

    passwordBtn.textContent = 'Save password';
    currentPassword.value = '';
    newPassword.value = '';
    confirmPassword.value = '';
  });
}
