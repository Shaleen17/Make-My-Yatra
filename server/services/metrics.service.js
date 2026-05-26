const client = require("prom-client");

client.collectDefaultMetrics({
  prefix: "make_my_yatra_",
});

const httpRequestDuration = new client.Histogram({
  name: "make_my_yatra_http_request_duration_seconds",
  help: "HTTP request duration in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.05, 0.1, 0.25, 0.5, 1, 2, 5],
});

const bookingEvents = new client.Counter({
  name: "make_my_yatra_booking_events_total",
  help: "Booking lifecycle events",
  labelNames: ["event"],
});

const paymentEvents = new client.Counter({
  name: "make_my_yatra_payment_events_total",
  help: "Payment lifecycle events",
  labelNames: ["event"],
});

const getMetrics = () => client.register.metrics();

module.exports = {
  client,
  httpRequestDuration,
  bookingEvents,
  paymentEvents,
  getMetrics,
};
