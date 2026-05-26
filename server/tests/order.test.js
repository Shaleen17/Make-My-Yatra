const request = require("supertest");

const mockCreate = jest.fn();
const mockFindOneAndUpdate = jest.fn();

jest.mock("../models/order.model", () => ({
  create: mockCreate,
  findOneAndUpdate: mockFindOneAndUpdate,
}));

const { createServer } = require("../server");

describe("order routes", () => {
  const app = createServer();

  test("POST /api/v1/order creates an order", async () => {
    const order = {
      _id: "order-id",
      user: "traveller@example.com",
      flight_date: "2026-05-14",
    };
    mockCreate.mockResolvedValue(order);

    const response = await request(app)
      .post("/api/v1/order")
      .send({
        user: "traveller@example.com",
        flight_date: "2026-05-14",
      })
      .expect(201);

    expect(response.body).toEqual(order);
    expect(mockCreate).toHaveBeenCalledWith({
      user: "traveller@example.com",
      flight_date: "2026-05-14",
    });
  });
});
