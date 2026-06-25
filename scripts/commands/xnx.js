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
      response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response received.";

    api.sendMessage(
      reply,
      event.threadID,
      event.messageID
    );

  } catch (error) {
    console.log(error);

    api.sendMessage(
      "Gemini API Error!",
      event.threadID,
      event.messageID
    );
  }
};  const axios = global.nodemodule["axios"];
  const jimp = global.nodemodule["jimp"];
  const __root = path.resolve(__dirname, "cache", "canvas");

  let baseImage = await jimp.read(__root + "/Xnx.png");
  let pathImg = __root + `/xnx_${one}_${two}.png`;
  let avatarOne = __root + `/avt_${one}.png`;
  let avatarTwo = __root + `/avt_${two}.png`;

  try {
    let getAvatarOne = (await axios.get(
      `https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
      { responseType: "arraybuffer" }
    )).data;
    fs.writeFileSync(avatarOne, Buffer.from(getAvatarOne, "utf-8"));

    let getAvatarTwo = (await axios.get(
      `https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
      { responseType: "arraybuffer" }
    )).data;
    fs.writeFileSync(avatarTwo, Buffer.from(getAvatarTwo, "utf-8"));
  } catch (e) {
    throw new Error("Failed to download avatars.");
  }

  let circleOne = await jimp.read(await circle(avatarOne));
  let circleTwo = await jimp.read(await circle(avatarTwo));

  baseImage
    .resize(500, 500)
    .composite(circleOne.resize(100, 100), 360, 28)
    .composite(circleTwo.resize(70, 70), 131, 165);

  let raw = await baseImage.getBufferAsync("image/png");

  fs.writeFileSync(pathImg, raw);
  fs.unlinkSync(avatarOne);
  fs.unlinkSync(avatarTwo);

  return pathImg;
}

module.exports.run = async function ({ event, api }) {
  const fs = global.nodemodule["fs-extra"];
  const { threadID, messageID, senderID, mentions } = event;

  if (!mentions || Object.keys(mentions).length === 0)
    return api.sendMessage("❗ Please mention 1 person.", threadID, messageID);

  const mentionID = Object.keys(mentions)[0];
  const mentionName = mentions[mentionID].replace("@", "");

  try {
    const imagePath = await makeImage({ one: senderID, two: mentionID });
    return api.sendMessage(
      {
        body: `╭╼|━━━━━━━━━━━━━━|╾╮\n╰╼|━━━━━━━━━━━━━━|╾╯`,
        mentions: [
          {
            tag: mentionName,
            id: mentionID,
          },
        ],
        attachment: fs.createReadStream(imagePath),
      },
      threadID,
      () => fs.unlinkSync(imagePath),
      messageID
    );
  } catch (error) {
    return api.sendMessage(`⚠️ Error: ${error.message}`, threadID, messageID);
  }
};
