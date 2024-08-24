const express = require("express");
const router = express.Router();

router.get("/", (req, res)=>{
    res.send("You visited post");
});

router.get("/:id", (req, res)=>{
    res.send("You visited post-ID");
});

router.post("/", (req, res)=>{
    res.send("sending post req");
});

router.delete("/:id", (req, res)=>{
    res.send("deleted post");
});

module.exports = router;