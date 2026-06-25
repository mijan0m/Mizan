const axios = require("axios");

const GEMINI_API_KEY = "AQ.Ab8RN6J-3eeNjIdAWVtfCfvOy-d76IleAHmkwsAv2iORdFAE1g";

/* ✅ FIXED BOLD CONVERTER (NO BROKEN TEXT ISSUE) */
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

/* ================= CONFIG ================= */
module.exports.config = {
  name: "ai",
  version: "2.0.0",
  credits: "Mijan",
  cooldowns: 5,
  hasPermssion: 0,
  description: "Gemini AI Chat",
  commandCategory: "chat",
  category: "chat",
  usePrefix: true,
  prefix: true,
  usages: ".ai [question]"
};

/* ================= GEMINI FUNCTION ================= */
async function getAIResponse(prompt) {
  const response = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      contents: [
        {
          parts: [
            {
              text: `
You are a friendly Messenger AI chatbot.

Rules:
- Reply in clear text
- Use emojis 😊😂🔥❤️ naturally
- Keep replies short and friendly
- If asked about owner/creator/developer/maker, reply ONLY:
👑 My owner is Mizan.
              `
            }
          ]
        }
      ]
    }
  );

  let reply =
    response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    "No response received.";

  return toBold(reply);
}

/* ================= HANDLE REPLY ================= */
module.exports.handleReply = async function ({ api, event }) {
  try {
    const prompt = event.body;
    const msg = prompt.toLowerCase();

    /* OWNER CHECK */
    if (
      msg.includes("owner") ||
      msg.includes("creator") ||
      msg.includes("developer") ||
      msg.includes("maker") ||
      msg.includes("who made you") ||
      msg.includes("who created you") ||
      msg.includes("malik") ||
      msg.includes("তোমার মালিক") ||
      msg.includes("মালিক কে")
    ) {
      return api.sendMessage(
        toBold("👑 My owner is Mizan."),
        event.threadID,
        event.messageID
      );
    }

    const reply = await getAIResponse(prompt);

    api.sendMessage(
      reply,
      event.threadID,
      (err, info) => {
        if (!err) {
          global.client.handleReply.push({
            name: module.exports.config.name,
            messageID: info.messageID
          });
        }
      },
      event.messageID
    );

  } catch (error) {
    api.sendMessage(
      "❌ Gemini Error: " + error.message,
      event.threadID,
      event.messageID
    );
  }
};

/* ================= MAIN COMMAND ================= */
module.exports.run = async function ({ api, event, args }) {
  try {
    const prompt = args.join(" ");

    if (!prompt) {
      return api.sendMessage(
        toBold("💬 Example:\n.ai Hello"),
        event.threadID,
        event.messageID
      );
    }

    const msg = prompt.toLowerCase();

    /* OWNER CHECK */
    if (
      msg.includes("owner") ||
      msg.includes("creator") ||
      msg.includes("developer") ||
      msg.includes("maker") ||
      msg.includes("who made you") ||
      msg.includes("who created you") ||
      msg.includes("malik") ||
      msg.includes("তোমার মালিক") ||
      msg.includes("মালিক কে")
    ) {
      return api.sendMessage(
        toBold("👑 My owner is Mizan."),
        event.threadID,
        event.messageID
      );
    }

    const reply = await getAIResponse(prompt);

    api.sendMessage(
      reply,
      event.threadID,
      (err, info) => {
        if (!err) {
          global.client.handleReply.push({
            name: module.exports.config.name,
            messageID: info.messageID
          });
        }
      },
      event.messageID
    );

  } catch (error) {
    api.sendMessage(
      "❌ Gemini Error: " + error.message,
      event.threadID,
      event.messageID
    );
  }
};        {
          parts: [
            {
              text: `
You are a friendly Messenger AI chatbot.

Rules:
- Use emojis naturally 😊😂🔥❤️
- Keep replies friendly and helpful
- If someone asks who is your owner, creator, developer or maker, reply only:
👑 My owner is Mizan.

User: ${prompt}
`
            }
          ]
        }
      ]
    }
  );

  let reply =
    response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    "No response received.";

  return toBold(reply);
}

module.exports.handleReply = async function ({
  api,
  event
}) {
  try {
    const prompt = event.body;
    const msg = prompt.toLowerCase();

    if (
      msg.includes("owner") ||
      msg.includes("creator") ||
      msg.includes("developer") ||
      msg.includes("maker") ||
      msg.includes("who made you") ||
      msg.includes("who created you") ||
      msg.includes("তোমার মালিক") ||
      msg.includes("মালিক কে")
    ) {
      return api.sendMessage(
        toBold("👑 My owner is Mizan."),
        event.threadID,
        event.messageID
      );
    }

    const reply = await getAIResponse(prompt);

    api.sendMessage(
      reply,
      event.threadID,
      (err, info) => {
        if (!err) {
          global.client.handleReply.push({
            name: module.exports.config.name,
            messageID: info.messageID
          });
        }
      },
      event.messageID
    );

  } catch (error) {
    console.log(error);

    api.sendMessage(
      "❌ Gemini API Error!\n" + error.message,
      event.threadID,
      event.messageID
    );
  }
};

module.exports.run = async function ({
  api,
  event,
  args
}) {
  try {
    const prompt = args.join(" ");

    if (!prompt) {
      return api.sendMessage(
        toBold("💬 Example:\n.ai Hello"),
        event.threadID,
        event.messageID
      );
    }

    const msg = prompt.toLowerCase();

    if (
      msg.includes("owner") ||
      msg.includes("creator") ||
      msg.includes("developer") ||
      msg.includes("maker") ||
      msg.includes("who made you") ||
      msg.includes("who created you") ||
      msg.includes("তোমার মালিক") ||
      msg.includes("মালিক কে")
    ) {
      return api.sendMessage(
        toBold("👑 My owner is Mizan."),
        event.threadID,
        event.messageID
      );
    }

    const reply = await getAIResponse(prompt);

    api.sendMessage(
      reply,
      event.threadID,
      (err, info) => {
        if (!err) {
          global.client.handleReply.push({
            name: module.exports.config.name,
            messageID: info.messageID
          });
        }
      },
      event.messageID
    );

  } catch (error) {
    console.log(error);

    api.sendMessage(
      "❌ Gemini API Error!\n" + error.message,
      event.threadID,
      event.messageID
    );
  }
};
