// jobs/cleanupExpiredMessages.js
const cron = require("node-cron");
const SecretMessage = require("../models/SecretMessage");

// Schedule a cron job to run every hour
const setupCleanupJob = () => {
  cron.schedule("0 * * * *", async () => {
    try {
      console.log("Running cleanup job for expired messages...");
      const result = await SecretMessage.deleteExpired();
      console.log(`Deleted ${result.deletedCount} expired messages`);
    } catch (err) {
      console.error("Error in cleanup job:", err);
    }
  });

  console.log("Cleanup job for expired messages scheduled");
};

module.exports = setupCleanupJob;
