const environmentSettings = {
  development: {
    logFormat: "dev",
    logRequests: true,
    cookieSecure: false,
    cookieSameSite: "lax",
  },
  test: {
    logFormat: "tiny",
    logRequests: false,
    cookieSecure: false,
    cookieSameSite: "lax",
  },
  staging: {
    logFormat: "combined",
    logRequests: true,
    cookieSecure: true,
    cookieSameSite: "none",
  },
  production: {
    logFormat: "combined",
    logRequests: true,
    cookieSecure: true,
    cookieSameSite: "none",
  },
};

const getEnvironmentSettings = (environment) =>
  environmentSettings[environment] || environmentSettings.development;

module.exports = {
  getEnvironmentSettings,
};
