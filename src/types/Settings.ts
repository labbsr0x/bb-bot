export class Settings {
  private _etcdService: string;
  private _namespace: string = '';

  constructor(etcd: string) {
    this._etcdService = etcd;
  }

  public setNamespace(namespace : string) {
    this._namespace = namespace
  }

  public getNamespace () : string {
    return this._namespace;
  }
}