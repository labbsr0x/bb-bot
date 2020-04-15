'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const i18n = require('i18n');
const { messageHandler } = require('./agent');
const { alert } = require('./alert');
const { listApps, addApp, rmApp, subscribeToApp, unsubscribeToApp, listIPs, addIp, deleteIp, addDescApp } = require('./db');
const { LANGUAGE } = require('./environment')
const app = express();

i18n.configure({
    directory: __dirname + '/locales',
    defaultLocale: LANGUAGE,
    register: global
});

app.use(cors());
app.use(bodyParser.json());
app.use(i18n.init);

app.post("/", messageHandler);

app.get("/test", (req, res) => {
    alert("teste", "ALERT! 1, 2, 3!").then(() => {
        res.status(200).json({"alerts": "sent"})
    });
});

app.post("/alertmanager", async (req, res) => {
    let alertmanager = req.body
    try {
        if (alertmanager.receiver == "bot") {
            for (let al of alertmanager.alerts) {
                if ("app" in al.annotations) {
                    await alert(al.annotations.app, al.annotations.description)
                }
            }
        }
        res.status(200).json({
            "live": true,
            "body": req.body
        });
    } catch (error) {
        console.debug("Error on alert manager", error)
    }
});

app.post("/add/app", async (req, res) => {
    console.log("add app")
    try {
        await addApp(req.body.name, req.body.address)
        if ('desc' in req.body) {
          await addDescApp(req.body.name, req.body.desc)
        }
        res.status(200).json({
            "status": "OK"
        })
    } catch (error) {
        console.log("Cannot add app", error)
        res.status(400).json({
            "status": "Error"
        })        
    }
})

app.post("/remove/app", async (req, res) => {
    console.log("add app")
    try {
        await rmApp(req.body.name)
        res.status(200).json({
            "status": "OK"
        })
    } catch (error) {
        console.log("Cannot add app", error)
        res.status(400).json({
            "status": "Error"
        })        
    }
})

app.get("/list/apps", async (req, res) => {
  console.log("list app")
  console.log('query', req.query)
  let apps = await listApps(req.query)
  res.status(200).json({
      "status": "OK",
      "result": apps
  })
})

app.post("/test/alert", async (req, res) => {
    try {
        await alert(req.body.app, req.body.description)
        res.status(200).json({
            "status": "OK"
        })
    } catch (error) {
        console.debug("error", error)
        res.status(400).json({
            status: "Error"
        })
    }
})

app.post("/subscribe", async (req, res) => {
    console.log("list app")
    await subscribeToApp(req.body.name, req.body.chatId)
    res.status(200).json({
        "status": "OK"
    })
})

app.post("/add/ip", async (req, res) => {
    console.log("add ip")
    try {
        await addIp(req.body.app, req.body.ip)
        res.status(200).json({
            "status": "OK"
        })
    } catch (err) {
        console.debug("error", err)
        res.status(400).json({
            "status": "Err"
        })
    }
})

app.post("/remove/ip", async (req, res) => {
    try {
        await deleteIp(req.body.app, req.body.ip)
        res.status(200).json({
            "status": "OK"
        })
    } catch (err) {
        console.debug("error", err)
        res.status(400).json({
            "status": "Err"
        })
    }
})

app.get("/list/ips/:app", async (req, res) => {
    console.log("list ips")
    let ips = await listIPs(req.params.app)
    res.status(200).json({
        "status": "OK",
        "result": ips
    }) 
})

app.post("/generate/json", async (req, res) => {
    try {
        let ips = await listIPs(req.body.app)
        let numberFiles = req.params.files 
        let json = [
            {
                "targets": ips,
                "labels": {}
            }
        ]
        let data = JSON.stringify(json)
        res.status(200)
        res.setHeader('Content-disposition', 'attachment; filename= file001.json');
        res.setHeader('Content-type', 'application/json');
        res.write(data, function (err) {
            res.end();
        })
    } catch (err) {
        console.debug("error", err)
        res.status(400).json({
            "status": "Err"
        })
    }
})

app.get("/list/version/:app", async (req, res) => {
  let ips = await listIPs(req.params.app)
  res.status(200).json({
      "status": "OK",
      "result": ips
  }) 
})

app.get("/add/version/:app", async (req, res) => {
  console.log("list ips")
  let ips = await listIPs(req.params.app)
  res.status(200).json({
      "status": "OK",
      "result": ips
  }) 
})

export default app;