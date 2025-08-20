var $cQivH$axios = require("axios");


function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}
// Example imports (adjust based on your project)
/* eslint-disable */ const $94d08129b2afe48f$export$516836c6a9dfc573 = ()=>{
    const el = document.querySelector('.alert');
    if (el) el.parentElement.removeChild(el);
};
const $94d08129b2afe48f$export$de026b00723010c1 = (type, msg, time = 7)=>{
    $94d08129b2afe48f$export$516836c6a9dfc573();
    const markup = `<div class="alert alert--${type}">${msg}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
    window.setTimeout($94d08129b2afe48f$export$516836c6a9dfc573, time * 1000);
};


const $34d42e5ece157c1e$var$displayMap = (locations)=>{
    const map = L.map('map', {
        scrollWheelZoom: true,
        minZoom: 5,
        maxZoom: 5
    });
    // Base tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    const points = [];
    // Add markers
    locations.forEach((loc, i)=>{
        const [lng, lat] = loc.coordinates; // Make sure your data matches [lng, lat] order
        points.push([
            lat,
            lng
        ]);
        L.marker([
            lat,
            lng
        ]).addTo(map).bindPopup(`<p>Day ${i + 1}: ${loc.description}</p>`, {
            autoClose: false
        });
    });
    // Fit to points
    map.fitBounds(points, {
        padding: [
            60,
            60
        ]
    });
};
document.addEventListener('DOMContentLoaded', ()=>{
    const mapEl = document.getElementById('map');
    if (mapEl) {
        const locations = JSON.parse(mapEl.dataset.locations);
        $34d42e5ece157c1e$var$displayMap(locations);
    }
});


// stripe.js
// Initialize Stripe with your publishable key
const $73e585bd0c7d6b97$var$stripe = Stripe('pk_test_51RxPZtGlxWdSMEL0bt6GYWC2eQugKHrG6Htsyuq1SNZ1hKMJgx9kVBqtOjuRyPeUqEd52P9OkWQfQs202VNDwv5D00eAABrUiC');
const $73e585bd0c7d6b97$export$8d5bdbf26681c0c2 = async (tourId)=>{
    try {
        // Get checkout session from API
        const session = await axios.get(`/api/v1/bookings/checkout-session/${tourId}`);
        // console.log('Stripe session:', session.data.session);
        // Redirect to checkout
        await $73e585bd0c7d6b97$var$stripe.redirectToCheckout({
            sessionId: session.data.session.id
        });
    } catch (err) {
        console.error(err.response ? err.response.data : err);
    }
};
// Attach event listener
const $73e585bd0c7d6b97$var$bookBtn = document.getElementById('book-tour');
if ($73e585bd0c7d6b97$var$bookBtn) $73e585bd0c7d6b97$var$bookBtn.addEventListener('click', (e)=>{
    e.target.textContent = 'Processing...';
    const tourId = e.target.dataset.tourId;
    $73e585bd0c7d6b97$export$8d5bdbf26681c0c2(tourId);
});



/* eslint-disable */ // It’s a JavaScript HTTP client used to make requests to the backend.


// =======================
// Login function
// =======================
const $433b644962c26f49$var$login = async (email, password)=>{
    try {
        const res = await (0, ($parcel$interopDefault($cQivH$axios)))({
            method: 'POST',
            url: '/api/v1/users/login',
            data: {
                email: email,
                password: password
            },
            withCredentials: true
        });
        if (res.data.status === 'success') {
            (0, $94d08129b2afe48f$export$de026b00723010c1)('success', 'Logged in successfully!');
            window.setTimeout(()=>{
                location.assign('/');
            }, 1500);
        }
    } catch (err) {
        var _err_response_data, _err_response;
        (0, $94d08129b2afe48f$export$de026b00723010c1)('error', ((_err_response = err.response) === null || _err_response === void 0 ? void 0 : (_err_response_data = _err_response.data) === null || _err_response_data === void 0 ? void 0 : _err_response_data.message) || 'Login failed');
    }
};
// =======================
// Logout function
// =======================
const $433b644962c26f49$var$logout = async ()=>{
    try {
        const res = await (0, ($parcel$interopDefault($cQivH$axios)))({
            method: 'GET',
            url: '/api/v1/users/logout',
            withCredentials: true
        });
        if (res.data.status === 'success') location.reload(true);
    } catch (err) {
        console.error('Logout error details:', err); // 👈 add this
        (0, $94d08129b2afe48f$export$de026b00723010c1)('error', 'Error logging out! Try again.');
    }
};
// =======================
// DOM Event Listeners
// =======================
const $433b644962c26f49$var$loginForm = document.querySelector('.form--login');
const $433b644962c26f49$var$logOutBtn = document.querySelector('.nav__el--logout');
if ($433b644962c26f49$var$loginForm) $433b644962c26f49$var$loginForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    $433b644962c26f49$var$login(email, password);
});
if ($433b644962c26f49$var$logOutBtn) $433b644962c26f49$var$logOutBtn.addEventListener('click', $433b644962c26f49$var$logout);


// public/js/review.js


const $8a4ec92b7f6c1127$export$e42a3d813dd6123f = async (tourId, review, rating)=>{
    try {
        const res = await (0, ($parcel$interopDefault($cQivH$axios)))({
            method: 'POST',
            url: `/api/v1/tours/${tourId}/reviews`,
            data: {
                review: review,
                rating: rating
            }
        });
        if (res.data.status === 'success') {
            (0, $94d08129b2afe48f$export$de026b00723010c1)('success', 'Review submitted successfully!');
            window.setTimeout(()=>{
                location.reload(); // reload to show new review
            }, 1000);
        }
    } catch (err) {
        (0, $94d08129b2afe48f$export$de026b00723010c1)('error', err.response.data.message);
    }
};
// public/js/index.js
const $8a4ec92b7f6c1127$var$reviewForm = document.querySelector('.form--review');
if ($8a4ec92b7f6c1127$var$reviewForm) $8a4ec92b7f6c1127$var$reviewForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const review = document.getElementById('review').value;
    const rating = document.getElementById('rating').value;
    const tourId = $8a4ec92b7f6c1127$var$reviewForm.action.split('/').at(-2); // extract tourId
    $8a4ec92b7f6c1127$export$e42a3d813dd6123f(tourId, review, rating);
});


/* eslint-disable */ 

const $bda620f9935374c5$var$signup = async (name, email, password, passwordConfirm, photo)=>{
    try {
        const form = new FormData();
        form.append('name', name);
        form.append('email', email);
        form.append('password', password);
        form.append('passwordConfirm', passwordConfirm);
        if (photo) form.append('photo', photo);
        const res = await (0, ($parcel$interopDefault($cQivH$axios)))({
            method: 'POST',
            url: '/api/v1/users/signup',
            data: form,
            withCredentials: true
        });
        if (res.data.status === 'success') {
            (0, $94d08129b2afe48f$export$de026b00723010c1)('success', 'Account created successfully!');
            window.setTimeout(()=>{
                location.assign('/');
            }, 1500);
        }
    } catch (err) {
        var _err_response_data, _err_response;
        (0, $94d08129b2afe48f$export$de026b00723010c1)('error', ((_err_response = err.response) === null || _err_response === void 0 ? void 0 : (_err_response_data = _err_response.data) === null || _err_response_data === void 0 ? void 0 : _err_response_data.message) || 'Signup failed');
    }
};
const $bda620f9935374c5$var$signupForm = document.querySelector('.form--signup');
if ($bda620f9935374c5$var$signupForm) $bda620f9935374c5$var$signupForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    const photo = document.getElementById('photo').files[0];
    $bda620f9935374c5$var$signup(name, email, password, passwordConfirm, photo);
});


/* eslint-disable */ 

const $16c4ecfd07562806$export$f558026a994b6051 = async (data, type)=>{
    try {
        const url = type === 'password' ? '/api/v1/users/updateMyPassword' : '/api/v1/users/updateMe';
        const res = await (0, ($parcel$interopDefault($cQivH$axios)))({
            method: 'PATCH',
            url: url,
            data: data
        });
        if (res.data.status === 'success') {
            (0, $94d08129b2afe48f$export$de026b00723010c1)('success', `${type === 'password' ? 'Password' : 'Data'} updated successfully!`);
            window.setTimeout(()=>{
                location.reload();
            }, 1500);
        }
    } catch (err) {
        var _err_response_data, _err_response;
        (0, $94d08129b2afe48f$export$de026b00723010c1)('error', ((_err_response = err.response) === null || _err_response === void 0 ? void 0 : (_err_response_data = _err_response.data) === null || _err_response_data === void 0 ? void 0 : _err_response_data.message) || err.message || 'Something went wrong!');
    }
};
// PROFILE UPDATE FORM (name, email, photo)
const $16c4ecfd07562806$var$userDataForm = document.querySelector('.form-user-data');
if ($16c4ecfd07562806$var$userDataForm) {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const photoInput = document.getElementById('photo');
    $16c4ecfd07562806$var$userDataForm.addEventListener('submit', (e)=>{
        e.preventDefault();
        // Create FormData object for sending text + file
        const form = new FormData();
        form.append('name', nameInput.value);
        form.append('email', emailInput.value);
        if (photoInput.files.length > 0) form.append('photo', photoInput.files[0]);
        // console.log(form);
        // Call your API update function
        $16c4ecfd07562806$export$f558026a994b6051(form, 'data');
    });
}
// PASSWORD UPDATE FORM
const $16c4ecfd07562806$var$userPasswordForm = document.querySelector('.form-user-password');
if ($16c4ecfd07562806$var$userPasswordForm) {
    const currentPassword = document.getElementById('password-current');
    const newPassword = document.getElementById('password');
    const confirmPassword = document.getElementById('password-confirm');
    $16c4ecfd07562806$var$userPasswordForm.addEventListener('submit', async (e)=>{
        e.preventDefault();
        const passwordBtn = document.querySelector('.btn--save-password');
        passwordBtn.textContent = 'Updating...';
        await $16c4ecfd07562806$export$f558026a994b6051({
            passwordCurrent: currentPassword.value,
            password: newPassword.value,
            passwordConfirm: confirmPassword.value
        }, 'password');
        passwordBtn.textContent = 'Save password';
        currentPassword.value = '';
        newPassword.value = '';
        confirmPassword.value = '';
    });
}


const $c74e663a61ed842a$var$alertMessage = document.querySelector('body').dataset.alert;
if ($c74e663a61ed842a$var$alertMessage) (0, $94d08129b2afe48f$export$de026b00723010c1)('success', $c74e663a61ed842a$var$alertMessage, 20);


//# sourceMappingURL=app.js.map
