const request = require("supertest");

const mockIssueOtpChallenge = jest.fn();
const mockVerifyOtpChallenge = jest.fn();

jest.mock("../services/otp.service", () => ({
  normalizeEmail: (email) => String(email || "").trim().toLowerCase(),
  issueOtpChallenge: mockIssueOtpChallenge,
  verifyOtpChallenge: mockVerifyOtpChallenge,
}));

const { createServer } = require("../server");

describe("auth and OTP routes", () => {
  const app = createServer();

  beforeEach(() => {
    mockIssueOtpChallenge.mockResolvedValue({
      requestId: "otp-request-123",
      expiresInSeconds: 600,
      resendAvailableInSeconds: 60,
    });
    mockVerifyOtpChallenge.mockResolvedValue({
      email: "traveller@example.com",
      purpose: "login",
      requestId: "otp-request-123",
    });
  });

  test("POST /sendOTP keeps the legacy auth contract without returning OTP", async () => {
    const response = await request(app)
      .post("/sendOTP")
      .send({ phone: "traveller@example.com" })
      .expect(200);

    expect(response.body).toMatchObject({
      msg: "OTP sent successfully.",
      hash: "otp-request-123",
      requestId: "otp-request-123",
    });
    expect(response.body.otp).toBeUndefined();
    expect(mockIssueOtpChallenge).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "traveller@example.com",
        purpose: "login",
      })
    );
  });

  test("POST /api/v1/auth/verify-otp sets compatible auth cookies", async () => {
    const response = await request(app)
      .post("/api/v1/auth/verify-otp")
      .send({
        email: "traveller@example.com",
        requestId: "otp-request-123",
        otp: "123456",
      })
      .expect(200);

    expect(response.body.msg).toBe("Login Success");
    expect(response.headers["set-cookie"].join(";")).toContain("authSession");
    expect(response.headers["set-cookie"].join(";")).toContain("refreshTokenID");
    expect(mockVerifyOtpChallenge).toHaveBeenCalledWith({
      email: "traveller@example.com",
      purpose: "login",
      otp: "123456",
      requestId: "otp-request-123",
    });
  });
});
