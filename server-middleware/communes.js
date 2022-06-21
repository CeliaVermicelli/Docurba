const express = require('express')
const app = express()
app.use(express.json())

const communes = require('./Data/communes-france.json')
const cache = {}

function getCommunesByDepartements (code) {
  if (!cache[code]) {
    cache[code] = communes.filter((c) => {
      // eslint-disable-next-line eqeqeq
      return c.code_departement == code
    })
  }

  return cache[code]
}

app.get('/:departement', (req, res) => {
  res.status(200).send(getCommunesByDepartements(req.params.departement))
})

function getCommunesByRegion (code) {
  const filterredCommunes = communes.filter((c) => {
    // eslint-disable-next-line eqeqeq
    return c.code_region == code
  })

  console.log(filterredCommunes.length)
}

getCommunesByRegion(84)

module.exports = app
