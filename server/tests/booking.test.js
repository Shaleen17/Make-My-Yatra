const request = require("supertest");

const mockCreate = jest.fn();
const mockFindOneAndUpdate = jest.fn();

jest.mock("../models/checkout.model", () => ({
  create: mockCreate,
  findOneAndUpdate: mockFindOneAndUpdate,
}));

const { createServer } = require("../server");

describe("booking checkout routes", () => {
  const app = createServer();

  test("POST /api/v1/checkout creates a checkout", async () => {
    const checkout = {
      _id: "checkout-id",
      user: "traveller@example.com",
      status: "pending",
    };
    mockCreate.mockResolvedValue(checkout);

    const response = await request(app)
      .post("/api/v1/checkout")
      .send({
        user: "traveller@example.com",
        price: { base_fare: 1000, surcharges: 100 },
      })
      .expect(201);

    expect(response.body).toEqual(checkout);
    expect(mockCreate).toHaveBeenCalledWith({
      user: "traveller@example.com",
      price: { base_fare: 1000, surcharges: 100 },
    });
  });

  test("POST /checkout rejects invalid booking payloads", async () => {
    const response = await request(app).post("/checkout").send({}).expect(400);

    expect(response.body.message).toBe("Validation failed.");
  });
});
