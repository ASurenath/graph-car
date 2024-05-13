import { useEffect, useState } from "react";
import "./App.css";
import Graph from "./components/Graph";
import { Button, Col, OverlayTrigger, Popover, Row } from "react-bootstrap";
import Game1 from "./components/Game1";
import Game2 from "./components/Game2";

const popover = (
  <Popover data-bs-theme="dark">
    <Popover.Header as="h3" className="text-white">How to play</Popover.Header>
    <Popover.Body>
      Select the game and follow the flags by entering their coordinates and
      pressing Enter (or click on 'Go')
    </Popover.Body>
  </Popover>
);
function App() {
  const [page, setPage] = useState("menu");

  return (
    <div className="App bg-success m-0 " style={{ minHeight: "100vh" }}>
      {page == "menu" && (
        <div
          className="d-flex flex-column justify-content-center align-items-center"
          style={{ minHeight: "100vh" }}
        >
          <h1 className="text-white">
            Coordinate race <i className="fa-solid fa-car-side"></i>
          </h1>
          <Button variant="success" onClick={() => setPage("game1-positive")}>
            Positive quadrant
          </Button>
          <Button variant="success" onClick={() => setPage("game1-all")}>All quadrants</Button>
          <OverlayTrigger trigger="click" placement="right" overlay={popover}>
            <Button>
              {" "}
              <i className="fa-solid fa-question"></i>
            </Button>
          </OverlayTrigger>
        </div>
      )}
      {page == "game1-positive" && (
        <Game2 X1={0} X2={10} Y1={0} Y2={10} setPage={setPage} />
      )}
      {page == "game1-all" && (
        <Game2 X1={-5} X2={5} Y1={-5} Y2={5} setPage={setPage} />
      )}
    </div>
  );
}

export default App;
