import { useEffect, useRef, useState } from "react";
import Graph from "./Graph";
import { Button, Col, Row } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import swal from "sweetalert";

function Game3({ X1, X2, Y1, Y2, setPage,transitType,isTimer,timer,totalLaps }) {
  const [step, setStep] = useState(0);
  const [carAngle, setCarAngle] = useState(0);
  const [carX, setCarX] = useState(0);
  const [carY, setCarY] = useState(0);
  const [lap, setLap] = useState(0);
  const [isFlag, setIsFlag] = useState(false);

  const [flagPos, setFlagPos] = useState([0, 0]);
  // const [inputX, setInputX] = useState(0);
  // const [inputY, setInputY] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [targetPos, setTargetPos] = useState(null);
  const [paths, setPaths] = useState([]);
  const [coordinates, setCoordinates] = useState([]);
  const [tempPath, setTempPath] = useState(false);
  // const xInput = useRef(null);
  // const yInput = useRef(null);
  const [won, setWon] = useState(false);
  const [winTime, setWinTime] = useState(0);
  const [valid, setValid] = useState(true);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [countDown, setCountDown] = useState(timer);
  const [isCountDownPaused, setIsCountDownPaused] = useState(false);
  const [showPaths, setShowPaths] = useState(true);
  const [showCoordinates, setShowCoordinates] = useState(true);

  // // // console.log("countDown",countDown);
  useEffect(() => {
    //Implementing the setInterval method
    const interval = setInterval(() => {
      setStep(step + 1);
      if(!isCountDownPaused&&isTimer){setCountDown(countDown-100);}
      if(countDown<=0){
        setIsTimeUp(true);
        clearInterval(interval);
        setCountDown(0);
        setIsCountDownPaused(true);
      }
    }, 100);

    //Clearing the interval
    return () => clearInterval(interval);
  }, [step]);

  useEffect(() => {
    handleSetTargetPos();
  }, []);

  ///////////////////////////////////////////____PARAMETERS___/////
  // const totalLaps = 5;
  const rotateTime = 500;
  const transitTime = 1000;

  const handleSetTargetPos = () => {
    while (true) {
      let x = Math.floor(Math.random() * (X2 - X1) + X1);
      let y = Math.floor(Math.random() * (Y2 - Y1) + Y1);
      if (!coordinates.map((c) => [c.x, c.y]).includes([x, y])) {
        setTargetPos([x, y]);
        break;
      }
    }
    setCountDown(timer);
    setIsCountDownPaused(false);
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
  const translateCar1 = async (x, y) => {
    setIsCountDownPaused(true);
    let time = 0;
    let dispX = x - carX;
    let dispY = y - carY;
    let x1 = carX;
    let y1 = carY;
    setCarAngle(90-Math.sign(x-x1)*90);
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (time >= 2 * transitTime) {
          setTempPath(false);
          setIsCountDownPaused(false);
          setCarX(0)
          setCarY(0)
          clearInterval(interval);
          resolve();
        }
        if (time < transitTime) {
          setCarX((oldCarX) => oldCarX + (dispX * 100) / transitTime);
          setTempPath({
            x1: x1,
            y1: y1,
            x2: x1 + (dispX * time) / transitTime,
            y2: y1,
            color: "yellow",
          });
          time += 100;
        } else {
          setCarY((oldCarY) => oldCarY + (dispY * 100) / transitTime);
          setTempPath({
            x1: x,
            y1: y1,
            x2: x,
            y2: y1 + (dispY * (time - transitTime)) / transitTime,
            color: "yellow",
          });
          if (time == transitTime) {
            setCarX(x);
            setCarAngle(Math.sign(y-y1)*90);
            if (x == targetPos[0]) {
              coordinates.push({ x: x, y: y1, color: "limegreen" });
              paths.push({ x1: x1, y1: y1, x2: x, y2: y1, color: "limegreen" });
            } else {
              coordinates.push({ x: x, y: y1, color: "yellow" });
              paths.push({ x1: x1, y1: y1, x2: x, y2: y1, color: "yellow" });
            }
          }
          if (time == 2 * transitTime) {
            setCarY(y);
            if (y == targetPos[1]) {
              coordinates.push({ x,y, color: "limegreen" });
              paths.push({ x1: x, y1: y1, x2: x, y2: y, color: "limegreen" });
            } else {
              coordinates.push({ x,y, color: "yellow" });
              paths.push({ x1: x, y1: y1, x2: x, y2: y, color: "yellow" });
            }
          }

          time += 100;
        }
      }, 100);
    });
  };
  const translateCar2 = async (x, y) => {
    setIsCountDownPaused(true);
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

    // // // console.log("x,y", x, y);
    await rotateCar(angle - carAngle);
    // // // console.log("carAngle", carAngle);
    setCarAngle(angle);
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (time >= transitTime) {
          setTempPath(false)
          setIsCountDownPaused(false);
          clearInterval(interval);
          resolve();
        } else {
          setCarX((oldCarX) => oldCarX + (dispX * 100) / transitTime);
          setCarY((oldCarY) => oldCarY + (dispY * 100) / transitTime);
          setTempPath({x1:x1,y1:y1,x2:x1+(dispX * time) / transitTime,y2:y1+ (dispY * time) / transitTime,color:"yellow"})
          time += 100;
        }
        if (time == transitTime) {
          setCarX(x);
          setCarY(y);
          // // console.log("x,y", x, y,carX,carY);

          if (x == targetPos[0]&& y == targetPos[1]) {
            coordinates.push({ x,y, color: "limegreen" });
            paths.push({ x1: x1, y1: y1, x2: x, y2: y, color: "limegreen" });
          } else {
            coordinates.push({ x,y ,color: "yellow" });
            paths.push({ x1: x1, y1: y1, x2: x, y2: y, color: "yellow" });
          }
        }
      }, 100);
    });
  };
  // const handleSetInput = (value, setValue, min, max) => {
  //   setValue(parseInt(value));
  //   if (value > max ) {
  //     setValue(max);
  //   } else if (value < min) {
  //     setValue(min);
  //   } else if (parseInt(value)==value || value !== '') {
  //     setValid(true);
  //   } else {
  //     setValid(false);
  //   } 
  // };
  const handleSubmit = async () => {
    setIsCountDownPaused(true);
    let x1 = carX;
    let y1 = carY;
    let x2 = flagPos[0];
    let y2 = flagPos[1];
    setSubmitted(true);
    if(transitType==1){
      await translateCar1(x2, y2)
      setCarX(0);
        setCarY(0);
        setCarAngle(0);
      ;}
      else{
        await translateCar2(x2, y2)  
        setCarX(x2);
        setCarY(y2);
      }
      setTempPath(null)

    if (x2 == targetPos[0] && y2 == targetPos[1]) {
      setTempPath(false);
      if (lap == totalLaps - 1) {
        setWinTime(step);
        setWon(true);
        setIsCountDownPaused(true);
      } else {
        swal("Correct answer", "", "success", {
          button: false,
          timer: 1000,
        });
        setLap(lap + 1);
        handleSetTargetPos();
      }
      setLap(lap + 1);
    } else {
      swal("Wrong answer", "Try again", "error", {
        button: false,
        timer: 1000,
      });
    }
    
    setSubmitted(false);
  };


  const handleReset = () => {
    setCarX(0);
    setCarY(0);
    setCarAngle(0);
    setLap(0);
    setPaths([]);
    setStep(0);
    setTempPath(false);
    setCoordinates([]);
    setWon(false);
    setWinTime(0);
    handleSetTargetPos();
    setIsTimeUp(false);
  };
  return (
    <>
      <Row>
        <Col lg={8} className="p-1 px-lg-5 d-flex justify-content-center align-items-center">
          <div className="w-75 ms-md-auto mx-auto my-3 bg-success">
            <Graph
              x1={X1 - 1}
              x2={X2 + 1}
              y1={Y1 - 1}
              y2={Y2 + 1}
              car={true}
              carX={carX}
              carY={carY}
              carAngle={carAngle}
              // flag={targetPos ? true : false}           
              flagType={lap === totalLaps - 1 ? "final" : "white"}
              flagX={flagPos && flagPos[0]}
              flagY={flagPos && flagPos[1]}
              setFlagX={(v)=>{setFlagPos((prev) => ({ ...prev, 0: v }))}}
              setFlagY={(v)=>{setFlagPos((prev) => ({ ...prev, 1: v }))}}
              isClickable={true}
              coordinates={showCoordinates?coordinates:[]}
              paths={showPaths?[...paths, tempPath]:[]}

            ></Graph>
          </div>
        </Col>
        <Col lg={4}>
          <Row className="pt-lg-5 ">
            <Col
              lg={12}
              xs={4}
              className="d-flex justify-content-center align-items-center mb-lg-5"
            >
              <Button
                onClick={() => {
                  setPage("menu");
                }}
                className="fs-6 p-1 p-sm-2 px-sm-3"

              >
                Back to menu
              </Button>
            </Col>
            <Col
              lg={12}
              xs={4}
              className="d-flex justify-content-center align-items-center"
            >
              <h1 className="text-white">
                <i className="fa-regular fa-clock"></i>
              </h1>
              <h2 className="text-white">&nbsp;&nbsp;:&nbsp;&nbsp;</h2>
              <h1 className="text-white"> {isTimer?Math.floor(countDown/1000):Math.floor(step / 10)} s</h1>
            </Col>
            <Col
              lg={12}
              xs={4}
              className="d-flex justify-content-center align-items-center"
            >
              <img src="flag.png" alt="flag" height={40} />
              <h2 className="text-white">&nbsp;&nbsp;:&nbsp;&nbsp;</h2>
              <h1 className="text-white">
                {" "}
                {lap}/{totalLaps}
              </h1>
            </Col>
            <Col xs={12}
              className="d-flex justify-content-center align-items-center " >
            <small className="text-white fs-6">(Place the flag and hit Go!)</small>

            </Col>
                    
            <Col
              xs={12}
              
              className="d-flex justify-content-center align-items-center mt-2"
            >
              <p className="text-white fs-1">Go to ({targetPos?.[0]}, {targetPos?.[1]})</p>
              <Button
                variant="warning"
                disabled={submitted || !valid}
                onClick={handleSubmit}
                className="fs-6 p-1 p-sm-2 px-sm-3"

              >
                Go!
              </Button>
            </Col>
            <Col
              lg={12}
              sm={6}
              className="d-flex justify-content-center align-items-center mt-2"
            >
              <Button
                variant="primary"
                disabled={submitted || !valid}
                onClick={() => setShowPaths(!showPaths)}
                className="fs-6 p-1"

              >
                {showPaths?'Hide paths':'Show paths'}
              </Button>
              <Button
                variant="primary"
                onClick={() => setPaths([])}
                className="fs-6 p-1"
                disabled={paths.length===0}
              >
                Clear paths
              </Button>
            </Col>
            <Col
              lg={12}
              sm={6}
              className="d-flex justify-content-center align-items-center mt-2"
            >
              <Button
                variant="primary"
                disabled={submitted || !valid}
                onClick={() => setShowCoordinates(!showCoordinates)}
                className="fs-6 p-1"

              >
                {showCoordinates?<>Hide<br/>coordinates</>:<>Show<br/>coordinates</>}
              </Button>
              <Button
                variant="primary"
                onClick={() => setCoordinates([])}
                className="fs-6 p-1"
                disabled={coordinates.length===0}
              >
                Clear<br/>coordinates
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
        <Modal.Body
          className="p-5 text-center bg-dark rounded-5 text-light"
          style={{ backgroundImage: "url('celebrate.gif')" }}
        >
          <h1>You won!</h1>
          <h3>You took {Math.floor(winTime / 10)} seconds</h3>
          <div className="d-flex justify-content-evenly">
            <Button className="fs-2" onClick={() => setPage("menu")}>
              Back to menu
            </Button>
            <Button variant="success" className="fs-2" onClick={handleReset}>
              Play again
            </Button>
          </div>
        </Modal.Body>
      </Modal>
      <Modal
        show={isTimeUp}
        onHide={handleReset}
        backdrop="static"
        keyboard={false}
        centered
        size="lg"
        data-bs-theme="dark"
        className="rounded-5"
      >
        <Modal.Body
          className="p-5 text-center bg-dark rounded-5 text-light"
        >
          <h1 className="text-danger">Time up!</h1>
          <h3>You cleared {lap} out of {totalLaps} rounds</h3>
          <h3>Don't worry, you can try again</h3>
          <div className="d-flex justify-content-evenly">
            <Button className="fs-2" onClick={() => setPage("menu")}>
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

export default Game3;
