/***
 * This package handles bot messages from dialog flow
 */

const { WebhookClient, Text, Card, Image, Suggestion, Payload } = require('dialogflow-fulfillment');
const i18n = require('i18n');
const { getTelegramButtons } = require('./misc');
const { listApps, addApp, rmApp, subscribeToApp, unsubscribeToApp } = require('./db');
const intentMap = new Map();

i18n.configure({
    directory: __dirname + '/locales',
    defaultLocale: 'pt',
    register: global
})

const actions = [
    __("List all apps being monitored"),
    __("Subscribe to alerts"),
    __("Unsubscribe to alerts"),
    __("Add a new app"),
    __("Remove an app"),
    __("Change an app's bb-promster address"),
    __("Help with setting up my app observation cluster")
];

/**
 * Handles the Default Welcome Intent
 * @param agent a dialogflow fulfillment webhook client
 */
function welcome(agent){
    agent.add(getTelegramButtons(__("Welcome"), actions));
}

/**
 * Handles the List of the registered apps
 * @param {WebhookClient} agent a dialogflow fulfillment webhook client
 */
function list(agent) {
    return listApps().then((apps) => {
        if (apps.length > 0) {
            agent.add(getTelegramButtons("Here is the list of apps I'm watching right now.\nClick one to subscribe:", apps, "Subscribe to "));
        } else {
            agent.add("At this moment, there are no apps being watched by me!");
        }
    });
}

/**
 * Handles the Subscription intent of one or more apps
 * @param {WebhookClient} agent a dialogflow fulfillment webhook client
 */
function subscribe(agent) {
    return listApps().then((apps) => {
        let serviceName = agent.parameters.ServiceName;
        if (apps.length > 0) {
            if (serviceName) {
                subscribeToApp(serviceName, agent.originalRequest.payload.chat.id);
                agent.add(`Subscribed to service '${serviceName}'`);
            } else {
                agent.add(getTelegramButtons("Please select one of the options bellow:", apps, "Subscribe to "));
            }
        } else {
            agent.add("There are no apps being monitored at this time");
        }
    });
}

/**
 * Handles the Unsubscription of one or more apps
 * @param {WebhookClient} agent a dialogflow fulfillment webhook client
 */
function unsubscribe(agent) {
    return listApps().then((apps) => {
        let serviceName = agent.parameters.ServiceName;
        if (apps.length > 0) {
            if (serviceName) {
                unsubscribeToApp(serviceName, agent.originalRequest.payload.chat.from.id);
                agent.end(`Unsubscribed to service '${serviceName}'!`);
            } else {
                agent.add("What is the name of the service you'd like to unsubscribe?");
            }
        } else {
            agent.end("There are no apps being monitored");
        }
    });
}

/**
 * Handles the Addition of a new app to be observed by Big Brother
 * @param {WebhookClient} agent a dialogflow fulfillment webhook client
 */
function add(agent) {
    let serviceName = agent.parameters.ServiceName;
    let serviceURL = agent.parameters.ServiceURL;

    if (serviceName && serviceURL) {
        addApp(serviceName, serviceURL);
        agent.end(`Service '${serviceName}' added!`);
    } else if (!serviceName) {
        agent.add("What is the name of the service you'd like to add?");
    } else if (!serviceURL) {
        agent.add("What is the bb-promster of the service you'd like to add?");
    }
}

/**
 * Handles the Removal of one app that is currently being observed by Big Brother
 * @param {WebhookClient} agent a dialogflow fulfillment webhook client
 */
function remove(agent) {
    return listApps().then((apps) => {
        let serviceName = agent.parameters.ServiceName;
        if (apps.length > 0) {
            if (serviceName) {
                rmApp(serviceName);
                agent.add(`Stopped monitoring ${serviceName}`);
            } else {
                agent.add(getTelegramButtons("Please select one of the options bellow:", apps));
            }
        } else {
            agent.end("There are no apps being monitored");
        }
    });
}

/**
 * Handles the Update of an app that is currently being observer by Big Brother
 * @param {WebhookClient} agent a dialogflow fulfillment webhook client
 */
function change(agent) {
    return listApps().then((apps) => {
        let serviceName = agent.parameters.ServiceName;
        let newServiceURL = agent.parameters.ServiceURL;

        if (apps.length > 0) {
            if (serviceName && newServiceURL) {
                rmApp(serviceName);
                addApp(serviceName, newServiceURL);
            } else if (!serviceName) {
                agent.add(getTelegramButtons("Please select one of the options bellow:", apps));
            }
        } else {
            agent.end("There are no apps being monitored!");
        }
    })
}

/**
 * A handler for dialogflow messages
 * @param req http request
 * @param res http response
 */
function messageHandler(req, res) {
    if (req.body.result || req.body.queryResult) {
        let agent = new WebhookClient({'request': req, 'response': res});
        console.log("ORIGINAL REQUEST: " + agent.originalRequest);
        agent.handleRequest(intentMap);
    }
}

/**
 * Module initializer
 * @returns {{messageHandler: messageHandler}}
 */
function init() {
    intentMap.set("Default Welcome Intent", welcome);
    intentMap.set("List", list);
    intentMap.set("Subscribe", subscribe);
    intentMap.set("Unsubscribe", unsubscribe);
    intentMap.set("Add", add);
    intentMap.set("Remove", remove);
    intentMap.set("Change", change);
    return {
        messageHandler
    }
}

module.exports = init();
