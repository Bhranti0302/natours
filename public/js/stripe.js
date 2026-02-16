const stripe = Stripe(
  'pk_test_51RxPZtGlxWdSMEL0bt6GYWC2eQugKHrG6Htsyuq1SNZ1hKMJgx9kVBqtOjuRyPeUqEd52P9OkWQfQs202VNDwv5D00eAABrUiC'
);

const bookTour = async (tourId) => {
  if (!tourId) return alert('Tour ID is missing!');

  try {
    const res = await axios.get(`/api/v1/bookings/checkout-session/${tourId}`);
    const sessionId = res.data.sessionId; // ✅ use sessionId directly

    if (!sessionId) throw new Error('No sessionId returned from backend');

    await stripe.redirectToCheckout({ sessionId }); // ✅ pass sessionId
  } catch (err) {
    console.error(err.response ? err.response.data : err);
    alert('Booking failed. Please try again.');

    const bookBtn = document.getElementById('book-tour');
    if (bookBtn) bookBtn.textContent = 'Book tour now!';
  }
};

// Attach event listener
const bookBtn = document.getElementById('book-tour');
if (bookBtn) {
  bookBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';
    const tourId = e.target.dataset.tourId;
    bookTour(tourId);
  });
}
