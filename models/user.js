class User {

    static read(db, callback) {
        db.query('SELECT * FROM "Bread"', (err, data) => {
            if (err) return console.log('gagal ambil data');
            callback(data.rows)
        })
    }

    static add(db, string, integer, float, daten, boolean, callback) {
        db.query(`INSERT INTO "Bread" (string, integer, float, daten, boolean) VALUES ($1, $2, $3, $4, $5)`, [string, integer, float, daten, boolean], (err, data) => {
            if (err) return console.log('gagal ambil data');
            callback(data.rows)
        })
    }
}

module.exports = User