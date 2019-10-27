import React, { useState } from "react";
import css from "./App.module.css";
import useBucket from "../useBucket";

function App() {
  const [data, addData, uploadToBucket] = useBucket();
  const [playerName, setPlayerName] = useState("");
  const [playerNumber, setPlayerNumber] = useState("");
  const [trickOrTreat, setTrickOrTreat] = useState("");
  const [type, setType] = useState("tricks");

  const addPlayer = () => {
    addData({
      type: "player",
      data: { name: playerName, number: playerNumber }
    });
    setPlayerName("");
    setPlayerNumber("");
  };

  const addTrickOrTreat = () => {
    console.log("app", { type, trickOrTreat });
    addData({ type, data: trickOrTreat });
    setTrickOrTreat("trick");
  };
  const { players, tricksAndTreats } = data;
  const tricksAndTreatsArray =
    [...tricksAndTreats.treats, ...tricksAndTreats.tricks] || [];
  return (
    <>
      <header className={css.header}>
        <h1 className={css.landingHeader}>Team Trick or Treats</h1>
      </header>
      <div className={css.mainContainer}>
        <h1>Players</h1>
        <div>
          <input
            type="text"
            placeholder="name"
            onChange={e => setPlayerName(e.target.value)}
          />
          <input
            type="text"
            placeholder="number"
            onChange={e => setPlayerNumber(e.target.value)}
          />
          <button onClick={addPlayer}>add player</button>
        </div>

        <ul>
          {players.map(({ name, number }, i) => (
            <li key={i}>
              {name}- {number}
            </li>
          ))}
        </ul>

        <h1>Tricks and Treats</h1>
        <div>
          <input
            type="text"
            placeholder="name"
            onChange={e => setTrickOrTreat(e.target.value)}
          />
          <select onChange={e => setType(e.target.value)}>
            <option value="tricks">trick</option>
            <option value="treats">treat</option>
          </select>
          <button onClick={addTrickOrTreat}>+ trick or treat</button>
        </div>
        <ul>
          {tricksAndTreatsArray.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>

        <button onClick={uploadToBucket}>Submit</button>
      </div>
    </>
  );
}

export default App;
