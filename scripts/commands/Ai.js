const axios = require("axios");

const GEMINI_API_KEY = "AQ.Ab8RN6J-3eeNjIdAWVtfCfvOy-d76IleAHmkwsAv2iORdFAE1g";

function toBold(text) {
  const normal = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const bold = "𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵";

  return text
    .split("")
    .map(char => {
      const index = normal.indexOf(char);
      return index !== -1 ? bold[index] : char;
    })
    .join("");
}

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
