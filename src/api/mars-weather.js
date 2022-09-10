const express = require('express')
const axios = require('axios')
const rateLimit = require('express-rate-limit')
const slowDown = require('express-slow-down')

const limiter = rateLimit({
  windowMs: 30 * 1000,
  max: 10,
})

const speedLImiter = slowDown({
  windowMs: 30 * 1000,
  delayAfter: 2,
  delayMs: 500,
})

const router = express.Router()

const BASE_URL = `https://api.nasa.gov/insight_weather/?`

let cachedData
let cacheTime

router.get('/', speedLImiter, limiter, async (req, res, next) => {
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
    data.cacheTime = cacheTime
    res.json(data)
  } catch (error) {
    next(error)
  }
})

module.exports = router
