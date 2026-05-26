const crypto = require("crypto");
const request = require("supertest");

const mockCreateRazorpayOrder = jest.fn();
const mockVerifyRazorpaySignature = jest.fn();
const mockVerifyRazorpayWebhookSignature = jest.fn();
const mockPaymentCreate = jest.fn();
const mockPaymentFindOne = jest.fn();
const mockPaymentFindOneAndUpdate = jest.fn();
const mockConfirmBooking = jest.fn();
const mockFailBookingPayment = jest.fn();
const mockCreatePendingBooking = jest.fn();
const mockCreateLegacyBookingPayload = jest.fn();
const mockEmitBookingStatusUpdated = jest.fn();
const mockEmitPaymentSuccess = jest.fn();
const mockEmitPaymentFailed = jest.fn();
const mockSendPaymentSuccessEmail = jest.fn();
const mockSendPaymentFailedEmail = jest.fn();
const mockWebhookFindOne = jest.fn();
const mockWebhookCreate = jest.fn();

const booking = {
  _id: "507f1f77bcf86cd799439011",
  user: "traveller@example.com",
  bookingType: "legacy",
  bookingStatus: "pending",
  paymentStatus: "pending",
  amount: {
    finalAmount: 5305,
    currency: "INR",
  },
  save: jest.fn(async function save() {
    return this;
  }),
};

jest.mock("../services/razorpay.service", () => ({
  createRazorpayOrder: mockCreateRazorpayOrder,
  verifyRazorpaySignature: mockVerifyRazorpaySignature,
  verifyRazorpayWebhookSignature: mockVerifyRazorpayWebhookSignature,
}));

jest.mock("../services/booking.service", () => ({
  getIdempotencyKey: (req) => req.get("Idempotency-Key") || req.body?.idempotencyKey,
  createPendingBooking: mockCreatePendingBooking,
  createLegacyBookingPayload: mockCreateLegacyBookingPayload,
  confirmBooking: mockConfirmBooking,
  failBookingPayment: mockFailBookingPayment,
}));

jest.mock("../socket", () => ({
  emitBookingStatusUpdated: mockEmitBookingStatusUpdated,
  emitPaymentSuccess: mockEmitPaymentSuccess,
  emitPaymentFailed: mockEmitPaymentFailed,
}));

jest.mock("../services/bookingNotification.service", () => ({
  sendPaymentSuccessEmail: mockSendPaymentSuccessEmail,
  sendPaymentFailedEmail: mockSendPaymentFailedEmail,
}));

jest.mock("../models/payment.model", () => ({
  create: mockPaymentCreate,
  findOne: mockPaymentFindOne,
  findOneAndUpdate: mockPaymentFindOneAndUpdate,
}));

jest.mock("../models/webhookEvent.model", () => ({
  findOne: mockWebhookFindOne,
  create: mockWebhookCreate,
}));

const { createServer } = require("../server");

describe("payment routes", () => {
  const app = createServer();

  beforeEach(() => {
    booking.razorpayOrderId = undefined;
    booking.save.mockClear();
    mockCreateLegacyBookingPayload.mockReturnValue({ bookingType: "legacy" });
    mockCreatePendingBooking.mockResolvedValue(booking);
    mockPaymentFindOne.mockReturnValue({ exec: () => Promise.resolve(null) });
    mockPaymentCreate.mockResolvedValue({
      _id: "payment-id",
      razorpayDetails: { orderId: "order_123" },
      amount: 530500,
      currency: "INR",
    });
    mockCreateRazorpayOrder.mockResolvedValue({
      id: "order_123",
      currency: "INR",
      amount: 530500,
    });
    mockSendPaymentSuccessEmail.mockResolvedValue({});
    mockSendPaymentFailedEmail.mockResolvedValue({});
  });

  test("POST /razorpay keeps the existing frontend contract while ignoring frontend price", async () => {
    const response = await request(app)
      .post("/razorpay")
      .send({ price: 1 })
      .expect(200);

    expect(response.body).toMatchObject({
      id: "order_123",
      currency: "INR",
      amount: 530500,
      bookingId: "507f1f77bcf86cd799439011",
    });
    expect(mockCreateRazorpayOrder).toHaveBeenCalledWith(5305, expect.any(Object));
  });

  test("POST /api/v1/payments/create-order creates a Razorpay order", async () => {
    const response = await request(app)
      .post("/api/v1/payments/create-order")
      .send({ idempotencyKey: "idem-payment-1" })
      .expect(200);

    expect(response.body.id).toBe("order_123");
    expect(mockPaymentCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        amount: 530500,
        idempotencyKey: "idem-payment-1",
      })
    );
  });

  test("POST /api/v1/payments/verify validates signatures and confirms booking", async () => {
    mockVerifyRazorpaySignature.mockReturnValue(true);
    mockPaymentFindOneAndUpdate.mockReturnValue({
      exec: () =>
        Promise.resolve({
          booking: booking._id,
          status: "paid",
          success: true,
        }),
    });
    mockConfirmBooking.mockResolvedValue({
      ...booking,
      bookingStatus: "confirmed",
      paymentStatus: "paid",
    });

    const response = await request(app)
      .post("/api/v1/payments/verify")
      .send({
        bookingId: booking._id,
        razorpay_order_id: "order_123",
        razorpay_payment_id: "pay_123",
        razorpay_signature: "signature",
      })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(mockConfirmBooking).toHaveBeenCalledWith({
      bookingId: booking._id,
      razorpayOrderId: "order_123",
      razorpayPaymentId: "pay_123",
    });
    expect(mockEmitBookingStatusUpdated).toHaveBeenCalled();
  });

  test("POST /api/v1/payments/verify rejects invalid signatures", async () => {
    mockVerifyRazorpaySignature.mockReturnValue(false);

    const response = await request(app)
      .post("/api/v1/payments/verify")
      .send({
        bookingId: booking._id,
        razorpay_order_id: "order_123",
        razorpay_payment_id: "pay_123",
        razorpay_signature: "bad-signature",
      })
      .expect(400);

    expect(response.body.message).toBe("Payment signature verification failed.");
  });

  test("POST /api/v1/payments/webhook confirms booking on payment.captured", async () => {
    const payload = {
      id: "evt_123",
      event: "payment.captured",
      payload: {
        payment: {
          entity: {
            id: "pay_123",
            order_id: "order_123",
          },
        },
      },
    };
    const eventDoc = {
      processingStatus: "received",
      save: jest.fn(async function save() {
        return this;
      }),
    };

    mockVerifyRazorpayWebhookSignature.mockReturnValue(true);
    mockWebhookFindOne.mockReturnValue({ exec: () => Promise.resolve(null) });
    mockWebhookCreate.mockResolvedValue(eventDoc);
    mockPaymentFindOneAndUpdate.mockReturnValue({
      exec: () => Promise.resolve({ booking: booking._id }),
    });
    mockConfirmBooking.mockResolvedValue({
      ...booking,
      bookingStatus: "confirmed",
      paymentStatus: "paid",
    });

    const response = await request(app)
      .post("/api/v1/payments/webhook")
      .set("content-type", "application/json")
      .set("x-razorpay-signature", "webhook-signature")
      .send(JSON.stringify(payload))
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(mockConfirmBooking).toHaveBeenCalled();
    expect(eventDoc.processingStatus).toBe("processed");
  });

  test("POST /api/v1/payments/webhook is idempotent for duplicate events", async () => {
    const payload = { id: "evt_123", event: "payment.captured", payload: {} };

    mockVerifyRazorpayWebhookSignature.mockReturnValue(true);
    mockWebhookFindOne.mockReturnValue({
      exec: () => Promise.resolve({ processingStatus: "processed" }),
    });

    const response = await request(app)
      .post("/api/v1/payments/webhook")
      .set("content-type", "application/json")
      .set("x-razorpay-signature", "webhook-signature")
      .send(JSON.stringify(payload))
      .expect(200);

    expect(response.body).toEqual({ success: true, duplicate: true });
    expect(mockPaymentFindOneAndUpdate).not.toHaveBeenCalled();
  });
});

describe("Razorpay signature helpers", () => {
  test("verifies a valid payment signature", () => {
    const { verifyRazorpaySignature } = jest.requireActual(
      "../services/razorpay.service"
    );
    const signature = crypto
      .createHmac("sha256", "rzp_test_secret")
      .update("order_123|pay_123")
      .digest("hex");

    expect(
      verifyRazorpaySignature({
        razorpay_order_id: "order_123",
        razorpay_payment_id: "pay_123",
        razorpay_signature: signature,
      })
    ).toBe(true);
  });
});
