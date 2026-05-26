const request = require("supertest");

const mockCreatePendingBooking = jest.fn();
const mockCancelBooking = jest.fn();
const mockSendBookingPendingEmail = jest.fn();
const mockSendCancellationEmail = jest.fn();
const mockEmitBookingStatusUpdated = jest.fn();
const mockEmitBookingCreated = jest.fn();

jest.mock("../services/booking.service", () => ({
  getIdempotencyKey: (req) => req.get("Idempotency-Key") || req.body?.idempotencyKey,
  createPendingBooking: mockCreatePendingBooking,
  cancelBooking: mockCancelBooking,
}));

jest.mock("../services/bookingNotification.service", () => ({
  sendBookingPendingEmail: mockSendBookingPendingEmail,
  sendCancellationEmail: mockSendCancellationEmail,
}));

jest.mock("../socket", () => ({
  emitBookingStatusUpdated: mockEmitBookingStatusUpdated,
  emitBookingCreated: mockEmitBookingCreated,
}));

const { createServer } = require("../server");

describe("booking lifecycle routes", () => {
  const app = createServer();

  beforeEach(() => {
    mockSendBookingPendingEmail.mockResolvedValue({});
    mockSendCancellationEmail.mockResolvedValue({});
  });

  test("POST /api/v1/bookings/create creates a pending booking", async () => {
    const booking = {
      _id: "507f1f77bcf86cd799439011",
      user: "traveller@example.com",
      bookingStatus: "pending",
      paymentStatus: "pending",
      amount: { finalAmount: 5305, currency: "INR" },
    };
    mockCreatePendingBooking.mockResolvedValue(booking);

    const response = await request(app)
      .post("/api/v1/bookings/create")
      .set("Idempotency-Key", "booking-idem-1")
      .send({
        user: "traveller@example.com",
        bookingType: "flight",
        flight: {
          arrival: { iata: "BOM" },
          departure: { delay: 0 },
        },
      })
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.booking).toEqual(booking);
    expect(mockCreatePendingBooking).toHaveBeenCalledWith(
      expect.objectContaining({
        idempotencyKey: "booking-idem-1",
      })
    );
  });
});
