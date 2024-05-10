import { useEffect, useRef, useState } from "react";
import Graph from "./Graph";
import { Button, Col, Row } from "react-bootstrap";

function Game1() {
  const [step, setStep] = useState(0);
  const [carAngle, setCarAngle] = useState(0);
  const [carX, setCarX] = useState(0);
  const [carY, setCarY] = useState(0);
  const [lap, setLap] = useState(0);
  const [inputX, setInputX] = useState(0);
  const [inputY, setInputY] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const xInput = useRef(null);
  const yInput = useRef(null);
  // const [inputX,setBoxHeight]

  useEffect(() => {
    //Implementing the setInterval method
    const interval = setInterval(() => {
      setStep(step + 1);
    }, 100);

    //Clearing the interval
    return () => clearInterval(interval);
  }, [step]);
  // parameters
  const totalLaps = 5;
  const rotateTime = 500;
  const transitTime = 1000;
  const coordinates = [
    { x: 0, y: 0, color: "white" },
    { x: 3, y: 8, color: "limegreen" },
  ];
  const paths = [{ x1: 0, y1: 0, x2: 3, y2: 8, color: "limegreen" }];
  const rotateCar = async (angle) => {
    let time = 0;
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (time >= rotateTime) {
          clearInterval(interval);
          resolve();
        } else {
          setCarAngle((prevAngle) => prevAngle + (angle * 100) / rotateTime);
          time += 100;
        }
      }, 100);
    });
  };
  const translateCar = async (x, y) => {
    let time = 0;
    let dispX = x - carX;
    let dispY = y - carY;
    let angle = 0;
    switch (true) {
      case dispX === 0 && dispY > 0:
        angle = -90;
        break;
      case dispX === 0 && dispY < 0:
        angle = -270;
        break;
      case dispX > 0:
        angle = -(Math.atan(dispY / dispX) * 180) / Math.PI;
        break;
      case dispX < 0 && dispY >= 0:
        angle = -180 - (Math.atan(dispY / dispX) * 180) / Math.PI;
        break;
      case dispX < 0 && dispY < 0:
        angle = 180 - (Math.atan(dispY / dispX) * 180) / Math.PI;
        break;
    }

    // dispX>0?dispY>0?Math.atan(dispY/dispX)*180/Math.PI:-Math.atan(dispY/dispX)*180/3.141:dispY>0?180-Math.atan(dispY/dispX)*180/3.141:-180-Math.atan(dispY/dispX)*180/3.141
    console.log("carAngle", carAngle);
    await rotateCar(angle- carAngle);
    console.log("carAngle", carAngle);
    setCarAngle(angle);
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (time >= transitTime) {
          clearInterval(interval);
          resolve();
        } else {
          setCarX((oldCarX) => oldCarX + (dispX * 100) / transitTime);
          setCarY((oldCarY) => oldCarY + (dispY * 100) / transitTime);
          time += 100;
        }
      }, 100);
    });
  };
  const handleSetInput = (value, setValue, min, max) => {
    if (value > max || value < min) {
      return;
    } else if (value == "") {
      setValue(0);
    } else {
      setValue(parseInt(value));
    }
  };
  const handleSubmit = async () => {
    setSubmitted(true);
    const interval = new Promise((resolve) => setTimeout(resolve, 100));
    await translateCar(inputX, inputY);
    setCarX(inputX);
    setCarY(inputY);
    setSubmitted(false);
  };
  const handleOnKeyDownX = (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === "Enter"||  e.key ==="ArrowLeft" || e.key === "ArrowUp") {
        console.log("key",e.key);
      e.preventDefault();
      yInput.current.focus();
      yInput.current.select();
    }
  };
  const handleOnKeyDownY = (e) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowUp"|| e.key ==="ArrowRight" || e.key === "ArrowDown" ) {
        console.log("key",e.key);
      e.preventDefault();
      xInput.current.focus();
      xInput.current.select();
    }
    if (e.key === "Enter") {
      handleSubmit();
    }
  };
  return (
    <Row>
      <Col md={8} className="p3 p-lg-5">
        <div className="w-75 ms-auto my-5 bg-success">
          <Graph
            x1={-1}
            x2={10.5}
            y1={-1}
            y2={10.5}
            carX={carX}
            carY={carY}
            carAngle={carAngle}
            flag={true}
            flagType="white"
            flagX={3}
            flagY={6}
            coordinates={coordinates}
            paths={paths}
          ></Graph>
        </div>
      </Col>
      <Col md={4}>
        <div className="w-100 bg-success h-100 my-5 py-lg-5">
          <div className="d-flex justify-content-center align-items-center">
            <h1 className="text-white">
              <i className="fa-regular fa-clock"></i>
            </h1>
            <h2 className="text-white">&nbsp;&nbsp;:&nbsp;&nbsp;</h2>
            <h1 className="text-white"> {Math.floor(step / 10)} s</h1>
          </div>
          <div className="d-flex justify-content-center align-items-center">
            <img src="flag.png" alt="flag" height={40} />
            <h2 className="text-white">&nbsp;&nbsp;:&nbsp;&nbsp;</h2>
            <h1 className="text-white">
              {" "}
              {lap}/{totalLaps}
            </h1>
          </div>
          <div className="d-flex justify-content-center align-items-center mt-5">
            <h1 className="text-white">x</h1>
            <h2 className="text-white">&nbsp;&nbsp;:&nbsp;&nbsp;</h2>
            <input
              type="number"
              className="form-control small-input"
              value={inputX}
              onChange={(e) => handleSetInput(e.target.value, setInputX, 0, 10)}
              onClick={(e) => {
                e.target.select();
              }}
              onKeyDown={handleOnKeyDownX}
              ref={xInput}
            />
          </div>
          <div className="d-flex justify-content-center align-items-center mt-2">
            <h1 className="text-white">y</h1>
            <h2 className="text-white">&nbsp;&nbsp;:&nbsp;&nbsp;</h2>
            <input
              type="number"
              className="form-control small-input"
              value={inputY}
              onChange={(e) => handleSetInput(e.target.value, setInputY, 0, 10)}
              onClick={(e) => {
                e.target.select();
              }}
              ref={yInput}
              onKeyDown={handleOnKeyDownY}
            />
          </div>
          <div className="d-flex justify-content-center align-items-center mt-2">
            <Button
              variant="warning"
              className="fs-1"
              disabled={submitted}
              onClick={handleSubmit}
            >
              Go!
            </Button>
          </div>
        </div>
      </Col>
    </Row>
  );
}

export default Game1;
