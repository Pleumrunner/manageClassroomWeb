import React from "react";
import { useState, useEffect } from "react";
import * as HiIcons from "react-icons/hi";
import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryPie,
  VictoryStack,
  VictoryPortal,
  VictoryLabel,
} from "victory";
const url = require("../components/urlConfig");


const [attClassState, setAttClassState] = useState({});

const attClassAPI = async (teacherID, uqID, date) => {
    await fetch(url.endpointWebApp + "/attendance", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        attClassUqID: uqID,
        attClassTeacherID: teacherID,
        attClassCurrentDate: date,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setAttClassState(data);
        setAttClassStudent(data.statistics);
      })
      .catch((error) => {
        console.error(error);
      });
  };

class App extends React.Component {

    constructor() {
      super();
      this.state = {};
    }
  
    handleZoom(domain) {
      this.setState({selectedDomain: domain});
    }
  
    handleBrush(domain) {
      this.setState({zoomDomain: domain});
    }
  
    render() {
      return (
        <div>
            <VictoryChart
              width={550}
              height={300}
              scale={{x: "time"}}
              containerComponent={
                <VictoryZoomContainer responsive={false}
                  zoomDimension="x"
                  zoomDomain={this.state.zoomDomain}
                  onZoomDomainChange={this.handleZoom.bind(this)}
                />
              }
            >
             <VictoryStack
                  colorScale={["green", "red"]}
                  style={{
                    data: { width: 20 },
                    labels: { padding: -20 },
                  }}
                  labelComponent={
                    <VictoryPortal>
                      <VictoryLabel />
                    </VictoryPortal>
                  }
                >
                  <VictoryBar
                    data={attClassState.statEachDate}
                    x="date"
                    y="present"
                    labels={({ datum }) => (datum.present ? datum.present : "")}
                    style={{ labels: { fill: "white" } }}
                  />
                  <VictoryBar
                    data={attClassState.statEachDate}
                    x="date"
                    y="absent"
                    labels={({ datum }) => (datum.absent ? datum.absent : "")}
                    style={{ labels: { fill: "white" } }}
                  />
                </VictoryStack>
                <VictoryAxis
                  label="Year-Month-Day"
                  style={{
                    axisLabel: { padding: 30 },
                    tickLabels: { fontSize: 8, padding: 5 },
                  }}
                />
                <VictoryAxis
                  dependentAxis
                  label="Present of Student"
                  style={{
                    axisLabel: { padding: 40 },
                  }}
                />
            </VictoryChart>

            <VictoryChart
            width={550}
            height={90}
            scale={{x: "time"}}
            padding={{top: 0, left: 50, right: 50, bottom: 30}}
            containerComponent={
              <VictoryBrushContainer responsive={false}
                brushDimension="x"
                brushDomain={this.state.selectedDomain}
                onBrushDomainChange={this.handleBrush.bind(this)}
              />
            }
          >
              <VictoryAxis
                  label="Year-Month-Day"
                  style={{
                    axisLabel: { padding: 30 },
                    tickLabels: { fontSize: 8, padding: 5 },
                  }}
                />
                <VictoryStack
                  colorScale={["green", "red"]}
                  style={{
                    data: { width: 20 },
                    labels: { padding: -20 },
                  }}
                  labelComponent={
                    <VictoryPortal>
                      <VictoryLabel />
                    </VictoryPortal>
                  }
                >
                  <VictoryBar
                    data={attClassState.statEachDate}
                    x="date"
                    y="present"
                    labels={({ datum }) => (datum.present ? datum.present : "")}
                    style={{ labels: { fill: "white" } }}
                  />
                  <VictoryBar
                    data={attClassState.statEachDate}
                    x="date"
                    y="absent"
                    labels={({ datum }) => (datum.absent ? datum.absent : "")}
                    style={{ labels: { fill: "white" } }}
                  />
                </VictoryStack>
          </VictoryChart>
        </div>
      );
    }
  }

  export default App;