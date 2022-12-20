const express = require('express');
const router = express.Router();
const moment = require('moment')

/* GET users listing. */
module.exports = function (db) {

  router.get('/', function (req, res, next) {
    //searching
    const params = []
    const values = []
    let counter = 1

    if (req.query.id) {
      params.push(`id = $${counter++}`)
      values.push(req.query.id);
    }

    if (req.query.string && req.query.stringc) {
      params.push(`string ilike '%' || $${counter++} || '%'`)
      values.push(req.query.string);
    }

    if (req.query.integer && req.query.integerc) {
      params.push(`integer = $${counter++}`)
      values.push(req.query.integer);
    }

    if (req.query.float && req.query.floatc) {
      params.push(`float = $${counter++}`)
      values.push(req.query.float);
    }

    if (req.query.daten && req.query.datenc) {
      params.push(`daten = $${counter++}`)
      values.push(req.query.daten);
    }

    if (req.query.boolean && req.query.booleanc) {
      params.push(`boolean = $${counter++}`)
      values.push(req.query.boolean);
    }

    //pagination
    const page = req.query.page || 1
    const limit = 3
    const offset = (page - 1) * limit

    let sql = `SELECT COUNT(*) AS total FROM "Bread"`
    if (params.length > 0)
      sql += ` WHERE ${params.join(' AND ')}`

    db.query(sql, values, (err, data) => {
      if (err) return console.log('gagal ambil data', err)
      const total = data.rows[0].total
      const pages = Math.ceil(total / limit)

      sql = `SELECT * FROM "Bread"`
      if (params.length > 0)
        sql += ` WHERE ${params.join(` AND `)}`
      //sorting
      sql += ` LIMIT $${counter++} OFFSET $${counter++}`

      db.query(sql, [...values, limit, offset], (err, data) => {
        if (err) return console.log('gagal ambil data', err)
        res.render('list', { daftar: data.rows, moment, page, pages, offset, query: req.query })
      })
    })
  })

  router.get('/add', function (req, res, next) {
    res.render('add')
  })

  router.post('/add', function (req, res, next) {
    const values = []
    const { string, integer, float, daten, boolean } = req.body
    values.push(string)
    values.push(daten)
    
    if (integer == "") {
      values.push(null)
    } else {
      values.push(integer)
    }
    if (float == "") {
      values.push(null)
    } else {
      values.push(float)
    }
    if (boolean == "") {
      values.push(null);
    } else {
      values.push(boolean);
    }

    db.query(`INSERT INTO "Bread" (string, daten, integer, float, boolean) VALUES ($1,$2,$3,$4,$5)`, values, (err) => {
      if (err) return console.log('gagal ambil data', err)
      res.redirect('/')
    })
  })

  router.get('/delete/:id', function (req, res, next) {
    const index = req.params.id
    db.query(`DELETE FROM "Bread" WHERE id=$1`, [index], (err) => {
      if (err) return console.log('gagal ambil data', err)
      res.redirect('/')
    })
  })

  router.get('/edit/:id', function (req, res) {
    const { id } = req.params
    db.query(`SELECT * FROM "Bread" WHERE id=$1;`, [id], (err, data) => {
      if (err) return console.log('gagal ambil data', err)
      res.render('edit', { data: data.rows[0] })

    })
  })

  router.post('/edit/:id', function (req, res) {
    const { id } = req.params
    const { string, integer, float, daten, boolean } = req.body
    db.query(`UPDATE "Bread" set string=$1, integer=$2, float=$3, daten=$4, boolean=$5 where id=$6;`, [string, integer, float, daten, boolean, id], (err, rows) => {
      if (err) return console.log('gagal ambil data', err)
      res.redirect('/')
    })
  })

  return router;
}