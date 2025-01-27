import React from 'react'
import './App.css'
import Die from "./Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"


export default function App() {

  const [arrayOfDice, setArrayOfDice] = React.useState(allNewDice()) 
  const [tenzies, setTenzies] = React.useState(false)
  const [timeSpentOnPage, setTimeSpentOnPage] = React.useState(0); 
  const [numOfRolls, setNumOfRolls] = React.useState(0); 
  const [bestTime, setBestTime] = React.useState(
    JSON.parse(localStorage.getItem("time")) || []
)
console.log(bestTime,'best time from storage')
React.useEffect(() => { 
  console.log(timeSpentOnPage,'timespent useef')
  console.log(bestTime,'besttime useef')
  if(timeSpentOnPage>0) {
    if (timeSpentOnPage<bestTime){
      console.log('comparison works')
      setBestTime(timeSpentOnPage)
  localStorage.setItem("time", JSON.stringify(bestTime)) }}
}, [tenzies])

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeSpentOnPage(prevTime => prevTime + 1000); // increment by 1 second
    }, 1000); // every 1 second
    if (tenzies) {
      clearInterval(intervalId);
      console.log("You won in ", numOfRolls,'rolls!')
      console.log('Game time:', timeSpentOnPage/1000, 'seconds');
    }
    return () => clearInterval(intervalId); // cleanup
  }, [tenzies]);

  React.useEffect(() => {
    const allHeld = arrayOfDice.every(die => die.isHeld)
    const firstValue = arrayOfDice[0].value
    const allSameValue = arrayOfDice.every(die => die.value === firstValue)
    if (allHeld && allSameValue) {
        setTenzies(true)
       } 
  },[arrayOfDice])

 
  const diceArray = arrayOfDice.map(die=> {
      return (<Die toggle={()=>holdDice(die.id)} id={die.id} key={die.id} value={die.value} isHeld={die.isHeld}/>)
  }) 
  
  function allNewDice() {
    const diceArrayObj=[]
        const diceArray = Array.from({length: 10}, () => Math.floor(Math.random() * 6) +1);
        for(let i=0; i<10; i++) {
          diceArrayObj[i]={value: diceArray[i],
            isHeld:false,
            id: nanoid()
          }
        }
        return diceArrayObj
  }

  function rollDie () {
  return Math.floor(Math.random() * 6) +1
  }

  function holdDice(id) {
        setArrayOfDice(oldDice => oldDice.map(die => {
      return die.id=== id ? 
      {...die, isHeld: !die.isHeld} : 
      die
    }))
  }

  function rollDice() {
    if (tenzies) {
      setArrayOfDice(allNewDice())
      setTenzies(false)
      setNumOfRolls(0)
      setTimeSpentOnPage(0)
    
    }
    setArrayOfDice(oldDice => oldDice.map(die=>{
      return die.isHeld ? die : {...die, value: rollDie()}
    }))
    setNumOfRolls(prevRolls => prevRolls+1)
  }

  return (
   <main> 
      <p>Your best time is {bestTime/1000} Seconds!</p>
      {tenzies && <Confetti />}
      {tenzies && <p>Congratulations! You won in {timeSpentOnPage/1000} seconds with {numOfRolls} rolls!</p>}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
      <div className='dice-container'>
       {diceArray}
      </div>
      <button onClick={rollDice} className='roll-button'>{tenzies ? 'New game' : 'Roll'}</button>
      {tenzies && <Confetti />}
      
    </main>
  )
}

