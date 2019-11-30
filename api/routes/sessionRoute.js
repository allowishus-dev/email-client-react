const router = require('express').Router();

router.get("/api/setsession", (req, res) => {
    req.session.user = req.session.id;
    res.send("OK");
});

router.get("/api/getsession", (req, res) => {
    res.send({ session_id: req.session.id, user: req.session.user });
});

router.get("/api/destroysession", (req, res) => {
    res.send({ response: req.session.id + " was killed" });
    req.session.destroy(function(err) {
    // cannot access session here
    });
});

module.exports = router;



