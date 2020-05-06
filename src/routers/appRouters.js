import express from 'express'
import {App} from '../types/App'
import * as db from '../db'

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

router.post("/", async (req, res) => {
  try {
    let app = new App()
    app.jsonToApp(req.body)
    db.addObjApp(app)
    res.status(200).json({
        "status": "OK",
        "result": app
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