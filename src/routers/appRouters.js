import express from 'express'
import { App } from '../types/App'
import * as db from '../db'

const router = express.Router()

router.post('/', async (req, res) => {
  try {
    const app = new App()
    app.jsonToApp(req.body)
    db.addObjApp(app)
    res.status(200).json({
      status: 'OK',
      result: app
    })
  } catch (err) {
    console.log('error', err)
  }
})

export default router
