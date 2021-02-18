import React from "react";
import { useState, useEffect } from "react";
import * as HiIcons from "react-icons/hi";
import * as MdIcons from "react-icons/md";
import ReactFlow from "react-flow-renderer";

const url = require("../components/urlConfig");

function Seatmap(props) {
  const [value, onChange] = useState(new Date());
  const [teacherIDState, setTeacherIDState] = useState(null);
  const [seatmapClassState, setSeatmapClassState] = useState({});
  const [seatMaps, setSeapMaps] = useState([]);
  const [profileModal, setProfileModal] = useState("");

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
        console.log(data);
        setSeapMaps(mySeatmaps);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const seatMapFetch = async (studentName) => {
    setProfileModal({
      studentID: "600610751",
      studentName: "ปวริศ",
      studentPhoto:
        "https://www.flaticon.com/svg/vstatic/svg/2922/2922688.svg?token=exp=1613653932~hmac=585891ff61ed8370ec9498751ae728ac",
      studentEmail: "basspleumdfr@gmail.com",
    });
    // await fetch(url.endpointWebApp + "/getSeatmapData", {
    //   method: "POST",
    //   headers: {
    //     Accept: "application/json",
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     studentName: studentName,
    //   }),
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log(data);
    //     setProfileModal({
    //       studentID: "600610751",
    //       studentName: "ปวริศ",
    //       studentPhoto: "",
    //       studentEmail: "basspleumdfr@gmail.com",
    //     });
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });
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
          <h3 className="head_text">แผนผังที่นั่ง</h3>
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
                            data-toggle="modal"
                            data-target="#profileStudent"
                            onClick={() => {
                              seatMapFetch(col);
                            }}
                          >
                            {col}
                          </button>
                        </div>
                      ) : (
                        <div>
                          <button type="button" className="btn emty_seat m-1">
                            <MdIcons.MdEventSeat style={{ color: "red" }} />
                          </button>
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
      <div className="modal fade" id="profileStudent">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title head_text">ข้อมูลนักศึกษา</h5>
            </div>
            <div className="container box_subject mt-4">
              <img src={profileModal.studentPhoto}></img>
            </div>
            <div className="m-5">
              <p>ชื่อนักศึกษา: {profileModal.studentName}</p>
              <p>รหัสนักศึกษา: {profileModal.studentID}</p>
              <p>อีเมลล์: {profileModal.studentEmail}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Seatmap;
