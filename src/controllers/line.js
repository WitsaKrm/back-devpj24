const axios = require("axios");
const qs = require("qs");
const DB = require("../../configurations/db");

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const LINE_API_URI = "https://notify-bot.line.me/oauth/token";
const CALLBACK_URI = "http://localhost:9000/line/redirect";

const lToken = async (code, userID) => {
  console.log("get Line Token");
  try {
    const res = await axios.post(
      LINE_API_URI,
      qs.stringify({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: CALLBACK_URI,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      }
    );

    console.log(`Get Token: at userID = ${userID}`, res.data.access_token);

    const sql = `UPDATE users SET line_acctk = :line_acctk WHERE user_id = :userID`;
    console.log(sql);
    const result = await DB.query(sql, {
      replacements: {
        line_acctk: res.data.access_token,
        userID: userID,
      },
      type: DB.QueryTypes.UPDATE,
    });

    console.log('User data updated:', result);

    return res.data;
  } catch (error) {
    console.error('Error:', error.response.data.message);
    return error;
  }
};
const sendLineNotify = async ( message, accessToken) => {
  const LINE_NOTIFY_URI = "https://notify-api.line.me/api/notify";

  const header = {
    "Content-Type": "application/x-www-form-urlencoded",
    "Authorization": "Bearer " + accessToken,
  };
  await axios
    .post(LINE_NOTIFY_URI, qs.stringify({ message }), { headers : header })
    .then((response) => {
      console.log("Status:", response.status);
      console.log("Data:", response.data);
    })
    .catch((error) => {
      console.error("Error:", error.response.status);
      console.error("Message:", error.response.data.message);
    });
};


module.exports = {
  lToken,
  sendLineNotify
};

