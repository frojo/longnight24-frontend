import { Pokemon, Message } from "./types";
import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./Root.css";

const MOCK_PARTY: Pokemon[] = [
  { id: 1, otid: 1, speciesName: "Cyndaquil", name: "Cyndaquil", level: 5 },
  { id: 2, otid: 2, speciesName: "Cubone", name: "son", level: 14 },
  { id: 3, otid: 3, speciesName: "Gengar", name: "BOO!", level: 69 },
  { id: 4, otid: 4, speciesName: "Bidoof", name: "bidoof1", level: 99 },
];

const test_data: Message = {
  type: "game_state",
  data: { party: MOCK_PARTY },
};

console.log(JSON.stringify(test_data));

function Root() {
  const [party, setParty] = useState(MOCK_PARTY);

  useEffect(() => {
    window.Twitch.ext.listen(
			"broadcast",
			(target: string, contentType: string, message: string) => {
				// verify content type
				if (contentType !== "application/json") {
					console.debug(`Unexpected contentType "${contentType}"`);
					return;
				}

				const m: Message = JSON.parse(message)
        console.log("recieved!")
        console.log(m)
			},
		);


  })

  return (
    <>
      <h1>your party</h1>
      {party.map((mon) => (
        <div key={mon.id}>
          {mon.name} the {mon.speciesName}, level {mon.level}
        </div>
      ))}
    </>
  );
}

export default Root;
