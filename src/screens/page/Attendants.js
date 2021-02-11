import React from "react";
import { useState, useEffect } from "react";
import * as HiIcons from "react-icons/hi";
import * as MdIcons from "react-icons/md";
import * as BsIcons from "react-icons/bs";
// import Chart from "../components/chartAtt";
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


const moment = require("moment");

function Attandents(props) {
  const [value, onChange] = useState(new Date());
  const [isShowModal, setShowModal] = useState(false);
  const [studentNameModal, setStudentNameModal] = useState("");
  const [studentIDModal, setStudentIDModal] = useState("");
  const [teacherIDState, setTeacherIDState] = useState(null);
  const [attClassState, setAttClassState] = useState({});
  const [attClassStudent, setAttClassStudent] = useState([]);
  const [studentRemove, setStudentRemove] = useState();
  const [addStudentName, setAddStudentName] = useState(null);
  const [addStudentID, setAddStudentID] = useState(null);
  const [checkList, setCheckList] = useState([]);
  const [studentStatChart, setStudentStatChart] = useState({});

  useEffect(() => {
    var teacherID = localStorage.getItem("teacherID");
    setTeacherIDState(teacherID);
  }, []);

  useEffect(() => {
    const fetchAttendance = async () => {
      await attClassAPI(
        teacherIDState,
        props.location.state.detailClass,
        props.location.state.selectedDate
      );
    };

    if (teacherIDState != null) fetchAttendance();
  }, [teacherIDState]);

  const onChangeTextStudentID = (event) => {
    setAddStudentID(event.target.value);
    console.log(event.target.value);
  };
  const onChangeTextStudentName = (event) => {
    setAddStudentName(event.target.value);
    console.log(event.target.value);
  };

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

  const removeStudentList = async (uqID, teacherID, studentID) => {
    await fetch(url.endpointWebApp + "/removeStudentList", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        teacherID: teacherID,
        uqID: uqID,
        studentID: studentID,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const studentStat = async (uqID, studentID, teacherID) => {
    await fetch(url.endpointWebApp + "/studentReport", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        teacherID: teacherID,
        uqID: uqID,
        studentID: studentID,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setCheckList(data.myData);
        setStudentStatChart(data.studentStat);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const checkStudent = async (uqID, date, studentID, teacherID) => {
    console.log(studentID);
    await fetch(url.endpointWebApp + "/checkStudent", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        teacherID: teacherID,
        uqID: uqID,
        studentID: studentID,
        date: date,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const addStudent = async (uqID, studentID, studentName, teacherID) => {
    await fetch(url.endpointWebApp + "/addStudent", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        teacherID: teacherID,
        uqID: uqID,
        studentID: studentID,
        studentName: studentName,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const uncheckStudent = async (uqID, date, studentID, teacherID) => {
    console.log(studentID);
    await fetch(url.endpointWebApp + "/uncheckStudent", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        teacherID: teacherID,
        uqID: uqID,
        studentID: studentID,
        date: date,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const head = ["รหัสนักศึกษา", "ชื่อนักศึกษา", "เวลาที่เข้าเรียน", "สถานะ"];

  return (
    <div className="container-fluid pt-4">
      <div className="box">
        <h3 className="head_text">สถิติการเข้าห้อง</h3>
        <div className="row mt-5">
          <div className="col-5">
            <div className="box_subject">
              <tr>
                <td>
                  <tr>
                    <th className="p-1">{attClassState.name}</th>
                    <th className="p-1">{attClassState.id}</th>
                  </tr>
                  <tr>
                    เวลา:{attClassState.startTime} - {attClassState.endTime}
                  </tr>
                  <tr>
                    ห้องเรียน: {attClassState.desc}
                    <th className="pl-5">
                      {attClassState.present}
                      <HiIcons.HiUser style={{ color: "green" }} />
                      {attClassState.absent}
                      <HiIcons.HiUser style={{ color: "red" }} />
                    </th>
                  </tr>
                </td>
              </tr>
            </div>
            <div className="att_pei">
              <VictoryPie
                data={[
                  { x: "เข้าเรียน", y: attClassState.present },
                  { x: "ไม่เข้าเรียน", y: attClassState.absent },
                ]}
                width={300}
                colorScale={["green", "red"]}
              />
            </div>
          </div>
          <div className="col">
            <div className="att_css">
              <VictoryChart domainPadding={{ x: 20 }}>
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
                  label="ปี-เดือน-วัน"
                  style={{
                    axisLabel: { padding: 30 },
                    tickLabels: { fontSize: 8, padding: 5 },
                  }}
                />
                <VictoryAxis
                  dependentAxis
                  label="จำนวนนักศึกษา"
                  style={{
                    axisLabel: { padding: 40 },
                  }}
                />
              </VictoryChart>
            </div>
          </div>
        </div>
        <div className="row mt-5">
          <div className="row">
            <div className="col">
              <h3 className="head_text">รายชื่อนักศึกษา</h3>
            </div>
          </div>
          <div className="col mt-3 box">
            <table className="table table-secondary table-striped">
              <thead>
                {head.map((h, idx) => (
                  <th key={idx}>{h}</th>
                ))}
              </thead>
              <tbody>
                <tr>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Student ID"
                      aria-label="Student ID"
                      onChange={(evt) => onChangeTextStudentID(evt)}
                    ></input>
                  </td>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Name"
                      aria-label="Name"
                      onChange={(evt) => onChangeTextStudentName(evt)}
                    ></input>
                  </td>
                  <td className="col-2"></td>
                  <td className="col-2"></td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-success mx-1"
                      onClick={async (e) => {
                        await addStudent(
                          attClassState.uqID,
                          addStudentName,
                          addStudentID,
                          teacherIDState
                        );
                        await attClassAPI(
                          teacherIDState,
                          props.location.state.detailClass,
                          props.location.state.selectedDate
                        );
                      }}
                    >
                      เพิ่ม
                    </button>
                  </td>
                </tr>
                {attClassStudent.map((t, idx) => (
                  <tr key={idx}>
                    <td>{t.studentUqID}</td>
                    <td>{t.studentName}</td>
                    {t.timestamp == null ? (
                      <td>ยังไม่ได้เช็คชื่อ</td>
                    ) : (
                      <td>{t.timestamp}</td>
                    )}
                    {t.isChecked ? (
                      <td>
                        <button
                          className="btn btn-success mx-1"
                          onClick={async (e) => {
                            await uncheckStudent(
                              attClassState.uqID,
                              attClassState.currentDate,
                              t.studentID,
                              teacherIDState
                            );
                            await attClassAPI(
                              teacherIDState,
                              props.location.state.detailClass,
                              props.location.state.selectedDate
                            );
                          }}
                        >
                          ยกเลิกการเช็คชื่อ
                        </button>
                        <HiIcons.HiUser style={{ color: "green" }} />
                      </td>
                    ) : (
                      <td>
                        <button
                          className="btn btn-warning mx-1"
                          onClick={async (e) => {
                            await checkStudent(
                              attClassState.uqID,
                              attClassState.currentDate,
                              t.studentID,
                              teacherIDState
                            );
                            await attClassAPI(
                              teacherIDState,
                              props.location.state.detailClass,
                              props.location.state.selectedDate
                            );
                          }}
                        >
                          เช็คชื่อ
                        </button>
                        <HiIcons.HiUser style={{ color: "red" }} />
                      </td>
                    )}
                    <td>
                      <button
                        type="button"
                        className="btn btn-danger mx-1"
                        onClick={async () => {
                          await removeStudentList(
                            attClassState.uqID,
                            attClassState.teacherID,
                            t.studentID
                          );
                          await attClassAPI(
                            teacherIDState,
                            props.location.state.detailClass,
                            props.location.state.selectedDate
                          );
                        }}
                      >
                        ลบ
                      </button>
                      <button
                        className="btn btn-primary mx-1"
                        data-toggle="modal"
                        data-target="#exampleModal"
                        onClick={async (e) => {
                          setStudentNameModal(t.studentName);
                          setStudentIDModal(t.studentUqID);
                          await studentStat(
                            attClassState.uqID,
                            t.studentID,
                            teacherIDState
                          );
                        }}
                      >
                        ข้อมูลการเข้าเรียน
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="modal fade" id="exampleModal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title head_text" id="exampleModalLabel">
                {studentNameModal} {studentIDModal}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="att_pei">
                <VictoryPie
                  data={[
                    { x: "present", y: studentStatChart.present },
                    { x: "absent", y: studentStatChart.absent },
                  ]}
                  width={300}
                  colorScale={["green", "red"]}
                  labels={({ datum }) => `${datum.x}: ${datum.y}`}
                />
              </div>
              <tbody>
                <h3 className="head_text pt-3">Checking list</h3>
                {checkList.map((t, idx) => (
                  <tr className="check_list" key={idx}>
                    {t.date} ------ status -----{" "}
                    {t.classStatus == -1 ? (
                      <td>
                        Waiting
                        <BsIcons.BsStopwatchFill
                          style={{ color: "#FFCC33" }}
                          className="mx-1"
                        />
                      </td>
                    ) : t.isChecked ? (
                      <td>
                        {t.timestamp}
                        <MdIcons.MdCheckCircle
                          style={{ color: "green" }}
                          className="mx-1"
                        />
                      </td>
                    ) : (
                      <td>
                        {t.isChecked.toString()}
                        <HiIcons.HiMinusCircle
                          style={{ color: "red" }}
                          className="mx-1"
                        />
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Attandents;
