const express = require("express")
const app = express()
const port = process.env.PORT || 3000;
const path = require('path')
const server = app.listen(port, () => console.log("Server Listening on " + port));

app.get("/", (req, res) => {
    res.status(200).send("Sandwich");
})