const express = require("express");
const router = express.Router();

router.get("/", (req, res)=>{
    res.send("You visited user");
});

router.get("/:id", (req, res)=>{
    res.send("You visited user-ID");
});

router.post("/", (req, res)=>{
    res.send("sending post req to user");
});

router.delete("/:id", (req, res)=>{
    res.send("deleted user");
});

module.exports = router;