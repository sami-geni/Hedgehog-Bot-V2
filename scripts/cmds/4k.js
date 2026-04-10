const a = require("axios");
const f = require("fs");
const p = require("path");

const u = "http://65.109.80.126:20409/aryan/4k";

module.exports = {
  config: {
    name: "4k",
    aliases: ["upscale"],
    version: "1.1",
    role: 0,
    author: "Christus",
    countDown: 10,
    longDescription: "Améliore une image en résolution 4K.",
    category: "image",
    guide: {
      en: "${pn} répondre à une image pour l'améliorer en 4K."
    }
  },

  onStart: async function ({ message, event }) {
    if (
      !event.messageReply ||
      !event.messageReply.attachments ||
      !event.messageReply.attachments[0] ||
      event.messageReply.attachments[0].type !== "photo"
    ) {
      return message.reply("📸 Veuillez répondre à une image pour l'améliorer.");
    }

    const i = event.messageReply.attachments[0].url;
    const t = p.join(__dirname, "cache", `upscaled_${Date.now()}.png`);
    let m;

    try {
      const r = await message.reply("🔄 Traitement de votre image, veuillez patienter...");
      m = r.messageID;

      const d = await a.get(`${u}?imageUrl=${encodeURIComponent(i)}`);
      if (!d.data.status) throw new Error(d.data.message || "Erreur API");

      const x = await a.get(d.data.enhancedImageUrl, { responseType: "stream" });
      const w = f.createWriteStream(t);
      x.data.pipe(w);

      await new Promise((res, rej) => {
        w.on("finish", res);
        w.on("error", rej);
      });

      await message.reply({
        body: "✅ Votre image améliorée en 4K est prête !",
        attachment: f.createReadStream(t),
      });
    } catch (e) {
      console.error("Upscale Error:", e);
      message.reply("❌ Une erreur est survenue lors de l'amélioration de l'image. Veuillez réessayer plus tard.");
    } finally {
      if (m) message.unsend(m);
      if (f.existsSync(t)) f.unlinkSync(t);
    }
  }
};
