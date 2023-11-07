const express = require('express');
const router = express.Router();
require('dotenv').config()
router.get('/', (req, res)=>{
  res.redirect(`https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=${process.env.CLENT_ID}&redirect_uri=${process.env.REDIRECT}`)
})

module.exports = router;