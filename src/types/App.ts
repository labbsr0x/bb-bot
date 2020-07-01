/* eslint-disable no-unused-vars */
import Settings from './Settings'
import AppEnv from './AppEnv'
/* eslint-enable no-unused-vars */
export default class App {
	private _name: string = '';
	private _desc: string = '';
	private _namespace: string = '';
	private _scrapePath: Array<string> = [];
	private _ips: Array<string> = [];
	private _envs: Array<AppEnv> = []

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

	public getNameDeploy () : string {
		return this._name.replace('/', '-')
	}

	public setScrapePath (path: string) {
		this._scrapePath.push(path)
	}

	public getScrapePath () : Array<string> {
		return this._scrapePath
	}

	public getIps () : any {
		return this._ips
	}

	public hasScrapePath (): Boolean {
		return this._scrapePath.length > 0
	}

	public hasIps (): Boolean {
		return this._ips.length > 0
	}

	public setIps (ip: string) {
		const exists = this._ips.find(elem => elem === ip)
		if (!exists) {
			this._ips.push(ip)
		}
	}

	public removeIps (ip: string) {
		const index = this._ips.indexOf(ip)
		if (index > -1) {
			this._ips.splice(index, 1)
			return true
		}
		throw Error('IP not found')
	}

	public hasEnvs (): Boolean {
		return this._envs.length > 0
	}

	public getEnvs () : any {
		return this._envs
	}

	public setEnv (data: any) {
		const appEnv = AppEnv.newEnv(data)
		if (!this._envs.find(elem => elem.getName() === appEnv.getName())) {
			this._envs.push(appEnv)
		}
	}

	public removeEnv (name: string) {
		const index = this._envs.findIndex(elem => elem.getName() === name)
		if (index > -1) {
			this._envs.splice(index, 1)
			return true
		}
		throw Error('Env not found')
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

	static createApp (data: any, settings?: Settings) {
		const app = new App()
		app.jsonToApp(data, settings)
		return app
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
		if ('envs' in data) {
			if (Array.isArray(data.envs)) {
				console.log(data)
				data.envs.map((env: any) => this.setEnv(env))
			}
		}
	}

	public dbToObj (data: any) {
		this.setNamespace('_namespace' in data ? data._namespace : '')
		this.setName('_name' in data ? data._name : '')
		this.setDesc('_desc' in data ? data._desc : '')
		data._ips.map((ips: string) => this.setIps(ips))
		data._scrapePath.map((path: string) => this.setScrapePath(path))
		data._envs.map((envData: any) => this.setEnv(envData))
	}

	public getManifest (settings: Settings) : object {
		const deploymentManifest = require('../deployments/bb-promster.json')
		const deploy = { ...deploymentManifest }
		const etcdService = settings.getEtcdService()
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
		if (settings.geRemoteWrite()) {
			envVars.push({
				name: 'REMOTE_WRITE_URL',
				value: settings.geRemoteWrite()
			})
		}
		deploy.metadata.name = this.getNameDeploy()
		deploy.spec.selector.matchLabels.name = this.getNameDeploy()
		deploy.spec.template.metadata.labels.name = this.getNameDeploy()
		deploy.spec.template.spec.containers[0].name = this.getNameDeploy()
		deploy.spec.template.spec.containers[0].image = settings.getDockerImage()
		deploy.spec.template.spec.containers[0].env = envVars
		return deploy
	}
}
