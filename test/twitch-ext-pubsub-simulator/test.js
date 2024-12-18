#!/usr/bin/env node
require('dotenv').config()
const yargs = require("yargs");
const fs = require("fs");
const path = require("path");
const Promise = require("promise");
const fetch = require("node-fetch");
const { Buffer } = require("buffer");
const JWT = require("jsonwebtoken");
const StringDecoder = require("string_decoder").StringDecoder;


const argv = yargs
  .usage("Usage: $0 [options]")
  .default("interval", 5000)
  .describe("i", "How many ms to wait inbetween messages")
  .alias("i", "interval")
  .demand("f")
  .describe("f", "A file containing messages")
  .alias("f", "file")
  .help("h")
  .alias("h", "help")
  .boolean("v")
  .alias("v", "verbose")
  .alias("r", "repeat")
  .boolean("r")
  .describe("r", "Whether to endlessly repeat the data").argv
  // .describe("channel", "The channel to send the data to")
  // .default("channel", "173220974")
  // .describe("owner", "The extension owner")
  // .default("owner", "173220974")
  // .demand("owner")
  // .describe("extension", "The extension client id")
  // .describe("secret", "The extension secret, base64 encoded")
  // .demand("secret").argv;


// these must all be strings (otherwise the JWT will be invalid)
const extensionOwner = process.env.EXTENSION_OWNER;
const extensionClientId = process.env.EXTENSION_CLIENT_ID;
const base64Secret = process.env.EXTENSION_SECRET;
const targetChannel = "" + process.env.EXTENSION_OWNER;
const messageInterval = argv.interval;
const sourceFile = argv.file;

console.log(
  `Configured extension ${extensionClientId} with owner ${extensionOwner}`
);
console.log(`Sending to channel ${targetChannel}`);

// build jwt
const makeJWT = function() {
  const secret = Buffer.from(base64Secret, "base64");
  const jwt_payload = {
    exp: Math.floor(new Date().getTime() / 1000) + 2 * 60 * 60,
    user_id: extensionOwner,
    role: "external",
    channel_id: targetChannel,
    pubsub_perms: {
      send: ["broadcast"]
    }
  };
  return JWT.sign(jwt_payload, secret);
};

// read and send messages
const promise = new Promise((resolve, reject) => {
  fs.readFile(sourceFile, "utf8", (err, data) => {
    if (err) {
      reject(err);
      return;
    }
    resolve(data);
  });
})
  .then(data => JSON.parse(data))
  .then(
    array =>
      new Promise((resolve, reject) => {
        const interval = setInterval(() => {
          const elem = array.shift();
          if (argv.repeat) {
            array.push(elem);
          }
          if (!elem) {
            clearInterval(interval);
            resolve();
            return;
          }
          new Promise((resolve, reject) => {
            // build the payload
            const payload = {
              target: ["broadcast"],
              broadcaster_id: targetChannel,
              message: JSON.stringify(elem),
            };
            const serialized = JSON.stringify(payload);

            if (argv.v) {
              console.log(`Sending payload ${serialized}`);
              console.log(`with client id ${extensionClientId}`);
            }
            // do the request
            fetch(`https://api.twitch.tv/helix/extensions/pubsub`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${makeJWT()}`,
                "Client-Id": extensionClientId,
                "Content-Type": "application/json; charset=utf-8",
                "Content-Length": payload.length
              },
              body: serialized
            }).then(res => {
              if (argv.v) {
                console.log(`statusCode: ${res.status}`);
                console.log(`res: ${res}`);
              }
              if (!res.ok) {
                res.text().then(text => {
                  console.log(res.headers);
                  console.log(text);
                });
              }
            });
          }).catch(error => {
            console.error(error);
          });
        }, messageInterval);
      })
  )
  .catch(err => console.error(err))
  .then(() => console.log("Done"));
