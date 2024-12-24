const fs = require("fs");
const path = require("path");

module.exports.config = {
    name: "help",
    description: "Displays all available commands and events",
    permission: 0,
    prefix: true,
    cooldown: 5,
}

module.exports.run = async ({ api, event, permissions }) => {
    const commandsAndEvents = {
        commands: [],
        events: []
    };

    const loadFolderContent = (folderPath, type) => {
        fs.readdirSync(folderPath).forEach((file) => {
            if (file.endsWith(".js")) {
                try {
                    const module = require(path.join(folderPath, file));
                    if (module.config) {
                        if (type === 'command') {
                            commandsAndEvents.commands.push(module.config);
                        } else if (type === 'event') {
                            commandsAndEvents.events.push(module.config);
                        }
                    }
                } catch (error) {
                    console.error(`Error loading file ${file}:`, error);
                }
            }
        });
    };

    const commandPath = path.join(__dirname, "../../module/commands");
    loadFolderContent(commandPath, 'command');

    const eventPath = path.join(__dirname, "../../module/events");
    loadFolderContent(eventPath, 'event');

    const totalCommands = commandsAndEvents.commands.length;
    const totalEvents = commandsAndEvents.events.length;

    let message = `💥 **Total Commands:** ${totalCommands} \n🎉 **Total Events:** ${totalEvents}\n\n`;
    message += "✨ **Here are all available commands and events:** ✨\n\n";


    commandsAndEvents.commands.forEach(module => {
        if (module.permission === 0 || permissions >= module.permission) {
            message += `🔧 **${module.name} (Command):**\n`;
            message += `  🔑 **Permission:** ${module.permission === 0 ? "All Users" : (module.permission === 3 ? "Admins Only" : "Others")}\n`;
            message += `  ⏱️ **Prefix:** ${module.prefix === false ? "No" : "Yes"}\n`; // Condition changed to show "No" when prefix is false
            message += `\n`;
        }
    });

    commandsAndEvents.events.forEach(module => {
        if (module.permission === 0 || permissions >= module.permission) {
            message += `🎉 **${module.name} (Event):**\n`;
            message += `  🔑 **Permission:** ${module.permission === 0 ? "All Users" : (module.permission === 3 ? "Admins Only" : "Others")}\n`;
            message += `  ⏱️ **Prefix:** ${module.prefix === false ? "No" : "Yes"}\n`; // Condition changed to show "No" when prefix is false
            message += `\n\n`;
        }
    });
    message += `🌟 𝗛𝗲𝘆 𝗧𝗵𝗲𝗿𝗲! 𝗙𝗲𝗲𝗹 𝗙𝗿𝗲𝗲 𝗧𝗼 𝗥𝗲𝗮𝗰𝗵 𝗢𝘂𝘁 𝗜𝗳 𝗬𝗼𝘂 𝗛𝗮𝘃𝗲 𝗔𝗻𝘆 𝗣𝗿𝗼𝗯𝗹𝗲𝗺𝘀! 🌟\n📩 **Contact me on Facebook:** https://www.facebook.com/LostFragmentX`;

    api.sendMessage(message, event.threadID); // Send the list of commands and events to the user
}
