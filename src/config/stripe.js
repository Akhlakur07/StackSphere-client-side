import { loadStripe } from '@stripe/stripe-js';

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe('pk_test_51SCOfmC9olKSflNC9ADxA092eEZvFAc0oXCnY86NY8HzSusfCbMHEGF2JNfilLi3ykvdGqLLYQVX3kAF9uMm6mdO000o8SSOEg');

export default stripePromise;