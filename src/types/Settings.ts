export class Settings {
  private _etcdService: string;
  private _namespace: string = '';
  private _nameTemplate: string = '';

  constructor (etcd: string) {
    this._etcdService = etcd
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
}
