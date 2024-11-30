import { Pokemon } from './types'
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './Root.css'

const MOCK_PARTY: Pokemon[] = [
  {id: 1, otid: 1, speciesName: "Cyndaquil", name: "Cyndaquil", level: 5},
  {id: 2, otid: 2, speciesName: "Cubone", name: "son", level: 14},
  {id: 3, otid: 3, speciesName: "Gengar", name: "BOO!", level: 69},
  {id: 4, otid: 4, speciesName: "Bidoof", name: "bidoof1", level: 99},
]

console.log(JSON.stringify(MOCK_PARTY))

function Root() {
  const [party, setParty] = useState(MOCK_PARTY)

  return (
    <>
      <h1>your party</h1>
      {party.map((mon) => (
        <div key={mon.id}>
          {mon.name} the {mon.speciesName}, level {mon.level}
        </div>
      ))}
    </>
  )
}

export default Root
