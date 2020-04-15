const { ETCD_URLS } = require('./environment');
const { Etcd3 } = require('etcd3');

const etcd = new Etcd3({hosts: ETCD_URLS});

const SERVICE_BASE_URL = "/services"
const DESC_BASE_URL = "/desc"
const VERSION_URL = '/version'

function sliceByIndex(string, index = -1, separator="/") {
  let res = string.split(separator, index); 
  return index <= 0 ? res[res.length - 1] : res.length === index ? res[res.length - 1] : '' 
}

/**
 * Connects to ETCD and lists the apps being watched by Big Brother
 * @returns {Promise<string[]>}
 */
export async function listApps(opts = {}) {
    const descApp = 'descApp' in opts ? opts.descApp : false
    let appss = await etcd.getAll().prefix(`${SERVICE_BASE_URL}`).keys()
    let apps = appss.map((sub) => sliceByIndex(sub, 3))
    apps = apps.filter(app => !app.includes("promster") && app != "")
    let uniqueApps = new Set(apps);
    let uApps = [...uniqueApps]
    if (descApp) {
      uApps = uApps.map(async (app) => {
        desc = await etcd.getAll().prefix(`${DESC_BASE_URL}/${app}`).keys()
        console.log('desc', desc, 'app name', app)
        // return new Promise((resolve) => {
        //   resolve({app: app, desc: desc})
        // })
        console.log('desc', desc[0])
        if (desc.length) {
          let res = desc[0].split("/", 4);
          console.log('res', res)
          desc = res.length === 4 ? res[res.length - 1] : ''
        } else {
          desc = ''
        }
        return {app: app, desc: desc}
      })
      let result = await Promise.all(uApps)
      return result
    }
    return uApps
}


/**
 * Connects to ETCD and lists the IPs from a app
 * @returns {Promise<string[]>}
 */
export function listIPs(app) {
    return etcd.getAll().prefix(`${SERVICE_BASE_URL}/${app}`).keys().then((apps) => {
        let ips = apps.map((app) => sliceByIndex(app))
        ips = ips.filter(Boolean)
        let uniqueIps = new Set(ips);
        return new Promise((resolve) => {
            resolve([...uniqueIps]);
        });
    });
}

/**
 * Adds a new ip to be watch by promster
 * @param {String} app the service name
 * @param {String} ip the app ip
 * @returns {Promise<IPutResponse>}
 */
export async function addIp(app, ip) {
    let keyExists = await etcd.getAll().prefix(`${SERVICE_BASE_URL}/${app}/${ip}`).keys();
    if (!keyExists || (Array.isArray(keyExists) && keyExists.length === 0)) {
        return etcd.put(`${SERVICE_BASE_URL}/${app}/${ip}`).value("").exec();
    }
    throw Error("Duplicated app")
}

/**
 * Delete a ip to etcd
 * @param {String} app the service name
 * @param {String} ip the app ip
 * @returns {Promise<IPutResponse>}
 */
export async function deleteIp(app, ip) {
    let keyExists = await etcd.getAll().prefix(`${SERVICE_BASE_URL}/${app}/${ip}`).keys();
    if (keyExists || (Array.isArray(keyExists) && keyExists.length === 1)) {
        return etcd.delete().all().prefix(`${SERVICE_BASE_URL}/${app}/${ip}`).exec();
    }
}

/**
 * Adds a new app to be watch by Big Brother
 * @param {String} name the service name
 * @param {String} address the bb-promster address
 * @returns {Promise<IPutResponse>}
 */
export async function addApp(name, address) {
    let keyExists = await etcd.getAll().prefix(`${SERVICE_BASE_URL}/${name}/${address}`).keys();
    if (!keyExists || (Array.isArray(keyExists) && keyExists.length === 0)) {
        return etcd.put(`${SERVICE_BASE_URL}/${name}/${address}`).value("").exec();
    }
    throw Error("Duplicated app")
}

/**
 * Adds a new app to be watch by Big Brother
 * @param {String} name the service name
 * @param {String} address the bb-promster address
 * @returns {Promise<IPutResponse>}
 */
export async function addDescApp(name, desc) {
  let keyExists = await etcd.getAll().prefix(`${DESC_BASE_URL}/${name}/${desc}`).keys();
  if (!keyExists || (Array.isArray(keyExists) && keyExists.length === 0)) {
      return etcd.put(`${DESC_BASE_URL}/${name}/${desc}`).value("").exec();
  }
  throw Error("Duplicated app")
}


/**
 * Stops the monitoring of the application by Big Brother
 * @param {String} name the name of the application to be removed
 * @returns {Promise<IDeleteRangeResponse>}
 */
export function rmApp(name) {
    return etcd.delete().all().prefix(`${SERVICE_BASE_URL}/${name}`).exec();
}

/**
 * Stores a subscription relationship between a TELEGRAM chat and an app
 * @param {String} name the name of the app to subscribe to
 * @param {String} chatId the id of the chat identifying which chat wants to subscribe to the app identified by name
 * @returns {Promise<IPutResponse>}
 */
export function subscribeToApp(name, chatId) {
    return etcd.put(`/subscriptions/${name}/${chatId}`).value("").exec();
}

/**
 * Deletes a subscriptions relationship between a TELEGRAM chat and an app
 * @param {String} name the name of the app to subscribe to
 * @param {Stirng} chatId the id of the chat identifying which chat wants to unsubscribe to the app identified by name
 * @returns {Promise<IDeleteRangeResponse>}
 */
export function unsubscribeToApp(name, chatId) {
    return etcd.delete().all().prefix(`/subscriptions/${name}/${chatId}`).exec();
}

/**
 * Lists the existing subscriptions for a specific app
 * @param {String} name the name of the app to subscribe to
 * @returns {Promise<string[]>}
 */
export function listSubscriptions(name) {
    return etcd.getAll().prefix(`/subscriptions/${name}`).keys().then((subss) => {
        let chats = subss.map((sub) => sliceByIndex(sub))
        return new Promise((resolve) => {
            resolve(chats);
        });
    });
}

/**
 * Stores an app version for a given env. ex: dev, prod, etc.
 * @param {String} app the name of the app to add version
 * @param {String} env the env name
 * @param {String} version the version number
 * @returns {Promise<IPutResponse>}
 */
export function addVersionToApp(app, env, version) {
  return etcd.put(`${VERSION_URL}/${app}/${env}/${version}`).value("").exec();
}

/**
 * List all app versions by env
 * @param {String} app the name of the app to add version
 * @param {String} env the env name
 * @returns {Promise<IPutResponse>}
 */
export async function listVersions(app, env=null) {
  let search = `${VERSION_URL}/${app}`
  search = env ? `${VERSION_URL}/${app}/${env}` : search
  let versionsKeys = await etcd.getAll().prefix(search).keys()
  let versions = versionsKeys.map((version) => { 
    let res = version.split("/");
    let envName = res[res.length - 2]
    return {envName: res[res.length - 1]}
  })
  return new Promise((resolve) => {
      resolve(versions);
  });
  
}