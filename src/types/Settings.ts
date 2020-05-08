export default class Settings {
	private _etcdService: string = '';
	private _namespace: string = '';
	private _nameTemplate: string = '';

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

	public jsonToObj (data: any) {
		this.setNamespace('namespace' in data ? data.namespace : '')
		this.setTemplate('template' in data ? data.template : '')
		this.setEtcdService('etcd' in data ? data.etcd : '')
	}

	public dbToObj (data: any) {
		this.setNamespace('_namespace' in data ? data._namespace : '')
		this.setTemplate('_nameTemplate' in data ? data._nameTemplate : '')
		this.setEtcdService('_etcdService' in data ? data._etcdService : '')
	}
}
