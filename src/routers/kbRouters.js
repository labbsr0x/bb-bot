import express from 'express'
import { App } from '../types/App'
import { Settings } from '../types/Settings'

const { KB_CONFIG } = require('../environment')
const { KubeConfig } = require('kubernetes-client')
const Request = require('kubernetes-client/backends/request')
const Client = require('kubernetes-client').Client

const router = express.Router()

router.get('/list/namespaces', async (req, res) => {
	try {
		const kubeconfig = new KubeConfig()
		console.log('kb config', KB_CONFIG)
		// kubeconfig.loadFromString(JSON.stringify(config))
		kubeconfig.loadFromFile(KB_CONFIG)

		const backend = new Request({ kubeconfig })
		const client = new Client({ backend, version: '1.13' })
		const namespaces = await client.api.v1.namespaces.get()
		console.log('namespace', namespaces)
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
		const kubeconfig = new KubeConfig()
		kubeconfig.loadFromFile(KB_CONFIG)

		// kubeconfig.loadFromString(JSON.stringify(config))
		const settings = new Settings()
		settings.setNamespace('barimetrics')
		const app = new App(req.body.app)
		const deploy = app.getManifest()
		const backend = new Request({ kubeconfig })
		const client = new Client({ backend, version: '1.13' })
		// // const namespaces = await client.api.v1.namespaces.get()
		// // console.log('namespace', namespaces);

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

router.get('/check/deploy/:app', async (req, res) => {
	try {
		const kubeconfig = new KubeConfig()
		kubeconfig.loadFromFile(KB_CONFIG)
		const backend = new Request({ kubeconfig })
		const client = new Client({ backend, version: '1.13' })
		const deployment = await client.apis.apps.v1.namespaces('barimetrics').deployments(req.params.app).get()
		res.status(200).json({
			status: 'OK',
			result: deployment
		})
	} catch (err) {
		console.log('error', err)
	}
})
export default router
