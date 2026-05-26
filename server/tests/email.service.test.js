const axios = require("axios");

jest.mock("axios", () => ({
  post: jest.fn(),
}));

const { sendEmail, getEmailHealth } = require("../services/email.service");

describe("Brevo email service", () => {
  test("sends email through Brevo API", async () => {
    axios.post.mockResolvedValue({ data: { messageId: "brevo-message-id" } });

    const response = await sendEmail({
      to: "traveller@example.com",
      subject: "Test",
      text: "Plain text",
      html: "<p>HTML</p>",
    });

    expect(response).toEqual({
      provider: "brevo",
      messageId: "brevo-message-id",
    });
    expect(axios.post).toHaveBeenCalledWith(
      "https://api.brevo.com/v3/smtp/email",
      expect.objectContaining({
        to: [{ email: "traveller@example.com" }],
        subject: "Test",
      }),
      expect.objectContaining({
        headers: expect.objectContaining({
          "api-key": "test-brevo-key",
        }),
      })
    );
  });

  test("reports email health without exposing secrets", () => {
    const health = getEmailHealth();

    expect(health).toMatchObject({
      provider: "brevo",
      configured: true,
      brevoConfigured: true,
    });
    expect(JSON.stringify(health)).not.toContain("test-brevo-key");
  });
});
