import React from "react";
import { useState, useEffect } from "react";
import * as HiIcons from "react-icons/hi";
import ReactFlow from "react-flow-renderer";

const url = require("../components/urlConfig");

function Seatmap(props) {
  const [value, onChange] = useState(new Date());
  const [teacherIDState, setTeacherIDState] = useState(null);
  const [seatmapClassState, setSeatmapClassState] = useState({});
  const [seatMaps, setSeapMaps] = useState([]);

  useEffect(() => {
    var teacherID = localStorage.getItem("teacherID");
    setTeacherIDState(teacherID);
  }, []);

  useEffect(() => {
    const fetchSeatmap = async () => {
      await seatmapClassAPI(
        teacherIDState,
        props.location.state.detailClass,
        props.location.state.selectedDate
      );
    };

    if (teacherIDState != null) fetchSeatmap();
  }, [teacherIDState]);

  const subject = [
    {
      id: "261457",
      name: "Digital & image",
      time: "18 Tue 18:00-19:30",
      room: "512",
      present: "16",
      absent: "4",
    },
  ];

  const seatmapClassAPI = async (teacherID, uqID, date) => {
    await fetch(url.endpointWebApp + "/getSeatmap", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uqID: uqID,
        teacherID: teacherID,
        date: date,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        let mySeatmaps = get2DArrayGraphs(data);
        console.log(mySeatmaps);
        console.log(data)
        setSeapMaps(mySeatmaps);
        // setSeatmapClassState();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const get2DArrayGraphs = (graphs) => {
    var myGraphs = [];
    for (let i = 0; i < graphs.length; i++) {
      var seatmapEachArr = graphs[i][`arr${i}`];
      var delX = 0;
      var delY = 0;
      seatmapEachArr.forEach((coodinate) => {
        let absX = Math.abs(coodinate.x);
        let absY = Math.abs(coodinate.y);
        if (absX > delX) {
          delX = absX;
        }
        if (absY > delY) {
          delY = absY;
        }
      });
      var arr = [];
      let rowSize = delY * 2 + 1;
      let columnSize = delX * 2 + 1;
      var num = delY;
      for (let i = 0; i < rowSize; i++) {
        let myArr = [];
        for (let j = 0; j < columnSize; j++) {
          let coo_X = j - delX;
          let coo_Y = i + num;
          let matchObj = seatmapEachArr.find(
            (x) => x.x == coo_X && x.y == coo_Y
          );
          if (matchObj != undefined) {
            myArr.push(matchObj.node);
          } else {
            myArr.push(" ");
          }
        }
        num -= 2;
        arr.push(myArr);
      }
      myGraphs.push({ [`graph${i}`]: arr, sumMax: delX + delY });
    }
    return myGraphs;
  };

  return (
    <div className="container-fluid pt-4">
      <div className="box">
        <div className="row">
          <h3 className="head_text">Seat Map</h3>
        </div>
        <div className="row mt-5">
          <div className="box_subject">
            <tr>
              <td>
                <tr>
                  <th className="p-1">{seatmapClassState.name}</th>
                  <th className="p-1">{seatmapClassState.id}</th>
                </tr>
                <tr>
                  {seatmapClassState.startTime} - {seatmapClassState.endTime}
                </tr>
                <tr>
                  room: {seatmapClassState.desc}
                  <th className="pl-5">
                    {seatmapClassState.present}
                    <HiIcons.HiUser style={{ color: "green" }} />
                    {seatmapClassState.absent}
                    <HiIcons.HiUser style={{ color: "red" }} />
                  </th>
                </tr>
              </td>
            </tr>
          </div>
          {seatMaps.map((seatmap, i) => (
            <div className="box" key={i}>
              {seatmap[`graph${i}`].map((row, j) => (
                <tr className="box_seatMap">
                  {row.map((col, k) => (
                    <td key={k}>
                      {col != " " ? (
                        <div>
                          <button
                            type="button"
                            className="btn btn-success m-1"
                          >
                            {col}
                          </button>
                        </div>
                      ) : (
                        <div>
                          <button
                            type="button"
                            className="btn btn-primary m-1"
                          ></button>
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Seatmap;
