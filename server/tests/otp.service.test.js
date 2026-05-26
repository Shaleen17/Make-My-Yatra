const crypto = require("crypto");
const AppError = require("../utils/AppError");

let mockRecords = [];
let mockId = 0;

const mockSendOtpEmail = jest.fn();

const matchesFilter = (record, filter) => {
  if (filter.requestId && record.requestId !== filter.requestId) {
    return false;
  }

  if (filter.email && record.email !== filter.email) {
    return false;
  }

  if (filter.purpose && record.purpose !== filter.purpose) {
    return false;
  }

  if (filter.consumedAt === null && record.consumedAt !== null) {
    return false;
  }

  if (filter.expiresAt?.$gt && !(record.expiresAt > filter.expiresAt.$gt)) {
    return false;
  }

  return true;
};

const createRecord = (data) => {
  const record = {
    ...data,
    _id: `record-${++mockId}`,
    requestId: data.requestId || `request-${mockId}`,
    attempts: data.attempts || 0,
    resendCount: data.resendCount || 0,
    consumedAt: data.consumedAt || null,
    lockedUntil: data.lockedUntil || null,
    createdAt: new Date(),
    save: jest.fn(async function save() {
      return this;
    }),
  };
  mockRecords.push(record);
  return record;
};

jest.mock("../models/otp.model", () => ({
  create: jest.fn(async (data) => createRecord(data)),
  findOne: jest.fn((filter) => {
    const query = {
      sort: () => query,
      select: () => query,
      exec: async () => mockRecords.find((record) => matchesFilter(record, filter)) || null,
    };
    return query;
  }),
  updateMany: jest.fn(async (filter, update) => {
    mockRecords.forEach((record) => {
      if (filter._id?.$ne && record._id === filter._id.$ne) {
        return;
      }

      if (filter.email && record.email !== filter.email) {
        return;
      }

      if (filter.purpose && record.purpose !== filter.purpose) {
        return;
      }

      if (filter.consumedAt === null && record.consumedAt !== null) {
        return;
      }

      Object.assign(record, update.$set || {});
    });
    return { modifiedCount: 1 };
  }),
}));

jest.mock("../services/email.service", () => ({
  sendOtpEmail: mockSendOtpEmail,
}));

const {
  generateOtp,
  issueOtpChallenge,
  verifyOtpChallenge,
} = require("../services/otp.service");

describe("OTP service", () => {
  beforeEach(() => {
    mockRecords = [];
    mockId = 0;
    mockSendOtpEmail.mockResolvedValue({ provider: "brevo" });
    jest.restoreAllMocks();
  });

  test("generates a six-digit OTP", () => {
    const otp = generateOtp();

    expect(otp).toMatch(/^\d{6}$/);
  });

  test("verifies a valid OTP and marks it consumed", async () => {
    jest.spyOn(crypto, "randomInt").mockReturnValue(123456);

    const challenge = await issueOtpChallenge({
      email: "traveller@example.com",
      purpose: "login",
    });

    await expect(
      verifyOtpChallenge({
        email: "traveller@example.com",
        purpose: "login",
        requestId: challenge.requestId,
        otp: "123456",
      })
    ).resolves.toMatchObject({ email: "traveller@example.com" });

    expect(mockRecords[0].consumedAt).toBeInstanceOf(Date);
  });

  test("rejects expired OTPs", async () => {
    jest.spyOn(crypto, "randomInt").mockReturnValue(123456);

    const challenge = await issueOtpChallenge({
      email: "traveller@example.com",
      purpose: "login",
    });
    mockRecords[0].expiresAt = new Date(Date.now() - 1000);

    await expect(
      verifyOtpChallenge({
        email: "traveller@example.com",
        purpose: "login",
        requestId: challenge.requestId,
        otp: "123456",
      })
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  test("rejects wrong OTPs and tracks attempts", async () => {
    jest.spyOn(crypto, "randomInt").mockReturnValue(123456);

    const challenge = await issueOtpChallenge({
      email: "traveller@example.com",
      purpose: "login",
    });

    await expect(
      verifyOtpChallenge({
        email: "traveller@example.com",
        purpose: "login",
        requestId: challenge.requestId,
        otp: "111111",
      })
    ).rejects.toMatchObject({ statusCode: 401 });

    expect(mockRecords[0].attempts).toBe(1);
  });

  test("enforces resend cooldown", async () => {
    jest.spyOn(crypto, "randomInt").mockReturnValue(123456);

    const challenge = await issueOtpChallenge({
      email: "traveller@example.com",
      purpose: "login",
    });

    await expect(
      issueOtpChallenge({
        email: "traveller@example.com",
        purpose: "login",
        requestId: challenge.requestId,
        requireExisting: true,
      })
    ).rejects.toMatchObject({ statusCode: 429 });
  });

  test("locks verification after max failed attempts", async () => {
    jest.spyOn(crypto, "randomInt").mockReturnValue(123456);

    const challenge = await issueOtpChallenge({
      email: "traveller@example.com",
      purpose: "login",
    });

    await expect(
      verifyOtpChallenge({
        email: "traveller@example.com",
        purpose: "login",
        requestId: challenge.requestId,
        otp: "111111",
      })
    ).rejects.toBeInstanceOf(AppError);
    await expect(
      verifyOtpChallenge({
        email: "traveller@example.com",
        purpose: "login",
        requestId: challenge.requestId,
        otp: "222222",
      })
    ).rejects.toBeInstanceOf(AppError);
    await expect(
      verifyOtpChallenge({
        email: "traveller@example.com",
        purpose: "login",
        requestId: challenge.requestId,
        otp: "333333",
      })
    ).rejects.toMatchObject({ statusCode: 423 });

    expect(mockRecords[0].lockedUntil).toBeInstanceOf(Date);
  });
});
