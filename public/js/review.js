// public/js/review.js
import axios from 'https://cdn.jsdelivr.net/npm/axios@1.4.0/dist/esm/axios.min.js';
import { showAlert } from './alert.js';

export const createReview = async (tourId, review, rating) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `/api/v1/tours/${tourId}/reviews`,
      data: { review, rating },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Review submitted successfully!');
      window.setTimeout(() => {
        location.reload(); // reload to show new review
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

// public/js/index.js

const reviewForm = document.querySelector('.form--review');

if (reviewForm) {
  reviewForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const review = document.getElementById('review').value;
    const rating = document.getElementById('rating').value;
    const tourId = reviewForm.action.split('/').at(-2); // extract tourId
    createReview(tourId, review, rating);
  });
}
