import {Settings} from './Settings'

export class App {
  private _name: string;
  private _desc: string = '';
  private _namespace: string = '';

  constructor(appName: string) {
    this._name = appName;
  }

  public getDesc(): string {
    return this._desc;
  }

  public setDesc(descName: string) {
    this._desc = descName;
  }

  public setNamespace(namespace : string) {
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

  public getManifest() : object {
    const deploymentManifest = require('../deployments/bb-promster.json')
    let deploy = {...deploymentManifest}
    let etcdService = "http://etcd.barimetrics.svc.cluster.local:2379"
    let envVars = [
      {
        "name": "REGISTRY_ETCD_URL",
        "value": etcdService
      },
      {
        "name": "REGISTRY_SERVICE",
        "value": this._name
      },
      {
        "name": "REGISTRY_ETCD_BASE",
        "value": "/services"
      },
      {
        "name": "REGISTRY_ETCD_BASE",
        "value": "/services"
      },
      {
        "name": "BB_PROMSTER_LEVEL",
        "value": "1"
      },
      {
        "name": "ETCD_URLS",
        "value": etcdService
      },
      {
        "name": "SCRAPE_ETCD_PATH",
        "value": `/services/${this._name}`
      },
    ]
    let remoteWrite = false
    if (remoteWrite) {
      envVars.push({
        "name": "REMOTE_WRITE_URL",
        "value": "http://nginx.cortex.svc.cluster.local/api/prom/push"
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