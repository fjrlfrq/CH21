var express = require('express');
const User = require('../models/user')
var router = express.Router();
const moment = require('moment')

/* GET users listing. */
module.exports = function (db) {
  router.get('/', function (req, res, next) {
    User.read(db, function (users) {
      res.render('users/user', { users, moment });
    })
  });

  router.get('/add', function (req, res, next) {
    res.render('users/add');
  });

  router.post('/add', function (req, res, next) {
    const { string, integer, float, daten, boolean } = req.body
    User.add(db, string, integer, float, daten, boolean, () => {
      res.redirect('/users')
    })
  });

  return router;
}