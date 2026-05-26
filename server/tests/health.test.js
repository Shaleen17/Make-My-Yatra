const request = require("supertest");
const { createServer } = require("../server");

describe("health routes", () => {
  const app = createServer();

  test("GET /health returns service health", async () => {
    const response = await request(app).get("/health").expect(200);

    expect(response.body.status).toBe("ok");
    expect(response.body.service).toBe("make-my-yatra-api");
  });

  test("GET /api/v1/health returns versioned service health", async () => {
    const response = await request(app).get("/api/v1/health").expect(200);

    expect(response.body.status).toBe("ok");
  });
});
