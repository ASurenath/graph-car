import React, { Children, useEffect, useRef, useState } from "react";

function Graph({x1, x2, y1, y2, carX, carY, carAngle, flag, flagType, flagX, flagY, coordinates, paths,children }) {
  // const [boxHeight, setBoxHeight] = useState(1);
  // const [boxWidth, setBoxWidth] = useState(1);
  // const [carWidth, setCarWidth] = useState(1);
  // const [carHeight, setCarHeight] = useState(1);

  

  
  console.log();
  const graphBox = useRef(null);
  const findXPosPercent = (x) => {
    return `${((x - x1) / (x2 - x1)) * 100}%`;
  };
  const findYPosPercent = (y) => {
    return `${((y - y2) / (y1 - y2)) * 100}%`;
  };
  const findCarXPosPercent = (x) => {
    return `${(((x - x1-0.5) / (x2 - x1))) * 100}%`;
  };
  const findCarYPosPercent = (y) => {
    return `${(((y - y2+0.5) / (y1 - y2))) * 100}%`;
  }
  // const findPosPixel = (x,y) => {
  //    return [`${((x-x1)/(x2-x1))*boxWidth}px`,((y-y2)/(y1-y2))*boxHeight+'px']
  // }


  const renderXticks = () => {
    const ticks = [];
    for (let i = x1; i <= x2; i++) {
      i!=x1&&ticks.push(
        
          <text
            x={((i - x1) / (x2 - x1)) * 100 + "%"}
            y={findYPosPercent(0)}
            style={{ fontSize: "25px", fill: "white" }}
            key={`verticel-${i}`}
            dominantBaseline="text-before-edge"
            textAnchor="middle"
          >
            {i}
          </text>
        
      );
    }
    return ticks.map((tick) => tick);
  };
  const renderYticks = () => {
    const ticks = [];
    for (let i = y1; i <= y2; i++) {
      i!=y1 &&i!= 0&&ticks.push(
           (
            <text
              x={findXPosPercent(0)}
              y={((i - y2) / (y1 - y2)) * 100 + "%"}
              style={{
                fontSize: "25px",
                fill: "white",
                textAlign: "right",
                marginRight: "5px",
              }}
              key={`verticel-${i}`}
              alignmentBaseline="middle"
              textAnchor="end"
            >
              {i}
            </text>
          )
        
      );
    }
    return ticks.map((tick) => tick);
  };
  const renderVerticleLines = () => {
    const lines = [];
    for (let i = x1; i <= x2; i++) {
      i!=x1&&lines.push(
        
        <line
          x1={((i - x1) / (x2 - x1)) * 100 + "%"}
          y1={"0%"}
          x2={((i - x1) / (x2 - x1)) * 100 + "%"}
          y2={"100%"}
          style={{
            stroke:"white",
            strokeWidth: i == 0 ? 2 : 1,
            strokeDasharray: i != 0 ? "1 2" : "none",
          }}

          key={`verticel-${i}`}
        />
      );
    }
    return lines.map((line) => line);
  };
  const renderHorizentalLines = () => {
    const lines = [];
    for (let i = y1; i <= y2; i++) {
      i!=y1&&lines.push(
        <line
          x1={"0%"}
          y1={((i - y2) / (y1 - y2)) * 100 + "%"}
          x2={"100%"}
          y2={((i - y2) / (y1 - y2)) * 100 + "%"}
          style={{
            stroke:"white",
            strokeWidth: i == 0 ? 2 : 1,
            strokeDasharray: i != 0 ? "1 2" : "none",

          }}
          key={`horizental-${i}`}
        />
      );
    }
    return lines.map((line) => line);
  };

  return (
    <div
      id="graph-main"
      className="graph mx-auto"
      style={{ aspectRatio: `${x2 - x1}/${y2 - y1}` }}
      ref={graphBox}
    >
      <svg
        height="100%"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
      >
        {renderVerticleLines()}
        {renderHorizentalLines()}
        {renderXticks()}
        {renderYticks()}
        

{flag&&<>
<circle cx={findXPosPercent(flagX)} cy={findYPosPercent(flagY)} r="5" fill="white"/>
<image x={findXPosPercent(flagX)} y={findYPosPercent(flagY+0.7)} height={0.7/(x2-x1)*100+"%"} href={flagType=="final"?"finalflag.png":"flag.png"}/></>
}  

{coordinates.map((coordinate)=><React.Fragment key={`(${coordinate.x},${coordinate.y})`}> 
<circle cx={findXPosPercent(coordinate.x)} cy={findYPosPercent(coordinate.y)} r="5" fill={coordinate.color}/>
<text x={findXPosPercent(coordinate.x)} y={findYPosPercent(coordinate.y)} style={{fontSize:25}} fill={coordinate.color}>({coordinate.x},{coordinate.y})</text>
</React.Fragment>)}
{paths.map((path)=> <line key={`(${path.x1},${path.y1})to(${path.x2},${path.y2})`} x1={findXPosPercent(path.x1)} y1={findYPosPercent(path.y1)} x2={findXPosPercent(path.x2)} y2={findYPosPercent(path.y2)} style={{stroke:path.color,strokeWidth:3}}/>
)}
        <image
          x={findCarXPosPercent(carX)}
          y={findCarYPosPercent(carY)}
          height={1/(x2-x1)*100+"%"}
          href="car.png"
          style={{transform:`rotate(${carAngle}deg)`,
          transformOrigin: `${findCarXPosPercent(carX+0.5)} ${findCarYPosPercent(carY-0.5)}`}}
        />
      </svg>

      {children}
    </div>
  );
}

export default Graph;
