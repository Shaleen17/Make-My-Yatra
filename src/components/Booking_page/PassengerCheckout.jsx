import { useEffect } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import ShieldIcon from "@mui/icons-material/Shield";
import WorkIcon from "@mui/icons-material/Work";
import PaymentButton from "../paymentPage/PaymentButton";
import {
  BookingHero,
  BookingPageStyle,
  EmptyBookingState,
  FareSummary,
} from "./BookingPageShell";
import {
  formatDate,
  formatDuration,
  getSelectedFlight,
  getStopText,
  hasSelectedFlight,
  saveFareAmount,
} from "./bookingPageUtils";

const loadRazorpayScript = () => {
  const src = "https://checkout.razorpay.com/v1/checkout.js";
  if (typeof document === "undefined" || document.querySelector(`script[src="${src}"]`)) {
    return;
  }

  const script = document.createElement("script");
  script.src = src;
  script.async = true;
  document.body.appendChild(script);
};

export const PassengerCheckout = () => {
  const flight = getSelectedFlight();
  const hasFlight = hasSelectedFlight(flight);

  useEffect(() => {
    loadRazorpayScript();
  }, []);

  if (!hasFlight) {
    return (
      <BookingPageStyle>
        <BookingHero
          activeStep={1}
          subtitle="Select a flight first, then add traveller and contact details."
          title="Traveller details"
        />
        <div className="page-container">
          <EmptyBookingState />
        </div>
      </BookingPageStyle>
    );
  }

  const routeTitle = `${flight.departure.iata} to ${flight.arrival.iata}`;
  const handlePay = () => {
    saveFareAmount(flight);
  };

  return (
    <BookingPageStyle>
      <BookingHero
        activeStep={1}
        subtitle={`${routeTitle} | ${formatDate(flight.departure.scheduled)} | ${getStopText(
          flight
        )} | ${formatDuration(flight)}`}
        title="Traveller details"
      />
      <div className="page-container booking-grid">
        <div className="left-column">
          <section className="card">
            <div className="section-title-row">
              <div>
                <p className="eyebrow">Adult 1 of 1</p>
                <h2>Traveller Information</h2>
                <p>Enter the name exactly as it appears on a government ID.</p>
              </div>
              <span className="status-pill">
                <PersonIcon /> Required
              </span>
            </div>
            <div className="field-grid">
              <div className="field">
                <label>First name</label>
                <input placeholder="Enter first name" type="text" />
              </div>
              <div className="field">
                <label>Last name</label>
                <input placeholder="Enter last name" type="text" />
              </div>
              <div className="field">
                <label>Gender</label>
                <select defaultValue="">
                  <option disabled value="">
                    Select gender
                  </option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </section>

          <section className="card">
            <div className="section-title-row">
              <div>
                <p className="eyebrow">Booking Details</p>
                <h2>Ticket Delivery</h2>
                <p>Your ticket and flight alerts will be sent here.</p>
              </div>
              <span className="soft-pill">
                <EmailIcon /> Contact
              </span>
            </div>
            <div className="field-grid">
              <div className="field">
                <label>Country code</label>
                <select defaultValue="+91">
                  <option value="+91">+91 India</option>
                </select>
              </div>
              <div className="field">
                <label>Mobile number</label>
                <input placeholder="Mobile number" type="tel" />
              </div>
              <div className="field">
                <label>Email address</label>
                <input placeholder="Email address" type="email" />
              </div>
            </div>
          </section>

          <section className="card">
            <div className="section-title-row">
              <div>
                <p className="eyebrow">GST Details</p>
                <h2>Business Travel</h2>
                <p>Add GST details if this booking is for business travel.</p>
              </div>
              <span className="soft-pill">
                <WorkIcon /> Optional
              </span>
            </div>
            <label className="checkbox-line">
              <input type="checkbox" />
              I want to enter my company GST number for this booking.
            </label>
          </section>

          <section className="card">
            <div className="section-title-row">
              <div>
                <p className="eyebrow">Add-ons</p>
                <h2>Trip Protection</h2>
                <p>Secure this journey with travel assistance at INR 299 per traveller.</p>
              </div>
              <span className="status-pill">
                <ShieldIcon /> Available
              </span>
            </div>
            <div className="radio-grid">
              <label className="radio-option">
                <input name="tripProtection" type="radio" />
                <span>
                  <strong>Yes, secure my trip</strong>
                  Includes basic travel assistance and support.
                </span>
              </label>
              <label className="radio-option">
                <input defaultChecked name="tripProtection" type="radio" />
                <span>
                  <strong>No, continue without protection</strong>
                  You can still manage your booking after payment.
                </span>
              </label>
            </div>
          </section>

          <section className="card">
            <div className="benefit-grid">
              <div className="benefit-item">
                <CheckCircleIcon />
                <p>Fare rules, privacy policy, and terms apply to this booking.</p>
              </div>
              <div className="benefit-item">
                <CreditCardIcon />
                <p>Payment opens in a secure Razorpay checkout window.</p>
              </div>
              <div className="benefit-item">
                <PhoneIphoneIcon />
                <p>Booking confirmation is sent by SMS and email.</p>
              </div>
              <div className="benefit-item">
                <ShieldIcon />
                <p>Your selected live fare is stored before payment starts.</p>
              </div>
            </div>
          </section>
        </div>

        <FareSummary
          action={
            <div className="payment-action">
              <PaymentButton label="BOOK NOW" onBeforePay={handlePay} />
            </div>
          }
          flight={flight}
        />
      </div>
    </BookingPageStyle>
  );
};

