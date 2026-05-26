import styled from "styled-components";
import { Link } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import {
  formatAmount,
  getCurrency,
  getFareBreakup,
} from "./bookingPageUtils";

export const BookingPageStyle = styled.div`
  background: #faf7f2;
  color: #2c1810;
  font-family: 'Outfit', sans-serif;
  min-height: 100vh;

  * {
    box-sizing: border-box;
  }

  .booking-hero {
    background:
      radial-gradient(circle at 82% 22%, rgba(255, 169, 77, 0.2), transparent 28%),
      linear-gradient(135deg, #2c1810 0%, #5f2b1e 54%, #8f3f21 100%);
    color: #ffffff;
    padding: 34px 6vw 96px;
  }

  .booking-hero-inner {
    align-items: flex-start;
    display: flex;
    gap: 28px;
    justify-content: space-between;
    margin: 0 auto;
    max-width: 1240px;
  }

  .eyebrow {
    color: #c0392b;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0;
    margin: 0 0 8px;
    text-transform: uppercase;
  }

  .booking-hero .eyebrow {
    color: #ffd6c3;
  }

  h1,
  h2,
  h3,
  p {
    letter-spacing: 0;
  }

  h1 {
    color: #ffffff;
    font-size: clamp(28px, 4vw, 42px);
    line-height: 1.12;
    margin: 0 0 10px;
  }

  .hero-subtitle {
    color: #f7dfcf;
    font-size: 15px;
    line-height: 1.6;
    margin: 0;
    max-width: 650px;
  }

  .booking-steps {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: flex-end;
    max-width: 520px;
  }

  .booking-step {
    align-items: center;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 8px;
    color: #ffe7db;
    display: inline-flex;
    font-size: 12px;
    font-weight: 800;
    gap: 7px;
    min-height: 34px;
    padding: 8px 11px;
    white-space: nowrap;
  }

  .booking-step.active {
    background: #ffffff;
    border-color: #ffffff;
    color: #c0392b;
  }

  .booking-step svg {
    font-size: 15px;
  }

  .page-container {
    margin: -64px auto 0;
    max-width: 1240px;
    padding: 0 24px 56px;
  }

  .booking-grid {
    display: grid;
    gap: 24px;
    grid-template-columns: minmax(0, 1fr) minmax(320px, 380px);
  }

  .left-column,
  .side-column {
    display: grid;
    gap: 18px;
  }

  .side-column {
    align-self: start;
    position: sticky;
    top: 78px;
  }

  .card,
  .notice-card,
  .promo-card {
    background: #ffffff;
    border: 1px solid #efe6dc;
    border-radius: 8px;
    box-shadow: 0 12px 32px rgba(44, 24, 16, 0.08);
  }

  .card {
    padding: 22px;
  }

  .section-title-row,
  .summary-row,
  .fare-total,
  .mini-row {
    align-items: center;
    display: flex;
    gap: 16px;
    justify-content: space-between;
  }

  .section-title-row {
    margin-bottom: 18px;
  }

  .section-title-row h2,
  .card h2,
  .summary-card h2 {
    color: #2c1810;
    font-size: 24px;
    line-height: 1.2;
    margin: 0;
  }

  .section-title-row p,
  .muted {
    color: #76675e;
    font-size: 13px;
    line-height: 1.5;
    margin: 5px 0 0;
  }

  .status-pill,
  .soft-pill {
    align-items: center;
    border-radius: 999px;
    display: inline-flex;
    font-size: 12px;
    font-weight: 800;
    gap: 6px;
    min-height: 30px;
    padding: 7px 11px;
    white-space: nowrap;
  }

  .status-pill {
    background: #e9fbf2;
    color: #168554;
  }

  .soft-pill {
    background: #fff3ec;
    color: #c0392b;
  }

  .flight-strip {
    align-items: center;
    background: #fffaf5;
    border: 1px solid #f1e4d9;
    border-radius: 8px;
    display: grid;
    gap: 22px;
    grid-template-columns: minmax(170px, 0.8fr) minmax(320px, 1.4fr);
    padding: 18px;
  }

  .airline-lockup {
    align-items: center;
    display: flex;
    gap: 12px;
    min-width: 0;
  }

  .airline-lockup img,
  .airline-fallback {
    background: #ffffff;
    border: 1px solid #efe6dc;
    border-radius: 8px;
    height: 44px;
    object-fit: contain;
    width: 44px;
  }

  .airline-fallback {
    align-items: center;
    color: #c0392b;
    display: flex;
    font-size: 14px;
    font-weight: 900;
    justify-content: center;
  }

  .airline-name {
    color: #2c1810;
    font-size: 16px;
    font-weight: 900;
    margin: 0 0 4px;
  }

  .route-flow {
    align-items: center;
    display: grid;
    gap: 16px;
    grid-template-columns: minmax(90px, 0.75fr) minmax(160px, 1fr) minmax(90px, 0.75fr);
  }

  .time-block h3 {
    color: #2c1810;
    font-size: 26px;
    margin: 0 0 4px;
  }

  .time-block.arrival {
    text-align: right;
  }

  .time-block strong {
    color: #2c1810;
    display: block;
    font-size: 15px;
    margin-bottom: 3px;
  }

  .route-center {
    color: #76675e;
    font-size: 12px;
    font-weight: 800;
    text-align: center;
  }

  .route-line {
    background: linear-gradient(90deg, #ff8c5a, #c0392b);
    border-radius: 999px;
    height: 4px;
    margin: 9px 0;
    position: relative;
  }

  .route-line::before,
  .route-line::after {
    background: #ffffff;
    border: 2px solid #c0392b;
    border-radius: 999px;
    content: "";
    height: 10px;
    position: absolute;
    top: -5px;
    width: 10px;
  }

  .route-line::before {
    left: 0;
  }

  .route-line::after {
    right: 0;
  }

  .detail-grid,
  .info-grid,
  .field-grid,
  .benefit-grid {
    display: grid;
    gap: 12px;
  }

  .detail-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    margin-top: 16px;
  }

  .mini-panel,
  .field,
  .radio-option {
    background: #fffaf5;
    border: 1px solid #f1e4d9;
    border-radius: 8px;
    padding: 14px;
  }

  .mini-panel svg,
  .notice-card svg,
  .promo-card svg {
    color: #c0392b;
  }

  .mini-panel h3,
  .field label,
  .radio-option strong {
    color: #2c1810;
    display: block;
    font-size: 13px;
    font-weight: 900;
    margin: 0 0 6px;
  }

  .mini-panel p,
  .radio-option span {
    color: #76675e;
    font-size: 13px;
    line-height: 1.45;
    margin: 0;
  }

  .notice-card {
    align-items: center;
    display: flex;
    gap: 14px;
    justify-content: space-between;
    padding: 16px 18px;
  }

  .notice-card > div {
    align-items: center;
    display: flex;
    gap: 12px;
  }

  .notice-card p {
    color: #2c1810;
    font-size: 15px;
    font-weight: 800;
    line-height: 1.45;
    margin: 0;
  }

  .text-link {
    background: transparent;
    border: 0;
    color: #c0392b;
    cursor: pointer;
    font-size: 13px;
    font-weight: 900;
    padding: 0;
    text-decoration: none;
    white-space: nowrap;
  }

  .refund-timeline {
    display: grid;
    gap: 10px;
  }

  .refund-bar {
    background: linear-gradient(90deg, #16a05d 0%, #caa10a 52%, #e65c3a 100%);
    border-radius: 999px;
    height: 7px;
  }

  .refund-points {
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(4, 1fr);
  }

  .refund-points strong {
    color: #2c1810;
    display: block;
    font-size: 13px;
  }

  .refund-points span {
    color: #76675e;
    display: block;
    font-size: 12px;
    margin-top: 3px;
  }

  .info-grid,
  .benefit-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .info-item,
  .benefit-item {
    align-items: flex-start;
    display: flex;
    gap: 10px;
  }

  .info-item svg,
  .benefit-item svg {
    color: #168554;
    flex-shrink: 0;
    font-size: 20px;
    margin-top: 1px;
  }

  .info-item p,
  .benefit-item p {
    color: #5e5149;
    font-size: 13px;
    line-height: 1.55;
    margin: 0;
  }

  .summary-card {
    overflow: hidden;
    padding: 0;
  }

  .summary-header {
    background: #2c1810;
    color: #ffffff;
    padding: 20px 22px;
  }

  .summary-header h2,
  .summary-header p {
    color: #ffffff;
  }

  .summary-header p {
    font-size: 13px;
    margin: 6px 0 0;
    opacity: 0.84;
  }

  .summary-body {
    padding: 20px 22px 22px;
  }

  .summary-row {
    border-bottom: 1px solid #f0ebe5;
    padding: 13px 0;
  }

  .summary-row:first-child {
    padding-top: 0;
  }

  .summary-row span,
  .summary-row strong,
  .fare-total span,
  .fare-total strong {
    color: #2c1810;
    font-size: 14px;
  }

  .summary-row span {
    color: #76675e;
  }

  .fare-total {
    padding-top: 16px;
  }

  .fare-total span {
    font-size: 16px;
    font-weight: 900;
  }

  .fare-total strong {
    color: #c0392b;
    font-size: 24px;
  }

  .primary-action,
  .secondary-action {
    align-items: center;
    border: 0;
    border-radius: 999px;
    cursor: pointer;
    display: inline-flex;
    font-size: 15px;
    font-weight: 900;
    gap: 8px;
    justify-content: center;
    min-height: 48px;
    padding: 0 20px;
    text-decoration: none;
    transition: box-shadow 0.2s ease, transform 0.2s ease;
    width: 100%;
  }

  .primary-action {
    background: linear-gradient(135deg, #ff7544, #c0392b);
    color: #ffffff;
    margin-top: 18px;
  }

  .primary-action:hover,
  .payment-action button:hover {
    box-shadow: 0 10px 22px rgba(192, 57, 43, 0.28);
    transform: translateY(-1px);
  }

  .secondary-action {
    background: #fff3ec;
    color: #c0392b;
    margin-top: 12px;
  }

  .promo-card {
    overflow: hidden;
  }

  .promo-banner {
    align-items: center;
    background: linear-gradient(135deg, #c79617, #f2d37c);
    color: #ffffff;
    display: flex;
    gap: 12px;
    padding: 18px 20px;
  }

  .promo-banner h3 {
    color: #ffffff;
    font-size: 20px;
    margin: 0;
  }

  .promo-body {
    padding: 18px 20px 20px;
  }

  .promo-input {
    border: 1px solid #d8c9bb;
    border-radius: 8px;
    color: #2c1810;
    font: inherit;
    height: 46px;
    outline: none;
    padding: 0 14px;
    width: 100%;
  }

  .promo-input:focus,
  .field input:focus,
  .field select:focus {
    border-color: #ff7544;
    box-shadow: 0 0 0 3px rgba(255, 117, 68, 0.14);
  }

  .coupon {
    background: #fffaf5;
    border: 1px solid #f1e4d9;
    border-radius: 8px;
    margin-top: 12px;
    padding: 12px;
  }

  .coupon strong {
    color: #2c1810;
    display: block;
    font-size: 13px;
    margin-bottom: 4px;
  }

  .coupon p {
    color: #76675e;
    font-size: 13px;
    line-height: 1.45;
    margin: 0;
  }

  .empty-state {
    margin: 0 auto;
    max-width: 680px;
    text-align: center;
  }

  .empty-state h2 {
    color: #2c1810;
    font-size: 28px;
    margin: 0 0 10px;
  }

  .empty-state p {
    color: #76675e;
    font-size: 15px;
    line-height: 1.6;
    margin: 0 auto 20px;
    max-width: 520px;
  }

  .field-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .field input,
  .field select {
    background: #ffffff;
    border: 1px solid #d8c9bb;
    border-radius: 8px;
    color: #2c1810;
    font: inherit;
    height: 44px;
    outline: none;
    padding: 0 12px;
    width: 100%;
  }

  .radio-grid {
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .radio-option {
    align-items: flex-start;
    cursor: pointer;
    display: flex;
    gap: 10px;
  }

  .radio-option input,
  .checkbox-line input {
    accent-color: #c0392b;
    margin-top: 3px;
  }

  .checkbox-line {
    align-items: flex-start;
    color: #5e5149;
    display: flex;
    font-size: 13px;
    gap: 10px;
    line-height: 1.55;
  }

  .payment-action {
    margin-top: 18px;
  }

  .payment-action > div,
  .payment-action button {
    width: 100%;
  }

  @media (max-width: 1080px) {
    .booking-hero-inner {
      flex-direction: column;
    }

    .booking-steps {
      justify-content: flex-start;
      max-width: none;
    }

    .booking-grid,
    .flight-strip {
      grid-template-columns: 1fr;
    }

    .side-column {
      position: static;
    }
  }

  @media (max-width: 760px) {
    .booking-hero {
      padding: 28px 18px 88px;
    }

    .page-container {
      padding: 0 14px 42px;
    }

    .route-flow,
    .detail-grid,
    .info-grid,
    .benefit-grid,
    .field-grid,
    .radio-grid,
    .refund-points {
      grid-template-columns: 1fr;
    }

    .section-title-row,
    .notice-card {
      align-items: flex-start;
      flex-direction: column;
    }

    .time-block.arrival {
      text-align: left;
    }
  }
`;

const steps = ["Flight Summary", "Traveller Details", "Seats & Meals", "Add-ons"];

export const BookingHero = ({ activeStep = 0, subtitle, title }) => (
  <section className="booking-hero">
    <div className="booking-hero-inner">
      <div>
        <p className="eyebrow">Secure booking</p>
        <h1>{title}</h1>
        <p className="hero-subtitle">{subtitle}</p>
      </div>
      <div className="booking-steps">
        {steps.map((step, index) => (
          <span
            className={index <= activeStep ? "booking-step active" : "booking-step"}
            key={step}
          >
            {index < activeStep && <CheckCircleIcon />}
            {step}
          </span>
        ))}
      </div>
    </div>
  </section>
);

export const FareSummary = ({ action, flight }) => {
  const currency = getCurrency(flight);
  const fare = getFareBreakup(flight);

  return (
    <aside className="side-column">
      <section className="card summary-card">
        <div className="summary-header">
          <h2>Fare Summary</h2>
          <p>Price includes taxes and live fare data.</p>
        </div>
        <div className="summary-body">
          <div className="summary-row">
            <span>Base Fare</span>
            <strong>{formatAmount(fare.base, currency)}</strong>
          </div>
          <div className="summary-row">
            <span>Fee & Surcharges</span>
            <strong>{formatAmount(fare.fees, currency)}</strong>
          </div>
          <div className="summary-row">
            <span>Other Services</span>
            <strong>{formatAmount(fare.services, currency)}</strong>
          </div>
          <div className="summary-row">
            <span>Discounts</span>
            <strong>- {formatAmount(fare.discount, currency)}</strong>
          </div>
          <div className="fare-total">
            <span>Total Amount</span>
            <strong>{formatAmount(fare.total, currency)}</strong>
          </div>
          {action}
        </div>
      </section>
      <PromoCard />
    </aside>
  );
};

export const PromoCard = () => (
  <section className="promo-card">
    <div className="promo-banner">
      <LocalOfferIcon />
      <h3>Promo Codes</h3>
    </div>
    <div className="promo-body">
      <input className="promo-input" placeholder="Enter promo code" type="text" />
      <div className="coupon">
        <strong>TSFAMILY</strong>
        <p>Use and save INR 480 on selected domestic fares.</p>
      </div>
      <div className="coupon">
        <strong>TIRTHSAVE</strong>
        <p>Extra savings for pilgrimage travel bookings.</p>
      </div>
    </div>
  </section>
);

export const EmptyBookingState = () => (
  <section className="card empty-state">
    <h2>No flight selected yet</h2>
    <p>
      Choose a flight from the live search results and the booking details will
      appear here.
    </p>
    <Link className="primary-action" to="/search">
      Search flights <ArrowForwardIcon />
    </Link>
  </section>
);
