import { useEffect, useState } from "react";
import { decode } from "jsonwebtoken";

import { Pokemon, Message } from "./types";
import "./Root.css";

import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

const MOCK_PARTY: Pokemon[] = [
  // { id: 1, otid: 1, speciesName: "Cyndaquil", name: "Cyndaquil", level: 5 },
  // { id: 2, otid: 2, speciesName: "Cubone", name: "son", level: 14 },
  // { id: 3, otid: 3, speciesName: "Gengar", name: "BOO!", level: 69 },
  // { id: 4, otid: 4, speciesName: "Bidoof", name: "bidoof1", level: 99 },
];

// const test_data: Message = {
//   type: "game_state",
//   data: { party: MOCK_PARTY },
// };

// console.log(JSON.stringify(test_data));

function Root() {
  const [party, setParty] = useState(MOCK_PARTY);

  const twitch = window.Twitch ? window.Twitch.ext : null;


  useEffect(() => {
    if (twitch) {
      // following boilerplate from here:
      // https://github.com/twitchdev/extensions-boilerplate/blob/0fb19bedb1bdb24e20d0812a19b06aa84624b988/src/util/Authentication/Authentication.js
      // but idk what i'm doing really
      twitch.onAuthorized((auth: Twitch.ext.Authorized) => {
        // todo: probably catch errors

        //const decoded = decode(auth.token);
        console.log("token:");
        console.log(auth.token);
        console.log("channel id:");
        console.log(auth.channelId);
        //console.log(decoded);

        // this.Authentication.setToken(auth.token, auth.userId);
        // if (!this.state.finishedLoading) {
        //   // if the component hasn't finished loading (as in we've not set up after getting a token), let's set it up now.

        //   // now we've done the setup for the component, let's set the state to true to force a rerender with the correct data.
        //   this.setState(() => {
        //     return { finishedLoading: true };
        //   });
        // }
      });

      twitch.listen(
        "broadcast",
        (target: string, contentType: string, message: string) => {
          console.log('got a pubsub thing!');
          // verify content type
          if (contentType !== "application/json") {
            console.debug(`Unexpected contentType "${contentType}"`);
            return;
          }

          const m: Message = JSON.parse(message);
          console.log("recieved!");
          console.log(m);

          // todo: proper parsing
          if (m && m.data && m.data.party) {
            setParty(m.data.party);
          }
        }
      );
    }
  });

  return (
    <>
      <h1>party:</h1>
      {party.map((mon) => (
        <div key={mon.id}>
          {mon.name} the {mon.speciesName}, level {mon.level}
        </div>
      ))}
    </>
  );
}

export default Root;
