const { KB_CONFIG } = require('../environment')
const { KubeConfig } = require('kubernetes-client')
const Request = require('kubernetes-client/backends/request')
const Client = require('kubernetes-client').Client

export default class KBClient {
	public createClient () : any {
		const kubeconfig = new KubeConfig()
		console.log('kb config', KB_CONFIG)
		// kubeconfig.loadFromString(JSON.stringify(config))
		if (KB_CONFIG) {
			kubeconfig.loadFromFile(KB_CONFIG)
		} else {
			kubeconfig.loadFromDefault()
		}
		const backend = new Request({ kubeconfig })
		const client = new Client({ backend, version: '1.13' })
		return client
	}
}
