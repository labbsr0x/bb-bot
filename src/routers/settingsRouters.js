import express from 'express'
import { Settings } from '../types/Settings'
import * as db from '../db'

const router = express.Router()

router.get('/:namespace?', async (req, res) => {
  try {
    const settings = await db.loadSettings(req.params.namespace)
    res.status(200).json({
      status: 'OK',
      result: settings
    })
  } catch (err) {
    console.log('error', err)
    res.status(400).json({
      status: 'Err',
      message: err
    })
  }
})

router.post('/', async (req, res) => {
  try {
    const settings = new Settings()
    settings.jsonToApp(req.body)
    await db.saveSettings(settings).catch(e => { throw e })
    res.status(200).json({
      status: 'OK',
      result: settings
    })
  } catch (err) {
    console.log('error', err)
    res.status(400).json({
      status: 'Err',
      message: err
    })
  }
})

router.delete('/:namespace', async (req, res) => {
  try {
    const settings = new Settings()
    settings.setNamespace(req.params.namespace)
    await db.deleteSettings(settings)
    res.status(200).json({
      status: 'OK'
    })
  } catch (err) {
    console.log('error', err)
  }
})

export default router
