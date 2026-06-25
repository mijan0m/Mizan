const axios = require("axios");

const GEMINI_API_KEY = "AQ.Ab8RN6J-3eeNjIdAWVtfCfvOy-d76IleAHmkwsAv2iORdFAE1g";

/* ✅ BOLD CONVERTER */
function toBold(text) {
  const map = {
    A:"𝐀",B:"𝐁",C:"𝐂",D:"𝐃",E:"𝐄",F:"𝐅",G:"𝐆",H:"𝐇",I:"𝐈",J:"𝐉",
    K:"𝐊",L:"𝐋",M:"𝐌",N:"𝐍",O:"𝐎",P:"𝐏",Q:"𝐐",R:"𝐑",S:"𝐒",T:"𝐓",
    U:"𝐔",V:"𝐕",W:"𝐖",X:"𝐗",Y:"𝐘",Z:"𝐙",
    a:"𝐚",b:"𝐛",c:"𝐜",d:"𝐝",e:"𝐞",f:"𝐟",g:"𝐠",h:"𝐡",i:"𝐢",j:"𝐣",
    k:"𝐤",l:"𝐥",m:"𝐦",n:"𝐧",o:"𝐨",p:"𝐩",q:"𝐪",r:"𝐫",s:"𝐬",t:"𝐭",
    u:"𝐮",v:"𝐯",w:"𝐰",x:"𝐱",y:"𝐲",z:"𝐳",
    0:"𝟎",1:"𝟏",2:"𝟐",3:"𝟑",4:"𝟒",5:"𝟓",6:"𝟔",7:"𝟕",8:"𝟖",9:"𝟗"
  };

  return text.split("").map(c => map[c] || c).join("");
}

module.exports.config = {
  name: "ai",
  version: "2.0.1",
  credits: "Mijan",
  cooldowns: 5,
  hasPermssion: 0,
  description: "Gemini AI Chat",
  commandCategory: "chat",
  category: "chat",
  usages: ".ai [question]"
};

/* ================= GEMINI ================= */
async function getAIResponse(prompt) {
  const res = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      contents: [{
        parts: [{
          text: `
You are a Messenger AI bot.

Rules:
- Use emojis 😊😂🔥❤️
- Friendly tone
- If asked about owner/creator/maker reply ONLY:
👑 My owner is Mizan.

User: ${prompt}
          `
        }]
      }]
    }
  );

  let reply =
    res.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    "No response.";

  return toBold(reply);
}

/* ================= MAIN ================= */
module.exports.run = async function ({ api, event, args }) {
  try {
    const prompt = args.join(" ");

    if (!prompt) {
      return api.sendMessage(
        toBold("💬 Example: .ai hello"),
        event.threadID,
        event.messageID
      );
    }

    const reply = await getAIResponse(prompt);

    api.sendMessage(
      reply,
      event.threadID,
      (err, info) => {
        if (!err && global.client?.handleReply) {
          global.client.handleReply.push({
            name: module.exports.config.name,
            messageID: info.messageID
          });
        }
      },
      event.messageID
    );

  } catch (err) {
    console.log(err);
    api.sendMessage(
      "❌ Error: " + err.message,
      event.threadID,
      event.messageID
    );
  }
};

/* ================= REPLY ================= */
module.exports.handleReply = async function ({ api, event }) {
  try {
    const prompt = event.body;

    if (!prompt) return;

    const reply = await getAIResponse(prompt);

    api.sendMessage(
      reply,
      event.threadID,
      (err, info) => {
        if (!err && global.client?.handleReply) {
          global.client.handleReply.push({
            name: module.exports.config.name,
            messageID: info.messageID
          });
        }
      },
      event.messageID
    );

  } catch (e) {
    api.sendMessage(
      "❌ Error: " + e.message,
      event.threadID,
      event.messageID
    );
  }
};
