'use strict';
require("dotenv").config()
const express = require("express");
const DATABASE_URL = process.env.DATABASE_URL;
const ApiKey = process.env.APIKEY;
const app = express();
const dataJson = require("./Movie Data/data.json");
const axios = require("axios");
const pg = require("pg");
app.use(express.json());

const client = new pg.Client(DATABASE_URL);

function FormatJsonHandler(id, release_date, title, poster_path, overview) {
    this.id = id;
    this.release_date = release_date;
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
}

function FormatJsonHandlerReviews(status_code, status_message, success) {
    this.status_code = status_code;
    this.status_message = status_message;
    this.success = success;
}

app.get('/', function (req, res) {
    res.send('Welcome to movie Page');
})

app.get('/reviews', function (req, res) {
    let result = [];
    axios.get(`https://api.themoviedb.org/3/movie/{movie_id}/reviews?api_key=${ApiKey}`)
        .then(apirespons => {
            apirespons.data.results.map(value => {
                let objJson = new FormatJsonHandlerReviews(value.status_code, value.status_message, value.success);
                result.push(objJson);
            })
            return res.send(result)
        })
})

app.get('/search', function (req, res) {
    let result = [];

    axios.get(`https://api.themoviedb.org/3/trending/all/week?api_key=${ApiKey}`)
        .then(apirespons => {
            apirespons.data.results.map(value => {
                let objJson = new FormatJsonHandler(value.id = null, value.title);
                result.push(objJson);
            })
            return res.send(result)
        })
})
app.post('/addmovietable', function (req, res) {
    const mov = req.body;
    console.log(mov);

    const sql = `INSERT INTO movietable (release_date,title,poster_path,overview) VALUES ($1,$2,$3,$4)RETURNING *;`
    const values = [mov.release_date, mov.title, mov.poster_path, mov.overview]
    client.query(sql, values).then((result) => {
        res.status(201).json(result.rows);
    });
})

app.get('/trending', function (request, response) {
    let result = [];

    axios.get(`https://api.themoviedb.org/3/trending/all/week?api_key=${ApiKey}`)
        .then(apirespons => {
            apirespons.data.results.map(value => {
                let objJson = new FormatJsonHandler(value.id, value.release_date, value.title, value.poster_path, value.overview);
                result.push(objJson);
            })
            return response.send(result)
        })

    /*    let objJson = new FormatJsonHandler("title", "poster_path", "overview");
     result.push(objJson);
     return response.send(result)
 */
})
app.get('/addmovietables/:id', function (request, response) {
    let id = request.params.id;
    const sql = `SELECT * FROM movietable WHERE id=$1;`
    const values = [id];
    client.query(sql, values).then((result) => {
        return response.status(200).json(result.rows)
    })
})

app.put('/updatemovietables/:id', function (req, res) {
    const id = req.params.id;
    const mov = req.body;
    const sql = `UPDATE movietable SET release_date=$1,title=$2,poster_path=$3,overview=$4 WHERE id=$5 RETURNING *;`
    const values = [mov.release_date, mov.title, mov.poster_path, mov.overview, id];
    client.query(sql, values).then((result) => {
        return res.status(200).json(result.rows)
    })
})

app.delete("/deletemovietables/:id", function (req, res) {
    const id = req.params.id
    const sql = `DELETE FROM movietable WHERE id=$1;`
    const values = [id]
    client.query(sql, values).then(result => {
        return res.status(204).json({})
    })
})
client.connect()
    .then(() => {
        app.listen(3000, () => {
            console.log("Listen on 3000");
        })
    })
