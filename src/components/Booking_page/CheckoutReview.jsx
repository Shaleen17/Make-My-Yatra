import { Link } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import FlightLandIcon from "@mui/icons-material/FlightLand";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import InfoIcon from "@mui/icons-material/Info";
import LuggageIcon from "@mui/icons-material/Luggage";
import PolicyIcon from "@mui/icons-material/Policy";
import WorkIcon from "@mui/icons-material/Work";
import {
  BookingHero,
  BookingPageStyle,
  EmptyBookingState,
  FareSummary,
} from "./BookingPageShell";
import {
  formatAirport,
  formatDate,
  formatDuration,
  formatTime,
  getAirlineLogo,
  getFlightNumber,
  getInitials,
  getSelectedFlight,
  getStopText,
  getTravelClass,
  hasSelectedFlight,
  saveFareAmount,
} from "./bookingPageUtils";

export const CheckoutReview = () => {
  const flight = getSelectedFlight();
  const hasFlight = hasSelectedFlight(flight);

  if (!hasFlight) {
    return (
      <BookingPageStyle>
        <BookingHero
          activeStep={0}
          subtitle="Your selected fare and traveller details will be shown after a flight is selected."
          title="Complete your booking"
        />
        <div className="page-container">
          <EmptyBookingState />
        </div>
      </BookingPageStyle>
    );
  }

  const logo = getAirlineLogo(flight);
  const airlineName = flight?.airline?.name || "Airline";
  const routeTitle = `${flight.departure.iata} to ${flight.arrival.iata}`;
  const departureDate = formatDate(flight.departure.scheduled);
  const duration = formatDuration(flight);
  const stopText = getStopText(flight);

  const handleContinue = () => {
    saveFareAmount(flight);
  };

  return (
    <BookingPageStyle>
      <BookingHero
        activeStep={0}
        subtitle={`${departureDate} | ${stopText} | ${duration}. Review your selected live fare before adding traveller details.`}
        title="Complete your booking"
      />
      <div className="page-container booking-grid">
        <div className="left-column">
          <section className="card">
            <div className="section-title-row">
              <div>
                <p className="eyebrow">Flight Summary</p>
                <h2>{routeTitle}</h2>
                <p>
                  {airlineName} | {getFlightNumber(flight)} | {getTravelClass(flight)}
                </p>
              </div>
              <span className="status-pill">
                <PolicyIcon /> Cancellation fees apply
              </span>
            </div>

            <div className="flight-strip">
              <div className="airline-lockup">
                {logo ? (
                  <img alt={airlineName} src={logo} />
                ) : (
                  <span className="airline-fallback">{getInitials(airlineName)}</span>
                )}
                <div>
                  <p className="airline-name">{airlineName}</p>
                  <p className="muted">{getFlightNumber(flight)}</p>
                </div>
              </div>

              <div className="route-flow">
                <div className="time-block">
                  <FlightTakeoffIcon />
                  <h3>{formatTime(flight.departure.scheduled)}</h3>
                  <strong>{flight.departure.iata}</strong>
                  <p className="muted">
                    {formatAirport(flight.departure.airport, flight.departure.terminal)}
                  </p>
                </div>
                <div className="route-center">
                  <span>{duration}</span>
                  <div className="route-line" />
                  <span>{stopText}</span>
                </div>
                <div className="time-block arrival">
                  <FlightLandIcon />
                  <h3>{formatTime(flight.arrival.scheduled)}</h3>
                  <strong>{flight.arrival.iata}</strong>
                  <p className="muted">
                    {formatAirport(flight.arrival.airport, flight.arrival.terminal)}
                  </p>
                </div>
              </div>
            </div>

            <div className="detail-grid">
              <div className="mini-panel">
                <WorkIcon />
                <h3>Check-in baggage</h3>
                <p>15 Kgs per adult</p>
              </div>
              <div className="mini-panel">
                <LuggageIcon />
                <h3>Cabin baggage</h3>
                <p>7 Kgs per adult</p>
              </div>
              <div className="mini-panel">
                <EventSeatIcon />
                <h3>Seats and meals</h3>
                <p>Choose in the next step</p>
              </div>
              <div className="mini-panel">
                <CreditCardIcon />
                <h3>Fare type</h3>
                <p>{flight?.resultGroup === "best" ? "Recommended fare" : "Saver fare"}</p>
              </div>
            </div>
          </section>

          <section className="notice-card">
            <div>
              <LuggageIcon />
              <p>Need extra baggage? Add check-in baggage allowance during traveller details.</p>
            </div>
            <Link className="text-link" to="/final" onClick={handleContinue}>
              Add later
            </Link>
          </section>

          <section className="card">
            <div className="section-title-row">
              <div>
                <p className="eyebrow">Refund Policy</p>
                <h2>Cancellation Refund Policy</h2>
                <p>
                  Penalties are estimated from airline fare rules and may change
                  at final payment.
                </p>
              </div>
              <button className="text-link" type="button">
                View Policy
              </button>
            </div>
            <div className="refund-timeline">
              <div className="refund-bar" />
              <div className="refund-points">
                <div>
                  <strong>INR 3,300</strong>
                  <span>Now</span>
                </div>
                <div>
                  <strong>INR 3,800</strong>
                  <span>Before departure</span>
                </div>
                <div>
                  <strong>INR 4,000</strong>
                  <span>Close to departure</span>
                </div>
                <div>
                  <strong>Non-refundable</strong>
                  <span>After departure</span>
                </div>
              </div>
            </div>
          </section>

          <section className="card">
            <div className="section-title-row">
              <div>
                <p className="eyebrow">Important Information</p>
                <h2>Before You Fly</h2>
              </div>
            </div>
            <div className="info-grid">
              <div className="info-item">
                <CheckCircleIcon />
                <p>Carry a valid government ID matching the traveller name.</p>
              </div>
              <div className="info-item">
                <CheckCircleIcon />
                <p>Reach the airport at least 2 hours before departure.</p>
              </div>
              <div className="info-item">
                <CheckCircleIcon />
                <p>Web check-in and baggage rules depend on the operating airline.</p>
              </div>
              <div className="info-item">
                <InfoIcon />
                <p>Fare rules and seat availability are confirmed again before payment.</p>
              </div>
            </div>
          </section>
        </div>

        <FareSummary
          action={
            <>
              <Link className="primary-action" onClick={handleContinue} to="/final">
                Continue <ArrowForwardIcon />
              </Link>
              <Link className="secondary-action" to="/search">
                Change flight
              </Link>
            </>
          }
          flight={flight}
        />
      </div>
    </BookingPageStyle>
  );
};
