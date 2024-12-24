const os = require('os');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

module.exports.config = {
  name: "os",
  prefix: true,
  version: "1.0.0",
  permission: 0,
  credits: "Anik",
  description: "Displays server and machine information in a stylish format",
  category: "System",
  usages: "serverinfo",
  cooldowns: 5,
  dependencies: []
};

module.exports.run = async ({ api, event }) => {
  const uptime = process.uptime();
  const serverUptime = os.uptime();
  const freeMem = (os.freemem() / (1024 ** 3)).toFixed(2);
  const totalMem = (os.totalmem() / (1024 ** 3)).toFixed(2);
  const usedMem = (totalMem - freeMem).toFixed(2);
  const platform = os.platform();
  const release = os.release();
  const arch = os.arch();

  const projectUptime = new Date(uptime * 1000).toISOString().substr(11, 8);
  const serverUptimeFormatted = new Date(serverUptime * 1000).toISOString().substr(11, 8);

  const getTotalUsers = async () => {
    try {
      const threadInfo = await api.getThreadInfo(event.threadID);
      return threadInfo.participants ? threadInfo.participants.length : 0;
    } catch (error) {
      console.error("Error fetching thread info:", error);
      return 0;
    }
  };

  const getTotalCommands = () => {
    const commandFolderPath = path.join(__dirname, '..', 'commands');
    const files = fs.readdirSync(commandFolderPath);
    return files.filter(file => file.endsWith('.js')).length;
  };

  const getPing = () => {
    return new Promise((resolve, reject) => {
      const start = Date.now();
      exec('ping -c 1 google.com', (err, stdout, stderr) => {
        if (err || stderr) {
          reject('Ping error');
        } else {
          const pingTime = Date.now() - start;
          resolve(`${pingTime} ms`);
        }
      });
    });
  };

  const totalUsers = await getTotalUsers();
  const totalThreads = 95;
  const totalCommands = getTotalCommands();
  const ping = await getPing().catch(() => '0.00 ms');  // Handling the case when ping fails

  const message = {
      body: `
╭━━〔 🌐 𝗦𝗘𝗥𝗩𝗘𝗥 𝗜𝗡𝗙𝗢 〕━━╮
┣ 🕒 𝗣𝗿𝗼𝗷𝗲𝗰𝘁 𝗨𝗽𝘁𝗶𝗺𝗲:  
┃   ⌛ ${projectUptime}
┣ 🖥️ 𝗦𝗲𝗿𝗩𝗲𝗿 𝗨𝗽𝘁𝗶𝗺𝗲:  
┃   ⌛ ${serverUptimeFormatted}
┣ 📡 𝗣𝗶𝗻𝗴: ${ping}
╰━━━━━━━━━━━━━━━━━━━╯

╭━━━〔 💻 𝗢𝗦 𝗜𝗡𝗙𝗢 〕━━━━╮
┣ 🏗️ 𝗔𝗿𝗰𝗵𝗶𝘁𝗲𝗰𝘁𝘂𝗿𝗲: ${arch}
┣ 🖥️ 𝗣𝗹𝗮𝘁𝗳𝗼𝗿𝗺: ${platform}
┣ 🗓️ 𝗥𝗲𝗹𝗲𝗮𝘀𝗲: ${release}
╰━━━━━━━━━━━━━━━━━━━╯

╭━〔 🛠️ 𝗠𝗘𝗠𝗢𝗥𝗬 𝗜𝗡𝗙𝗢 〕━━╮
┣ 💾 𝗙𝗿𝗲𝗲: ${freeMem} 𝗚𝗕
┣ 📊 𝗨𝘀𝗮𝗴𝗲: ${usedMem} / ${totalMem} 𝗚𝗕
╰━━━━━━━━━━━━━━━━━━━╯`,
attachment: fs.createReadStream(__dirname + `/cache/os.png`)
  };

  api.sendMessage(message, event.threadID);
};
