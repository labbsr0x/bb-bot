import express from 'express'
const util = require('util')
const { KB_CONFIG } = require('../environment');
const { KubeConfig } = require('kubernetes-client')
const Request = require('kubernetes-client/backends/request')
const Client = require('kubernetes-client').Client

let router = express.Router()

router.get("/list/namespaces", async (req, res) => {
  try {
      const kubeconfig = new KubeConfig()
      console.log('kb config', KB_CONFIG)
      // kubeconfig.loadFromString(JSON.stringify(config))
      kubeconfig.loadFromFile(KB_CONFIG)
      
      const backend = new Request({ kubeconfig })
      const client = new Client({backend, version: '1.13'})
      const namespaces = await client.api.v1.namespaces.get()
      console.log('namespace', namespaces);
      res.status(200).json({
          "status": "OK",
          "result": namespaces
      })
  } catch (err) {
      console.log('error', err)
  }
})

router.get("/deploy/promster/:app", async (req, res) => {
  try {
      const kubeconfig = new KubeConfig()
      kubeconfig.loadFromFile(KB_CONFIG)

      // kubeconfig.loadFromString(JSON.stringify(config))
      const deploymentManifest = require('./deployments/bb-promster.json')
      let deploy = {...deploymentManifest}
      let etcdService = "http://etcd.barimetrics.svc.cluster.local:2379"
      let envVars = [
        {
          "name": "REGISTRY_ETCD_URL",
          "value": etcdService
        },
        {
          "name": "REGISTRY_SERVICE",
          "value": req.params.app
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
          "value": `/services/${req.params.app}`
        },
      ]
      let remoteWrite = false
      if (remoteWrite) {
        envVars.push({
          "name": "REMOTE_WRITE_URL",
          "value": "http://nginx.cortex.svc.cluster.local/api/prom/push"
        })
      }
      deploy.metadata.name = req.params.app
      deploy.spec.selector.matchLabels.name = req.params.app
      deploy.spec.template.metadata.labels.name = req.params.app
      deploy.spec.template.spec.containers[0].name = req.params.app
      deploy.spec.template.spec.containers[0].image = 'labbsr0x/bb-promster'
      deploy.spec.template.spec.containers[0].env = envVars
      console.log(util.inspect(deploy, false, null, true /* enable colors */))
      // console.log('deployment', deploymentManifest)
      const backend = new Request({ kubeconfig })
      const client = new Client({backend, version: '1.13'})
      // const namespaces = await client.api.v1.namespaces.get()
      // console.log('namespace', namespaces);
      
      
      await client.apis.apps.v1.namespaces('barimetrics').deployments.post({ body: deploymentManifest })
      const deployment = await client.apis.apps.v1.namespaces('barimetrics').deployments(deploymentManifest.metadata.name).get()
      res.status(200).json({
          "status": "OK",
          "result": deployment
      })
  } catch (err) {
      console.log('error', err)
  }
})


router.get("/check/deploy/:app", async (req, res) => {
  try {
      const kubeconfig = new KubeConfig()
      kubeconfig.loadFromFile(KB_CONFIG)
      const backend = new Request({ kubeconfig })
      const client = new Client({backend, version: '1.13'})
      const deployment = await client.apis.apps.v1.namespaces('barimetrics').deployments(req.params.app).get()
      res.status(200).json({
          "status": "OK",
          "result": deployment
      })
  } catch (err) {
      console.log('error', err)
  }
})
export default router