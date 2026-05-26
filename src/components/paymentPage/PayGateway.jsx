import axios from "axios";
import { API_BASE_URL, FRONTEND_URL, RAZORPAY_KEY_ID } from "../../config";

const displayRazorpay = async () => {
  if (!RAZORPAY_KEY_ID) {
    alert("Razorpay key is missing. Add REACT_APP_RAZORPAY_KEY_ID in .env.");
    return;
  }

  if (!window.Razorpay) {
    alert("Razorpay checkout is still loading. Please try again.");
    return;
  }

  let x;

  try {
    x = await axios.post(`${API_BASE_URL}/razorpay`, {
      price: 1,
    });
  } catch (error) {
    alert(error.response?.data?.message || "Payment could not be started.");
    return;
  }

  let data = x.data;
  const options = {
    key: RAZORPAY_KEY_ID,
    currency: data.currency,
    amount: data.amount,
    name: "Tirth Yatra",
    description: "Pay to Tirth Yatra",
    image: "https://imgak.mmtcdn.com/pwa_v3/pwa_hotel_assets/header/logo@2x.png",
    order_id: data.id,
    handler: function (response) {
      // let x = {
      //   id: response.razorpay_payment_id,
      //   order_id: response.razorpay_order_id
      // }
      // localStorage.setItem('payment',JSON.stringify(x))
      alert("PAYMENT ID ::" + response.razorpay_payment_id);
      alert("ORDER ID :: " + response.razorpay_order_id);
      window.location.href = FRONTEND_URL;
    },
    prefill: {
      name: "dharmesh",
      email: "dharmehs@gmail.com",
      contact: "9306835403",
    },
  };

  const paymentObject = new window.Razorpay(options);
  paymentObject.open();
};

export default displayRazorpay;
