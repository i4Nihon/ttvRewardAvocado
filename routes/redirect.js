const express = require('express');
const router = express.Router();
const {exec} = require("child_process");
const fs = require("fs");

let acc_token = '';
let ref_token = '';
let expires = '';

router.get('/', async (req, res) => {
  const params = new URLSearchParams(req.originalUrl)
  if (params.has('redirect?code') && params.has('scope')) {
    await token(params, res)
  } else if (params.has('redirect?code') && !params.has('scope')) {
    const userName = getUserName(acc_token)

  } else {
    res.render("failure", {title: "failure", errorCode: "ERROR WITH REDIRECTING"})
  }


})

async function token(params, res) {
  const curlGetToken = `curl -X POST -k https://id.twitch.tv/oauth2/token -d "client_id=${process.env.CLENT_ID}&client_secret=${process.env.CLIENT_SECRET}&code=${params.get('redirect?code')}&grant_type=authorization_code&redirect_uri=${process.env.REDIRECT}"`

  await exec(curlGetToken, async (err, stdout) => {
    if (err) return console.log(err)
    else {
      const values = JSON.parse(stdout)
      acc_token = values.access_token
      ref_token = values.refresh_token
      expires = values.expires_in
      await token2(res)
    }
  })
}
async function token2(res) {
  const curlValidate = `curl -X GET -k https://id.twitch.tv/oauth2/validate -H "Authorization: Bearer ${acc_token}"`
  await exec(curlValidate, async (err, stdout) => {

    if (err) return console.log(err)
    else {
      const values = await JSON.parse(stdout)
      if (values.login) {
        const userName = getUserName(acc_token)
        if (userName === "error") {
          res.render("failure", {title: "failure", errorCode: "ERROR WITH GETTING USER NAME"})
        } else {
          let dataFromFile = fs.readFileSync("../streamersNames.json").toString().slice(1, -1)
          dataFromFile += `,\n"${userName.toLowerCase()}":"{accessToken: \"${acc_token}\",\nrefreshToken: \"${ref_token}\",\nexpiresIn: \"${expires}\""`
          let data = `{${dataFromFile}}`
          fs.writeFileSync("../streamersNames.json", data)
        }
      } else if (values.status === 401) {
        res.render('failure', {
          errorCode: "fail in getting token",
          title: "failure",
        })

      }
    }
  })
}
function getUserName(token) {
  let output = '';
  let curlGetEditorName = `curl -H "Authorization: Bearer ${token}" -H "Client-ID:${process.env.CLENT_ID}" -X GET 'https://api.twitch.tv/helix/users'`
  exec(curlGetEditorName, (error, stdout) => {
    if (error) {
      output = "error"
    } else {
      output = stdout.data[0].login.toLowerCase()
    }
  })
  return output;
}


module.exports = router;