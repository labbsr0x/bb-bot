const DEFAULT_IMAGE = 'labbsr0x/bb-promster'
export default class Settings {
	private _etcdService: string = '';
	private _namespace: string = '';
	private _nameTemplate: string = '';
	private _remoteWrite: string = '';
	private _dockerImage: string = '';

	public setEtcdService (service : string) {
		this._etcdService = service
	}

	public getEtcdService () : string {
		return this._etcdService
	}

	public setNamespace (namespace : string) {
		this._namespace = namespace
	}

	public getNamespace () : string {
		return this._namespace
	}

	public setTemplate (template : string) {
		this._nameTemplate = template
	}

	public geTemplate () : string {
		return this._nameTemplate
	}

	public setRemoteWrite (url : string) {
		this._remoteWrite = url
	}

	public geRemoteWrite () : string {
		return this._remoteWrite
	}

	public setDockerImage (image: string) {
		this._dockerImage = image
	}

	public getDockerImage () {
		return this._dockerImage
	}

	public jsonToObj (data: any) {
		this.setNamespace('namespace' in data ? data.namespace : '')
		this.setTemplate('template' in data ? data.template : '')
		this.setEtcdService('etcd' in data ? data.etcd : '')
		this.setRemoteWrite('remote' in data ? data.remote : '')
		this.setDockerImage('image' in data ? data.image : DEFAULT_IMAGE)
	}

	public dbToObj (data: any) {
		this.setNamespace('_namespace' in data ? data._namespace : '')
		this.setTemplate('_nameTemplate' in data ? data._nameTemplate : '')
		this.setEtcdService('_etcdService' in data ? data._etcdService : '')
		this.setRemoteWrite('_remoteWrite' in data ? data._remoteWrite : '')
		this.setDockerImage('_dockerImage' in data ? data._dockerImage : DEFAULT_IMAGE)
	}
}
