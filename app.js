const express = require("express")
const app = express()
const port = process.env.PORT || 3000;
const path = require('path')
const mongoose = require("./database")
const server = app.listen(port, () => console.log("Server Listening on " + port));

app.set("view engine", "pug");
app.set("views", "views");

app.use(express.urlencoded({extended: true}));
app.use(express.json())
app.use(express.static(path.join(__dirname, "public")));

const crawlRoute = require("./routes/crawlRoutes");

// APIs
const result = require("./routes/api/result");

app.use("/", crawlRoute);
app.use("/crawl", crawlRoute);

app.use("/api/result", result);