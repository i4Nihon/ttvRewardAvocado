const express = require('express');
const router = express.Router();
const names = require('../streamersNames.json')

router.get('/', (req, res) => {
  res.render("index")
});

router.post('/', (req, res, next) => {
  if (check(req.body.whichStreamer) === true && req.body.ifStreamer == "on") {
    res.redirect("/auth")
  } else if (check(req.body.whichStreamer) === false) {
    res.render("index", {ERROR: "Brak nicku w bazie danych, streamer musi byc zarejstrowany w aplikacji"})
  } else {
    console.log(check(req.body.whichStreamer))
    console.log(req.body.ifStreamer)
    res.render("index", {ERROR: "problem z nickiem"})
  }
})

function check(name) {

  if (JSON.stringify(names).includes(name))
    return true
  else
    return false

}

module.exports = router;