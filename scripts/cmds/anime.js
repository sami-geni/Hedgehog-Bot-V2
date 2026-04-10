const axios = require("axios");

module.exports = {
  config: {
    name: "anime",
    aliases: ["animevideo", "anivid"],
    version: "1.0",
    author: "Christus",
    role: 0,
    countDown: 5,
    description: "Envoie une vidéo d'anime aléatoire.",
    category: "anime",
  },

  onStart: async function ({ api, event }) {
    try {
      const processingMessage = await api.sendMessage(
        "⏳ Veuillez patienter quelques secondes...",
        event.threadID,
        event.messageID
      );

      const GITHUB_RAW = "https://raw.githubusercontent.com/Saim-x69x/sakura/main/ApiUrl.json";
      const rawRes = await axios.get(GITHUB_RAW);
      const apiBase = rawRes.data.apiv1;

      const res = await axios.get(`${apiBase}/api/animevideo`);

      if (!res.data || !res.data.url) {
        await api.unsendMessage(processingMessage.messageID);
        return api.sendMessage(
          "❌ Oups ! Une erreur est survenue, veuillez réessayer plus tard.",
          event.threadID,
          event.messageID
        );
      }

      const videoUrl = res.data.url;

      const msg = {
        body: "🎬 Voici une vidéo d'anime aléatoire pour toi ! 😊💖",
        attachment: await global.utils.getStreamFromURL(videoUrl),
      };
      await api.sendMessage(msg, event.threadID, event.messageID);

      await api.unsendMessage(processingMessage.messageID);

    } catch (error) {
      console.error(error);
      await api.sendMessage(
        "❌ Oups ! Une erreur est survenue, veuillez réessayer plus tard.",
        event.threadID,
        event.messageID
      );
    }
  },
};
