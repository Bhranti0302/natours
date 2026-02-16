// Example imports (adjust based on your project)
import { showAlert } from './alert.js';
import './map';
import './stripe';
import './alert';
import './login';
import './review';
import './signup';
import './updateSetting';

const alertMessage = document.querySelector('body').dataset.alert;
if (alertMessage) showAlert('success', alertMessage, 20);
