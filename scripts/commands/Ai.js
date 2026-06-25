const axios = require("axios");

const GEMINI_API_KEY = "AQ.Ab8RN6J-3eeNjIdAWVtfCfvOy-d76IleAHmkwsAv2iORdFAE1g";

module.exports.config = {
  name: "ai",
  version: "1.0.0",
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

module.exports.run = async function ({ api, event, args }) {
  try {
    const prompt = args.join(" ");

    if (!prompt) {
      return api.sendMessage(
        "Example:\n.ai hello",
        event.threadID,
        event.messageID
      );
    }

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      }
    );

    const reply =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response received.";

    return api.sendMessage(
      reply,
      event.threadID,
      event.messageID
    );

  } catch (error) {
    console.log(error);

    return api.sendMessage(
      "Gemini API Error!\n" + error.message,
      event.threadID,
      event.messageID
    );
  }
};
