'use strict';

const express = require("express");

const app = express();
const dataJson = require("./Movie Data/data.json");

//app.get('/', dataJsonHandler);
//app.get('/welcome', welcomeHandler);

function FormatJsonHandler(title, poster_path, overview) {
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
}

app.get('/welcome', function (req, res) {
    res.send('Welcome to Favorite Page');
})

app.get('/', function (request, response) {
    let result = [];

    let objJson = new FormatJsonHandler("title", "poster_path", "overview");
    result.push(objJson);
    return response.send(result)
})

app.listen(3000, () => {
    console.log("Listen on 3000");
})