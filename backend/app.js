const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const jsonParser = bodyParser.json();

var checkpoints = {};

function Checkpoint(externalCheckpoint) {
  this.btCommand = externalCheckpoint.btCommand;
  this.leftPower = externalCheckpoint.leftPower;
  this.rightPower = externalCheckpoint.rightPower
  this.rfUid = externalCheckpoint.rfUid;
}

function corsInterceptor(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  next();
}

app.get('/*', corsInterceptor);
app.post('/*', corsInterceptor);
app.delete('/*', corsInterceptor);
app.options('/*', function(req, res, next) {
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  corsInterceptor(req, res, next);
});

app.get('/', function(req, res) {
  res.status(200).send(checkpoints);
});

app.get('/teams', function(req, res) {
  res.status(200).send(Object.keys(checkpoints));
});

app.get('/:teamId', function (req, res) {
  var teamId = req.params.teamId;

  if (!teamId) return res.sendStatus(400);
  if (!checkpoints[teamId]) return res.sendStatus(404);

  res.status(200).send(checkpoints[teamId]);
});

app.post('/:teamId', jsonParser, function (req, res) {
  var teamId = req.params.teamId;
  var hasBody = Boolean(Object.keys(req.body).length);

  if (!teamId)              return res.sendStatus(400);
  if (!checkpoints[teamId]) checkpoints[teamId] = [];
  else if (!hasBody)        return res.sendStatus(409);

  if (hasBody) checkpoints[teamId].push(new Checkpoint(req.body));

  res.sendStatus(204);
});

app.delete('/:teamId', jsonParser, function(req, res) {
  var teamId = req.params.teamId;

  if (!teamId) return res.sendStatus(400);
  if (checkpoints[teamId]) delete checkpoints[teamId];

  res.sendStatus(204);
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
