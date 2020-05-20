import express from 'express'
import App from '../types/App'
import * as db from '../db'

const router = express.Router()

router.get('/:app?', async (req, res) => {
	try {
		const apps = await db.loadApps(req.params.app).catch(e => { throw e })
		res.status(200).json({
			status: 'OK',
			result: apps
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
		let settings
		if ('namespace' in req.body && req.body.namespace) {
			settings = await db.loadSettings(req.body.namespace)
		}
		const app = new App()
		app.jsonToApp(req.body, settings)
		await db.addObjApp(app).catch(e => { throw e })
		res.status(200).json({
			status: 'OK',
			result: app
		})
	} catch (err) {
		console.log('error', err)
		res.status(400).json({
			status: 'Err',
			message: err
		})
	}
})

router.delete('/:app', async (req, res) => {
	try {
		await db.rmApp(req.params.app)
		res.status(200).json({
			status: 'OK'
		})
	} catch (err) {
		console.log('error', err)
	}
})

export default router
