import { useEffect, useRef, useState } from "react";
import Graph from "./Graph";
import { Button, Col, Row } from "react-bootstrap";
import Modal from 'react-bootstrap/Modal';

function Game1() {
  const [step, setStep] = useState(0);
  const [carAngle, setCarAngle] = useState(0);
  const [carX, setCarX] = useState(0);
  const [carY, setCarY] = useState(0);
  const [lap, setLap] = useState(0);
  const [inputX, setInputX] = useState(0);
  const [inputY, setInputY] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [flagPos, setFlagPos] = useState(null);
  // const [visited,setVisited]=useState([])
  const [paths, setPaths] = useState([]);
  const [coordinates, setCoordinates] = useState([]);
  const [tempPath, setTempPath] = useState(false);
  const xInput = useRef(null);
  const yInput = useRef(null);
  const [won, setWon] = useState(false);
  const [winTime, setWinTime] = useState(0);
console.log("won",won);
  // const handleShow = () => setShow(true);

  // const [inputX,setBoxHeight]

  useEffect(() => {
    //Implementing the setInterval method
    const interval = setInterval(() => {
      setStep(step + 1);
    }, 100);

    //Clearing the interval
    return () => clearInterval(interval);
  }, [step]);
useEffect(() => {
  handleSetflagPos()
}, [])

  ///////////////////////////////////////////____PARAMETERS___/////
  const totalLaps = 5;
  const rotateTime = 500;
  const transitTime = 1000;
  const X1 = 0;
  const X2 = 10;
  const Y1 = 0;
  const Y2 = 10;
  /////////////////////////////////////////////////////////////////
  // const coordinates = [
  //   { x: 0, y: 0, color: "white" },
  //   { x: 3, y: 8, color: "limegreen" },
  // ];
  // const paths = [{ x1: 0, y1: 0, x2: 3, y2: 8, color: "limegreen" }];
  const handleSetflagPos = () => {
    while (true) {
      let x = Math.floor(Math.random() * (X2 - X1) + X1);
      let y = Math.floor(Math.random() * (Y2 - Y1) + Y1);
      if (!coordinates.map((c) => [c.x, c.y]).includes([x, y])) {
        setFlagPos([x, y]);
        break;
      }
    }
  };
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
    let x1=carX
    let y1=carY
    let angle = 0;
    switch (true) {
      case dispX === 0 && dispY > 0:
        angle = 90;
        break;
      case dispX === 0 && dispY < 0:
        angle = 270;
        break;
      case dispX > 0:
        angle = (Math.atan(dispY / dispX) * 180) / Math.PI;
        break;
      case dispX < 0 && dispY >= 0:
        angle = 180 + (Math.atan(dispY / dispX) * 180) / Math.PI;
        break;
      case dispX < 0 && dispY < 0:
        angle = -180 + (Math.atan(dispY / dispX) * 180) / Math.PI;
        break;
    }

    // dispX>0?dispY>0?Math.atan(dispY/dispX)*180/Math.PI:-Math.atan(dispY/dispX)*180/3.141:dispY>0?180-Math.atan(dispY/dispX)*180/3.141:-180-Math.atan(dispY/dispX)*180/3.141
    console.log("carAngle", carAngle);
    await rotateCar(angle - carAngle);
    console.log("carAngle", carAngle);
    setCarAngle(angle);
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (time >= transitTime) {
          setTempPath(false)
          clearInterval(interval);
          resolve();
        } else {
          setCarX((oldCarX) => oldCarX + (dispX * 100) / transitTime);
          setCarY((oldCarY) => oldCarY + (dispY * 100) / transitTime);
          setTempPath({x1:x1,y1:y1,x2:x1+(dispX * time) / transitTime,y2:y1+ (dispY * time) / transitTime,color:"yellow"})
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
    let x1=carX
    let y1=carY
    let x2=inputX
    let y2=inputY
    setSubmitted(true);
    // const interval = new Promise((resolve) => setTimeout(resolve, 100));
    await translateCar(inputX, inputY);
    setCarX(inputX);
    setCarY(inputY);
    if(x2==flagPos[0]&&y2==flagPos[1]){
      coordinates.push({ x: x2, y: y2, color: "limegreen" });
      paths.push({ x1: x1, y1: y1, x2: x2, y2: y2, color: "limegreen" });
      if(lap==totalLaps-1){
        setWinTime(step)
        setWon(true)
      }
      else{
        setLap(lap+1)
        handleSetflagPos()
      }
      setLap(lap+1)
    }
    else{
      coordinates.push({ x: x2, y: y2, color: "yellow" });
      paths.push({ x1: x1, y1: y1, x2: x2, y2: y2, color: "yellow" });
    }

    setSubmitted(false);
  };
  const handleOnKeyDownX = (e) => {
    if (
      e.key === "ArrowRight" ||
      e.key === "ArrowDown" ||
      e.key === "Enter" ||
      e.key === "ArrowLeft" ||
      e.key === "ArrowUp"
    ) {
      console.log("key", e.key);
      e.preventDefault();
      yInput.current.focus();
      yInput.current.select();
    }
  };
  const handleOnKeyDownY = (e) => {
    if (
      e.key === "ArrowLeft" ||
      e.key === "ArrowUp" ||
      e.key === "ArrowRight" ||
      e.key === "ArrowDown"
    ) {
      console.log("key", e.key);
      e.preventDefault();
      xInput.current.focus();
      xInput.current.select();
    }
    if (e.key === "Enter") {
      handleSubmit();
    }
  };
 const handleReset = () => {
    setCarX(0);
    setCarY(0);
    setCarAngle(0);
    setLap(0);
    setPaths([]);
    setCoordinates([]);
    setWon(false);
    setWinTime(0);
    handleSetflagPos()
  }
  return (
    <>
      <Row>
        <Col md={8} className="p3 p-lg-5">
          <div className="w-75 ms-md-auto mx-auto my-5 bg-success">
            <Graph
              x1={X1-1}
              x2={X2+0.5}
              y1={Y1-1}
              y2={Y2+0.5}
              carX={carX}
              carY={carY}
              carAngle={carAngle}
              flag={flagPos?true:false}
              flagType={lap===totalLaps-1?"final":"white"}
              flagX={flagPos&&flagPos[0]}
              flagY={flagPos&&flagPos[1]}
              coordinates={coordinates}
              paths={[...paths,tempPath]}
            ></Graph>
          </div>
        </Col>
        <Col md={4}>
          <Row className="pt-lg-5 mt-lg-5">
            <Col lg={12} xs={6} className="d-flex justify-content-center align-items-center">
              <h1 className="text-white">
                <i className="fa-regular fa-clock"></i>
              </h1>
              <h2 className="text-white">&nbsp;&nbsp;:&nbsp;&nbsp;</h2>
              <h1 className="text-white"> {Math.floor(step / 10)} s</h1>
            </Col>
            <Col lg={12} xs={6} className="d-flex justify-content-center align-items-center">
              <img src="flag.png" alt="flag" height={40} />
              <h2 className="text-white">&nbsp;&nbsp;:&nbsp;&nbsp;</h2>
              <h1 className="text-white">
                {" "}
                {lap}/{totalLaps}
              </h1>
            </Col>
            <Col lg={12} xs={4} className="d-flex justify-content-center align-items-center mt-2 mt-lg-5">
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
            </Col>
            <Col lg={12} xs={4} className="d-flex justify-content-center align-items-center mt-2">
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
            </Col>
            <Col lg={12} xs={4} className="d-flex justify-content-center align-items-center mt-2">
              <Button
                variant="warning"
                className="fs-md-1"
                disabled={submitted}
                onClick={handleSubmit}
              >
                Go!
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
      <Modal
        show={won}
        onHide={handleReset}
        backdrop="static"
        keyboard={false}
        centered
        size="lg"
data-bs-theme="dark"
className="rounded-5"
      >
        <Modal.Body className="p-5 text-center bg-dark rounded-5 text-light" style={{backgroundImage:"url('celebrate.gif')"}} >
          <h1>You won!</h1>
          <h3>You took {Math.floor(winTime / 10)} seconds</h3>
          <div className="d-flex justify-content-evenly">
            <Button className="fs-2">
              Back to menu
            </Button>
          <Button variant="success" className="fs-2" onClick={handleReset}>
            Play again
          </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Game1;
