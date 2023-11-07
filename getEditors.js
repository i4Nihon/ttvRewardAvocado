const {exec} = require("child_process")
require("dotenv").config()
function getEditors(id, token, editorName){
  let founded = false;
  const curlGetEditors = `curl -X GET -k "https://api.twitch.tv/helix/channels/editors?broadcaster_id=${id}" -H "Authorization: Bearer ${token}" -H "Client-Id:${process.env.CLENT_ID}"`
  exec(curlGetEditors, (error, stdout) => {
    if (error) console.log(error)
    else {
      const data = stdout.data
      for (const user in data) {
        if (user.user_name.toLowerCase() === editorName.toLowerCase())
          founded = true
      }
    }
  })
  return founded;
}

module.exports = getEditors();