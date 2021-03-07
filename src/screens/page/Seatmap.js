import React from "react";
import { useState, useEffect } from "react";
import * as HiIcons from "react-icons/hi";
import * as MdIcons from "react-icons/md";
import firebase from "../../config/firebaseConfig";

const db = firebase.firestore();
const myStorage = firebase.storage();
const url = require("../components/urlConfig");

const moment = require("moment");

function Seatmap(props) {
  const [value, onChange] = useState(new Date());
  const [teacherIDState, setTeacherIDState] = useState(null);
  const [seatmapClassState, setSeatmapClassState] = useState({});
  const [seatMaps, setSeapMaps] = useState([]);
  const [profileModal, setProfileModal] = useState("");

  // useEffect(() => {
  //   db.collection("Students")
  //     .get()
  //     .then((querySnapshot) => {
  //       querySnapshot.forEach((doc) => {
  //         console.log(`${doc.id} => ${doc.data()}`);
  //       });
  //     });
  // }, []);

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
      await setDataClass(
        teacherIDState,
        props.location.state.detailClass,
        props.location.state.selectedDate
      );
    };

    if (teacherIDState != null) fetchSeatmap();
  }, [teacherIDState]);

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
        setSeatmapClassState(data);

        let mySeatmaps = get2DArrayGraphs(data);
        mySeatmaps.sort((a, b) => {
          return b.sumMax - a.sumMax;
        });
        mySeatmaps.forEach((element, idx) => {
          const graphKey = Object.keys(element)[0];
          element[`graph${idx}`] = element[graphKey];
          if (graphKey != `graph${idx}`) {
            delete element[graphKey];
          }
        });
        console.log(mySeatmaps);
        setSeapMaps(mySeatmaps);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const setDataClass = async (teacherID, uqID, date) => {
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
        setSeatmapClassState(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const seatMapFetch = async (studentName) => {
    const stID = studentName;
    let stUqID = "";
    let stMail = "";
    let stPhotoURL = "";

    myStorage
      .ref(stID)
      .getDownloadURL()
      .then(
        (foundURL) => {
          console.log(foundURL);
          stPhotoURL = foundURL;
        },
        (error) => {
          stPhotoURL =
            "https://reg.mcu.ac.th/wp-content/uploads/2018/02/profileMen-1.png";
        }
      )
      .then(() => {
        db.collection("Students")
          .doc(stID)
          .get()
          .then((querySnapshot) => {
            let stData = querySnapshot.data();
            stUqID = stData.uqID;
            stMail = stData.mail;
            if (stMail == undefined) stMail = "ไม่ได้ระบุ";
          })
          .then(() => {
            setProfileModal({
              studentID: stUqID,
              studentName: studentName,
              studentPhoto: stPhotoURL,
              studentEmail: stMail,
            });
          });
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
          <h3 className="head_text">แผนผังที่นั่ง</h3>
        </div>
        <div className="row mt-5">
          <div className="box_subject">
            <tr>
              <td>
                <tr>
                  <th className="p-1">ชื่อวิชา: {seatmapClassState.name}</th>
                  <th className="p-1">รหัสวิชา: {seatmapClassState.id}</th>
                </tr>
                <tr>
                  <th>
                    เวลา: {seatmapClassState.startTime} -{" "}
                    {seatmapClassState.endTime}
                  </th>
                </tr>
                <tr>
                  <th> วันที่: {moment(seatmapClassState.currentDate).format("DD/MM/YYYY").toString()}</th>
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
