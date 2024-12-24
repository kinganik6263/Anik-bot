const { spawn } = require("child_process");

module.exports.config = {
    name: "restart",
    version: "1.0.0",
    permission: 2, 
    description: "বট পুনরায় চালু করার কমান্ড",
    category: "system",
    cooldowns: 5,
};

module.exports.run = function ({ api, event }) {
    api.sendMessage("বট রিস্টার্ট হচ্ছে...", event.threadID, () => {
        spawn("node", ["index.js"], {
            stdio: "inherit",
            detached: true,
        }).unref();

        process.exit(0);
    });
};
