const { defineConfig } = require("cypress");

// const baseUrl =
//   process.env.APP_URL || "https://magento.softwaretestingboard.com";

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://magento.softwaretestingboard.com",
    viewportWidth: 1280,
    viewportHeight: 720,
    fixturesFolder: "cypress/fixtures",
    screenshotsFolder: "cypress/screenshots",
    // videosFolder: 'cypress/videos',
    specPattern: "cypress/e2e/**/*.spec.js",
    retries: {
      runMode: 0,
      openMode: 0,
    },
    defaultCommandTimeout: 5000,
    pageLoadTimeout: 60000,
    largeTimeout: 100000,

    env: {
      headless: false,
    },
    reporter: "mochawesome",
    reporterOptions: {
      reportDir: "cypress/results/",
      overwrite: false,
      html: false,
      json: true,
    },
  },
});
