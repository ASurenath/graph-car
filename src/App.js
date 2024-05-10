import { useEffect, useState } from "react";
import "./App.css";
import Graph from "./components/Graph";
import { Button, Col, Row } from "react-bootstrap";
import Game1 from "./components/Game1";

function App() {
  const [step, setStep] = useState(0);
  const [carAngle, setCarAngle] = useState(0);
  const [carX, setCarX] = useState(0);
  const [carY, setCarY] = useState(0);
  const [lap, setLap] = useState(0);
  const [inputX, setInputX] = useState(0);
  const [inputY, setInputY] = useState(0);
  // const [inputX,setBoxHeight]

  useEffect(() => {
    //Implementing the setInterval method
    const interval = setInterval(() => {

      setStep(step + 1);
      setCarAngle(step);
    }, 100);

    //Clearing the interval
    return () => clearInterval(interval);
  }, [step]);

  const totalLaps=5
  const coordinates = [
    { x: 0, y: 0, color: "white" },
    { x: 3, y: 8, color: "limegreen" },
  ];
  const paths = [{ x1: 0, y1: 0, x2: 3, y2: 8, color: "limegreen" }];
  const handleSetInput = (value,setValue,min,max) => {
    if(value>max||value<min){
      return
    }
    setValue(value)
  }
  return (
    <div className="App bg-success m-0 " style={{ minHeight: "100vh" }}>
     <Game1/>
      <h1>test</h1>
    </div>
  );
}

export default App;
