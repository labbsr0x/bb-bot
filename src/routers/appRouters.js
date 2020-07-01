import express from 'express'
import App from '../types/App'
import * as db from '../db'

const router = express.Router()

const loadSettings = async (req) => {
	if ('namespace' in req.body && req.body.namespace) {
		const settings = await db.loadSettings(req.body.namespace)
		return settings
	}
	return null
}

router.get('/', async (req, res) => {
	try {
		const query = 'name' in req.query ? req.query.name : ''
		const apps = await db.loadApps(query).catch(e => { throw e })
		const ipsTotal = apps.map(app => app.getIps().length).reduce((a, b) => a + b, 0)
		res.status(200).json({
			status: 'OK',
			result: apps,
			length: apps.length,
			ips: ipsTotal
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
		const settings = await loadSettings(req)
		const app = App.createApp(req.body, settings)
		const exists = await db.existsApp(app.getName()).catch(e => { throw e })
		if (exists) {
			throw Error('Duplicated app')
		}
		await db.addObjApp(app).catch(e => { throw e })
		res.status(200).json({
			status: 'OK',
			result: app
		})
	} catch (err) {
		console.log('error', err)
		res.status(400).json({
			status: 'Err',
			message: err.message
		})
	}
})

router.put('/', async (req, res) => {
	try {
		const settings = await loadSettings(req)
		const app = App.createApp(req.body, settings)
		await db.addObjApp(app, true).catch(e => { throw e })
		res.status(200).json({
			status: 'OK',
			result: app
		})
	} catch (err) {
		console.log('error', err)
		res.status(400).json({
			status: 'Err',
			message: err.message
		})
	}
})

router.delete('/', async (req, res) => {
	try {
		console.log('deleting app')
		await db.rmApp(req.params.app)
		res.status(200).json({
			status: 'OK'
		})
	} catch (err) {
		console.log('error', err)
	}
})

router.patch('/ip', async (req, res) => {
	try {
		const settings = await loadSettings(req)
		const app = App.createApp(req.body, settings)
		const oldApp = await db.loadApps(app.getName()).catch(e => { throw e })
		app.getIps().map(ip => oldApp.setIps(ip))
		await db.addObjApp(oldApp, true).catch(e => { throw e })
		res.status(200).json({
			status: 'OK',
			result: app
		})
	} catch (err) {
		console.log('error', err)
		res.status(400).json({
			status: 'Err',
			message: err.message
		})
	}
})

router.delete('/ip', async (req, res) => {
	try {
		const settings = await loadSettings(req)
		const app = App.createApp(req.body, settings)
		const oldApp = await db.loadApps(app.getName()).catch(e => { throw e })
		app.getIps().map(ip => oldApp.removeIps(ip))
		await db.addObjApp(oldApp, true).catch(e => { throw e })
		res.status(200).json({
			status: 'OK',
			result: oldApp
		})
	} catch (err) {
		console.log('error', err)
		res.status(400).json({
			status: 'Err',
			message: err.message
		})
	}
})

export default router
