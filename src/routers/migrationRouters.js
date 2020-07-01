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

router.post('/', async (req, res) => {
	try {
		const settings = await loadSettings(req)
		const apps = await db.listOldApps(req.body.etcdUrl)
		const nameRegex = /\/(\w*)\/(\w*)-([\w-]*)\/(.*)/
		const nameRegexOptions = /\/([\w-]*)\/(\w*)\/(.*)/
		let ipIndex = 4
		const requests = apps.map(async (string) => {
			const app = new App()
			let oldAppRegex = nameRegex.exec(string)
			// app.setName('', settings)
			if (oldAppRegex === null) {
				console.log('string', string, 'oldAppReges', oldAppRegex)
				oldAppRegex = nameRegexOptions.exec(string)
				app.setName(`${oldAppRegex[1]}`, settings)
				ipIndex = 3
			} else {
				app.setName(`${oldAppRegex[1]}-${oldAppRegex[3]}`, settings)
			}
			try {
				const oldApp = await db.loadApps(app.getName()).catch(e => { throw e })
				oldApp.setIps(oldAppRegex[ipIndex])
				return db.addObjApp(oldApp, true).catch(e => { throw e })
			} catch (err) {
				console.log('error on find app', err)
				app.setIps(oldAppRegex[ipIndex])
				return db.addObjApp(app).catch(e => { throw e })
			}
		})
		await Promise.all(requests)
		res.status(200).json({
			status: 'OK'
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
