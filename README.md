# Big Brother Bot

A repository to define a Telegram Bot for handling alerts emitted by a Big Brother installation

# How to Run locally

1. Talk to Telegram's Bot Father, create your own bot and get it's Telegram Token;
2. Open a Dialogflow account, create a new project and import the configs from the folder `bot/dialogflow`;
3. Train your intents;
4. Setup a Telegram integration with the Token obtained in `step 1`;
5. Expose your `port 3001` and inform a reachable HTTPS address to the Dialogflow fulfillment configuration. We recommend using [ngrok](https://ngrok.com) for that; 
6. Type the following commands in your terminal to interact with your bot directly through Telegram:

   ```bash
   TELEGRAM_TOKEN=<XXXXX:YYYYYY> docker-compose up -d --build
   ```

   This will run an example app with its own `bb-promster` cluster and the **Big Brother** app with its components.

7. Now go to the bot on Telegram, and add a new App. Inform the App name (e.g. `Example`) and the app address (e.g. `example-bb-promster:9090`). You'll be automatically subscribed to the app you've just added.

The example client app `bb-promster` cluster will get registered to the **Big Brother's** ETCD and **Big Brother** will then start collecting metrics by federating it.

Open your browser on `http://localhost:3000` to access the provided Grafana dashboard (user `bigbrother`, password `bigbrother`).

Also, access `http://localhost:3001/test` on your browser to dispatch test alerts and see if you get them at your Telegram chat. 

# Big Brother

This is part of a more large application called [Big Brother](https://github.com/labbsr0x/big-brother).