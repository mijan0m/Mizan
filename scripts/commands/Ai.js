const axios = require("axios");

const GEMINI_API_KEY = "AQ.Ab8RN6Jaoa0N-ukC2Ih1EMiGBcySCRdhj_4F1GEgup5SMngzYg";

module.exports.config = {
  name: "ai",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Mijan",
  description: "Gemini AI Chat",
  commandCategory: "ai",
  usages: ".ai [question]",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  const prompt = args.join(" ");

  if (!prompt) {
    return api.sendMessage(
      "Usage: .ai hello",
      event.threadID,
      event.messageID
    );
  }

  try {
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
      "Gemini API Error!",
      event.threadID,
      event.messageID
    );
  }
};
