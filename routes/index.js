const express = require('express');
const router = express.Router();
const vars = require('../variables')
const names = require('../streamersNames.json')
router.get('/', (req, res) => {
    res.render("index")
});

router.get( '/', (req, res) => {
    console.log(req.body.whichStreamer, "asdas");
    res.send(req.body.whichStreamer);
    checkStreamerInDb(req.body.whichStreamer)
})

function checkStreamerInDb(streamerName){
    if (streamerName !== undefined) {
        const status = check(streamerName)
        if (status === "noSuchName") {
            const ifError = document.getElementById("ifError")
            ifError.innerText = "Błąd nie znaleziono nicku w bazie danych. Streamer musi być zarejstrowany w aplikacji."
        }
        else if (status === "nickFound"){
            window.location.replace("/auth")
        }
    }
    else {
        alert("PODAJ NICK")
    }
}

function check(name) {
    let nick;
    for (const n in names) {
        if (n === name)
            return nick = n

    }
    if (nick === name){
        vars.mod = true;
        return "nickFound"
    }
    else if (nick === undefined){
        return "noSuchName"
    }
}

router.post( '/', (req, res) => {
    console.log(req.body);
    res.send(req.body);
    checkStreamerInDb(req.body)
})


module.exports = router;