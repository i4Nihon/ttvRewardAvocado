const express = require('express');
const router = express.Router();
const names = require('../streamersNames.json')

router.get('/', (req, res) => {
  res.render("index")
});

router.post('/', (req, res, next) => {
  if (check(req.body.whichStreamer) === true) {

  }
  else if (check(req.body.whichStreamer) === false){
    res.render("index", {ERROR: "Brak nicku w bazie danych, streamer musi byc zarejstrowany w aplikacjis"})
  }
  else {
    res.render("index", {ERROR: "problem z nickiem"})
  }
})
function check(name) {
  let nick;
  for (const n in names) {
    if (n === name)
      return nick = n
  }
  if (nick === name) {
    return true
  } else if (nick === undefined) {
    return false
  }
}

module.exports = router;