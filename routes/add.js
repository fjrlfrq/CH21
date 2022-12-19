var express = require('express');
var router = express.Router();

/* GET users listing. */
module.exports = function (db) {
  router.get('/', function (req, res, next) {
    res.render('users/add');
  });

  return router;
}