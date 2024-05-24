import { useEffect, useRef, useState } from "react";
import Graph from "./Graph";
import { Button, Col, Row } from "react-bootstrap";
import Modal from 'react-bootstrap/Modal';

function Game1({
  X1,
  X2,
  Y1,
  Y2,
  setPage,
  }) {
  const [valid, setValid] = useState(true);
  const [flagPos, setFlagPos] = useState(null);
  const [inputX, setInputX] = useState(0);
  const [inputY, setInputY] = useState(0);
  const [isFlag, setIsFlag] = useState(false);
  const xInput = useRef(null);
  const yInput = useRef(null);
  // // console.log(inputX,inputY);

  useEffect(() => {
    setInputX(flagPos?.[0]?flagPos[0]:0);
    setInputY(flagPos?.[1]?flagPos[1]:0);
  }, [flagPos]);
  const handleSetInput = (value, setValue, min, max) => {
    if(value=='-'){setValue('-');}
    else{setValue((value));}
    if (value > max ) {
      setValue(max);
    } else if (value < min) {
      setValue(min);
    } 
    if (parseInt(value)==value || value !== '') {
      setValid(true);
    } else {
      setValid(false);
    } 
  };
  const handleSubmit = async () => {
    setFlagPos([parseInt(inputX), parseInt(inputY)]);
    setIsFlag(true);
  };
  const handleOnKeyDownX = (e) => {
    if (
      e.key === "ArrowRight" ||
      e.key === "ArrowDown" ||
      e.key === "Enter" ||
      e.key === "ArrowLeft" ||
      e.key === "ArrowUp"
    ) {
      // // console.log("key", e.key);
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
      // // console.log("key", e.key);
      e.preventDefault();
      xInput.current.focus();
      xInput.current.select();
    }
    if (e.key === "Enter") {
      handleSubmit();
    }
  };
  return (
    <>
    
      <Row>
        <Col lg={8} className="p-1 px-lg-5 d-flex justify-content-center align-items-center">
          <div className="w-75 ms-md-auto mx-auto my-3 bg-success">
          <Graph
              x1={X1-1}
              x2={X2+1}
              y1={Y1-1}
              y2={Y2+1}
              flag={isFlag}
              flagType={"white"}
              flagX={flagPos&&flagPos[0]}
              flagY={flagPos&&flagPos[1]}
              setFlagX={(v)=>{setFlagPos((prev) => ({ ...prev, 0: v }))}}
              setFlagY={(v)=>{setFlagPos((prev) => ({ ...prev, 1: v }))}}
              car={false}
              isClickable={true}
              learnMode={true}
            ></Graph>
          </div>
        </Col>
        <Col lg={4}>
          <Row className="pt-lg-5 mt-lg-5">
            <Col
              xs={12}
              className="d-flex justify-content-center align-items-center"
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
            <Col xs={12}
              className="d-flex justify-content-center align-items-center " >
            <small className="text-white fs-6">(Click on the graph or enter coordinates)</small>

            </Col>
 
            <Col
              lg={12}
              xs={4}
              className="d-flex justify-content-center align-items-center mt-2"
            >
              <h1 className="text-white">x</h1>
              <h2 className="text-white">&nbsp;&nbsp;:&nbsp;&nbsp;</h2>
              <input
                type="number"
                className="form-control small-input"
                value={inputX}
                onChange={(e) =>
                  handleSetInput(e.target.value, setInputX,X1 , X2)
                }
                onClick={(e) => {
                  e.target.select();
                }}
                onKeyDown={handleOnKeyDownX}
                ref={xInput}
                min={X1}
                max={X2}
              />
            </Col>
            <Col
              lg={12}
              xs={4}
              className="d-flex justify-content-center align-items-center mt-2"
            >
              <h1 className="text-white">y</h1>
              <h2 className="text-white">&nbsp;&nbsp;:&nbsp;&nbsp;</h2>
              <input
                type="number"
                className="form-control small-input"
                value={inputY}
                onChange={(e) =>
                  handleSetInput(e.target.value, setInputY, Y1, Y2)
                }
                onClick={(e) => {
                  e.target.select();
                }}
                ref={yInput}
                onKeyDown={handleOnKeyDownY}
                min={Y1}
                max={Y2}
              />
            </Col>
            <Col
              lg={12}
              xs={4}
              className="d-flex justify-content-center align-items-center mt-2"
            >
              <Button
                variant="warning"
                disabled={!valid}
                onClick={handleSubmit}
                className="fs-6 p-1 p-sm-2 px-sm-3"
              >
                Set flag
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>

    </>
  );
}

export default Game1;
