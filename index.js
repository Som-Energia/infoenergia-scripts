const express = require("express")
const app = express()
var cors = require('cors')

const CONTRACTS = './contracts/'


app.listen(9999, () => {
  console.log("Som Energia - InfoEnergia Fake API 👻")
  console.log("El servidor està inicialitzat... http://localhost:9999")
})

// Enabling CORS
app.use(cors())

app.get('/', function (req, res) {
  res.send('InfoEnergia Fake API 👻')
})

app.get('/contract/:contract', function (req, res) {
  fs = require('fs')
  fs.readFile(`${CONTRACTS}${req.params.contract}.json`, 'utf8', (err, data) => {
    if (err) {
      return res.send(err)
    }
    res.json(JSON.parse(data))
  })
})

app.get('/data/dailyprofile/:contract', function (req, res) {
  fs = require('fs')
  fs.readFile(`${CONTRACTS}${req.params.contract}.json`, 'utf8', (err, data) => {
    if (err) {
      return res.send(err)
    }
    const contract = JSON.parse(data)
    const response = { ...contract._items[0].results.dailyTypicalProfileLast12Months, updated: contract._items[0]._updated }
    res.json(response)
  })
})

app.get('/data/distributionbyperiod/:contract', function (req, res) {
  fs = require('fs')
  fs.readFile(`${CONTRACTS}${req.params.contract}.json`, 'utf8', (err, data) => {
    if (err) {
      return res.send(err)
    }
    const contract = JSON.parse(data)
    res.json(contract._items[0].results.distributionByPeriods)
  })
})

app.get('/data/distributionbytypeofuse/:contract', function (req, res) {
  fs = require('fs')
  fs.readFile(`${CONTRACTS}${req.params.contract}.json`, 'utf8', (err, data) => {
    if (err) {
      return res.send(err)
    }
    const contract = JSON.parse(data)
    res.json(contract._items[0].results.distributionByTypeOfUse)
  })
})
