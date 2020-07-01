/* eslint-enable no-unused-vars */
export default class AppEnv {
	private _name: string = '';
	private _version: string = '';

	public getName (): string {
		return this._name
	}

	public setName (name: any) {
		this._name = name
	}

	public getVersion (): string {
		return this._version
	}

	public setVersion (version: string) {
		this._version = version
	}

	static newEnv (data: any) : AppEnv {
		const newEnv = new AppEnv()
		if ('name' in data) {
			newEnv.setName(data.name)
		}
		if ('version' in data) {
			newEnv.setVersion(data.version)
		}
		if ('_name' in data) {
			newEnv.setName(data._name)
		}
		if ('_version' in data) {
			newEnv.setVersion(data._version)
		}
		return newEnv
	}
}
