import express from 'express'
import KBClient from '../types/KBClient'
import * as db from '../db'

const kb = new KBClient()
const client = kb.createClient()

const router = express.Router()

router.get('/list/namespaces', async (req, res) => {
	try {
		const namespaces = await client.api.v1.namespaces.get()
		res.status(200).json({
			status: 'OK',
			result: namespaces
		})
	} catch (err) {
		console.log('error', err)
	}
})

router.post('/deploy/promster', async (req, res) => {
	try {
		let settings
		const app = await db.loadApps(req.body.app)
		if (app.getNamespace()) {
			settings = await db.loadSettings(app.getNamespace())
		} else {
			settings = await db.loadSettings('default')
		}
		const deploy = app.getManifest(settings)
		await client.apis.apps.v1.namespaces(app.getNamespace(settings)).deployments.post({ body: deploy })
		const deployment = await client.apis.apps.v1.namespaces(app.getNamespace(settings)).deployments(deploy.metadata.name).get()
		res.status(200).json({
			status: 'OK',
			result: deployment
		})
	} catch (err) {
		console.log('error', err)
	}
})

router.get('/check/deploy/:app*', async (req, res) => {
	try {
		const app = await db.loadApps(`${req.params.app}${req.params[0]}`)
		const deployment = await client.apis.apps.v1.namespaces(app.getNamespace()).deployments(app.getNameDeploy()).get()
		res.status(200).json({
			status: 'OK',
			result: deployment
		})
	} catch (err) {
		console.log('error', err)
		res.status(400).json({
			status: 'Err',
			message: err
		})
	}
})
export default router
