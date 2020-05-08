/* eslint-disable no-unused-vars */
import Settings from './Settings'
/* eslint-enable no-unused-vars */
export class App {
	private _name: string = '';
	private _desc: string = '';
	private _namespace: string = '';
	private _scrapePath: Array<string> = [];
	private _ips: Array<string> = [];

	public getName (): string {
		return this._name
	}

	public setName (name: any, settings?: Settings) {
		if (settings && settings.geTemplate()) {
			const regex = /\{(.*?)\}/g
			let matches = null
			const output = []
			while (matches = regex.exec(settings.geTemplate())) { // eslint-disable-line
				output.push(matches[1])
			}
			let newName = settings.geTemplate()
			for (const parameter of output) {
				newName = newName.replace(`{${parameter}}`, `${name[parameter]}`)
			}
			this._name = newName
		} else {
			this._name = name
		}
	}

	public setScrapePath (path: string) {
		this._scrapePath.push(path)
	}

	public getScrapePath () : Array<string> {
		return this._scrapePath
	}

	public getIps () : Array<string> {
		return this._ips
	}

	public hasScrapePath (): Boolean {
		return this._scrapePath.length > 0
	}

	public hasIps (): Boolean {
		return this._ips.length > 0
	}

	public setIps (ip: string) {
		this._ips.push(ip)
	}

	public getDesc (): string {
		return this._desc
	}

	public setDesc (descName: string) {
		this._desc = descName
	}

	public setNamespace (namespace : string) {
		this._namespace = namespace
	}

	public getNamespace (settings : Settings) : string {
		if (this._namespace) {
			return this._namespace
		}
		if (settings.getNamespace()) {
			return settings.getNamespace()
		}
		return 'default'
	}

	public jsonToApp (data: any, settings?: Settings) {
		this.setNamespace('namespace' in data ? data.namespace : '')
		this.setDesc('desc' in data ? data.desc : '')
		this.setName(settings ? data : 'name' in data ? data.name : '', settings)
		if ('scrapePath' in data) {
			if (Array.isArray(data.scrapePath)) {
				data.scrapePath.map((path: string) => this.setScrapePath(path))
			} else if (typeof data.scrapePath === 'string') {
				this.setScrapePath(data.scrapePath)
			}
		}
		if ('ips' in data) {
			if (Array.isArray(data.ips)) {
				data.ips.map((ips: string) => this.setIps(ips))
			} else if (typeof data.ips === 'string') {
				this.setIps(data.ips)
			}
		}
	}

	public getManifest () : object {
		const deploymentManifest = require('../deployments/bb-promster.json')
		const deploy = { ...deploymentManifest }
		const etcdService = 'http://etcd.barimetrics.svc.cluster.local:2379'
		const envVars = [
			{
				name: 'REGISTRY_ETCD_URL',
				value: etcdService
			},
			{
				name: 'REGISTRY_SERVICE',
				value: this._name
			},
			{
				name: 'REGISTRY_ETCD_BASE',
				value: '/services'
			},
			{
				name: 'REGISTRY_ETCD_BASE',
				value: '/services'
			},
			{
				name: 'BB_PROMSTER_LEVEL',
				value: '1'
			},
			{
				name: 'ETCD_URLS',
				value: etcdService
			},
			{
				name: 'SCRAPE_ETCD_PATH',
				value: `/services/${this._name}`
			}
		]
		const remoteWrite = false
		if (remoteWrite) {
			envVars.push({
				name: 'REMOTE_WRITE_URL',
				value: 'http://nginx.cortex.svc.cluster.local/api/prom/push'
			})
		}
		deploy.metadata.name = this._name
		deploy.spec.selector.matchLabels.name = this._name
		deploy.spec.template.metadata.labels.name = this._name
		deploy.spec.template.spec.containers[0].name = this._name
		deploy.spec.template.spec.containers[0].image = 'labbsr0x/bb-promster'
		deploy.spec.template.spec.containers[0].env = envVars
		return deploy
	}
}
