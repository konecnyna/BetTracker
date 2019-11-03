var express = require("express");
var path = require("path");
var games = require("./lib/games.js");
var predictions = require("./lib/predictions.js");
var rss = require("./lib/football_rss.js");
const request = require('request-promise');

var path = require("path");
var ROOT_NAME = "/bet-tracker";

const URL = `https://project-3654207232474154346.firebaseio.com/bet-tracker/games.json`

function BetTracker(app) {
  console.log("*********************************************************");
  console.log("Running as default route:", ROOT_NAME);
  console.log("*********************************************************");

  app.use(ROOT_NAME, express.static(path.join(__dirname, "lib/public")));

  app.get(ROOT_NAME + "/api/v1/scores", async (req, res) => {
    const options = {
      url: URL,
      json: true,
    };
    const body = await request.get(options)

    games.getUIData(function (callback) {
      res.json(callback);
    }, body);
  });

  app.get(ROOT_NAME + "/api/v1/picks", async (req, res) => {
    const options = {
      url: URL,
      json: true,
    };
    const body = await request.get(options)
    var prettyJson = JSON.stringify(body, null, 4);
    res.json(prettyJson);
  });


  app.get(ROOT_NAME + "/api/v1/predictions", function (req, res) {
    predictions.getScores(function (callback) {
      res.json(callback);
    });
  });

  app.get(ROOT_NAME + "/api/v1/update_picks", async (req, res) => {
    try {
      const picks = JSON.parse(req.query.picks);
      const options = {
        url: URL,
        json: true,
        body: picks,
      };
      const body = await request.put(options);
      res.json(body);
    } catch (e) {
      console.log("Bad json: " + e);
      res.send("fail!");
    }
  });

  app.get(ROOT_NAME + "/api/v1/rss", function (req, res) {
    rss.getFootballRss(function (xml) {
      res.set("Content-Type", "text/xml");
      res.send(xml);
    });
  });
}

module.exports = BetTracker;
