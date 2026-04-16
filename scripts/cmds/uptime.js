const os = require("os");

const startTime = Date.now();

module.exports = {
  config: {
    name: "uptime",
    aliases: ["up","upt"],
    version: "1.0",
    author: "NIROB + Fixed by ChatGPT",
    countDown: 5,
    role: 0,
    category: "system",
    shortDescription: "Show bot uptime & system info",
    longDescription: "Get current uptime, RAM, CPU and bot info (no media)",
    guide: "{pn}",
  },

  onStart: async function ({ api, event, threadsData, usersData }) {
    try {
      // 🕒 Uptime calculation
      const uptimeInMs = Date.now() - startTime;
      const totalSeconds = Math.floor(uptimeInMs / 1000);
      const days = Math.floor(totalSeconds / (3600 * 24));
      const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      const uptime = `${days}d ${hours}h ${minutes}m ${seconds}s`;

      // 🧠 RAM & CPU
      const totalMem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
      const freeMem = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
      const usedMem = (totalMem - freeMem).toFixed(2);
      const ramUsage = (process.memoryUsage().rss / 1024 / 1024).toFixed(1);
      const cpuModel = os.cpus()[0]?.model || "Unknown CPU";

      // ⏰ Time & date
      const now = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

      // 📡 Ping check
      const pingStart = Date.now();
      await api.sendMessage("⏳ Fetching system info...", event.threadID);
      const ping = Date.now() - pingStart;

      // 👤 Data counts
      const allUsers = await usersData.getAll();
      const allThreads = await threadsData.getAll();

      // 📦 Final Output
      const info = `
🔧 𝗕𝗢𝗧 𝗦𝗬𝗦𝗧𝗘𝗠 𝗜𝗡𝗙𝗢 🔧
────────────────────────
🟢 Uptime: ${uptime}
📅 Time: ${now}
📡 Ping: ${ping}ms

💻 CPU: ${cpuModel}
📂 OS: ${os.type()} ${os.arch()}
📊 RAM: ${ramUsage} MB used by bot
💾 Memory: ${usedMem} GB / ${totalMem} GB

👥 Users: ${allUsers.length}
💬 Threads: ${allThreads.length}
────────────────────────`;

      await api.sendMessage(info, event.threadID);

    } catch (err) {
      console.error("❌ up2.js error:", err);
      return api.sendMessage("⚠️ An error occurred while showing system info.", event.threadID);
    }
  },
};
