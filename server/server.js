const express = require('express')
const bodyParser = require('body-parser')
const sqlite3 = require('sqlite3').verbose()
const cors = require('cors')
const app = express()
const port = 3001

app.use(bodyParser.json())
app.use(cors())

let db = new sqlite3.Database('./database.db', err => {
  if (err) {
    console.error(err.message)
  }
  console.log('Connected to the database.')
})

db.serialize(() => {
  db.run('CREATE TABLE scores (level INTEGER, score INTEGER)')
})

app.post('/api/scores', (req, res) => {
  const { level, score } = req.body
  db.run(
    'INSERT INTO scores (level, score) VALUES (?, ?)',
    [level, score],
    function (err) {
      if (err) {
        return res.status(500).send(err.message)
      }
      res.status(201).send({ id: this.lastID })
    }
  )
})

app.get('/api/scores/:level', (req, res) => {
  const level = req.params.level
  db.all('SELECT score FROM scores WHERE level = ?', [level], (err, rows) => {
    if (err) {
      return res.status(500).send(err.message)
    }
    const scores = rows.map(row => row.score)
    res.json(scores)
  })
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`)
})
