const express = require('express')
const axios = require('axios')
const router = express.Router()

const BASE_URL = `https://api.nasa.gov/insight_weather/?`

let cachedData
let cacheTime

router.get('/', async (req, res, next) => {
  if (cacheTime && cacheTime > Date.now() - 30 * 1000) {
    return res.json(cachedData)
  }
  try {
    const params = new URLSearchParams({
      api_key: process.env.NASA_API_KEY,
      feedtype: 'json',
      ver: '1.0',
    })

    const { data } = await axios.get(`${BASE_URL}${params}`)

    cachedData = data
    cacheTime = Date.now()
    console.log(`${BASE_URL}${params}`)
    res.json(data)
  } catch (error) {
    next(error)
  }
})

module.exports = router
