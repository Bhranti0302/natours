// stripe.js

// Initialize Stripe with your publishable key
const stripe = Stripe(
  'pk_test_51RxPZtGlxWdSMEL0bt6GYWC2eQugKHrG6Htsyuq1SNZ1hKMJgx9kVBqtOjuRyPeUqEd52P9OkWQfQs202VNDwv5D00eAABrUiC'
);

// Booking function
export const bookTour = async (tourId) => {
  try {
    // Get checkout session from API
    const session = await axios.get(
      `http://localhost:3000/api/v1/bookings/checkout-session/${tourId}`
    );

    console.log('Stripe session:', session.data.session);

    // Redirect to checkout
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.error(err.response ? err.response.data : err);
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
