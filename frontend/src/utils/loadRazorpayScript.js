const RAZORPAY_SRC = 'https://checkout.razorpay.com/v1/checkout.js';

let loadPromise = null;

// Loads the Razorpay Checkout script once and caches the in-flight promise
// so concurrent callers don't inject the script tag more than once.
export const loadRazorpayScript = () => {
  if (window.Razorpay) return Promise.resolve(true);
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = RAZORPAY_SRC;
    script.onload = () => resolve(true);
    script.onerror = () => {
      loadPromise = null;
      resolve(false);
    };
    document.body.appendChild(script);
  });

  return loadPromise;
};
