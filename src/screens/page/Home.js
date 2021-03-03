import React, { Component } from "react";
import { useState, useEffect } from "react";
import * as FcIcons from "react-icons/fc";
import "react-datepicker/dist/react-datepicker.css";
import "../components/App.css";
import ExcelReader from "../components/ExcelReader";
import DatePicker from "react-datepicker";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file

const url = require("../components/urlConfig");

const moment = require("moment");

function Home(props) {
  const [value, onChange] = useState(new Date());
  const [currentDate, setcurrentDate] = useState(
    moment(new Date()).format("YYYY-MM-DD").toString()
  );
  const [currentTime, setcurrentTime] = useState(
    moment(new Date()).format("HH:mm").toString()
  );
  const [sessionsData, setSessionsData] = useState([]);
  const [selectedClassData, setSelectClassData] = useState({});

  const [editClassName, setEditClassName] = useState(null);
  const [editClassId, setEditClassId] = useState(null);
  const [editClassStartTime, setEditClassStartTime] = useState(null);
  const [editClassEndTime, setEditClassEndTime] = useState(null);
  const [editClassDesc, setEditClassDesc] = useState(null);
  const [editClassSemester, setEditClassSemester] = useState(null);
  const [editClassUqId, setEditClassUqId] = useState(null);
  const [editStartDate, setEditStartDate] = useState(new Date());
  const [editEndDate, setEditEndDate] = useState(new Date());
  const [selectClassCurrentDate, setSelectClassCurrentDate] = useState(null);

  const [teacherIDState, setTeacherIDState] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const ExampleCustomInput = ({ value, onClick }) => (
    <button className="bt btn" onClick={onClick}>
      <FcIcons.FcCalendar className="mr-3 menu-bars" />
      {value}
    </button>
  );

  const head = [
    "รหัสวิชา",
    "ชื่อวิชา",
    "เวลา",
    "ห้องเรียน",
    "ภาคการศึกษา",
    "สถานะห้องเรียน",
    "การจัดการ",
  ];
  const papaparseOptions = {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.toLowerCase().replace(/\W/g, "_"),
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setcurrentDate(moment(new Date()).format("YYYY-MM-DD").toString());
      setcurrentTime(moment(new Date()).format("HH:mm").toString());
      fetchClassAPI();
      console.log("This will run every second!");
    }, 60000);
    return () => clearInterval(interval);
  }, [sessionsData]);

  useEffect(() => {
    var teacherID = localStorage.getItem("teacherID");
    setTeacherIDState(teacherID);
    console.log(selectedDate);
    console.log(teacherIDState);

    if (teacherIDState != null) fetchClassAPI();
  }, [selectedDate, teacherIDState]);

  const onChangeTextClassID = (event) => {
    setEditClassId(event.target.value);
    console.log(event.target.value);
  };
  const onChangeTextClassName = (event) => {
    setEditClassName(event.target.value);
    console.log(event.target.value);
  };
  const onChangeTextClassStartTime = (event) => {
    setEditClassStartTime(event.target.value);
    console.log(event.target.value);
  };
  const onChangeTextClassEndTime = (event) => {
    setEditClassEndTime(event.target.value);
    console.log(event.target.value);
  };
  const onChangeTextClassDesc = (event) => {
    setEditClassDesc(event.target.value);
    console.log(event.target.value);
  };
  const onChangeTextClassSemester = (event) => {
    setEditClassSemester(event.target.value);
    console.log(event.target.value);
  };

  const removeClassByDate = async (uqID, date) => {
    await fetch(url.endpointWebApp + "/cancelSession", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        teacherID: teacherIDState,
        uqID: uqID,
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

  const fetchClassAPI = async () => {
    var teacherID = teacherIDState;
    var date = moment(selectedDate).format("YYYY-MM-DD").toString();

    await fetch(
      url.endpointWebApp +
        "/getSession?date=" +
        date +
        "&teacherID=" +
        teacherID +
        "&clientCurrentTime=" +
        currentTime +
        "&clientCurrentDate=" +
        currentDate
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setSessionsData(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const editClassDetail = async () => {
    await fetch(url.endpointWebApp + "/editClassDetail", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        editClassId: editClassId,
        editClassName: editClassName,
        editClassStartTime: editClassStartTime,
        editClassEndTime: editClassEndTime,
        editClassDesc: editClassDesc,
        editClassSemester: editClassSemester,
        editStartDate: editStartDate,
        editEndDate: editEndDate,
        ClassUqId: editClassUqId,
        ClassTeacherId: teacherIDState,
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

  return (
    <div className="container-fluid pt-4">
      <div className="box">
        <div className="row">
          <h3 className="head_text">รายวิชาที่เปิดสอน</h3>
          <div className="col-5 d-flex mt-3">
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              customInput={<ExampleCustomInput />}
            />
          </div>
        </div>
        <div className="row mt-5">
          <div className="col">
            <table className="table table-secondary table-striped">
              <thead>
                {head.map((h, idx) => (
                  <th key={idx}>{h}</th>
                ))}
              </thead>
              <tbody>
                {sessionsData.map((t, idx) => (
                  <tr key={idx}>
                    <td>{t.id}</td>
                    <td>{t.name}</td>
                    <td>
                      {t.startTime}-{t.endTime}
                    </td>
                    <td>{t.desc}</td>
                    <td>{t.semester}</td>
                    {t.sessionStatus == -1 ? (
                      <td style={{ color: "orange" }}>รอเปิดทำการเช็คชื่อ</td>
                    ) : t.sessionStatus == 0 ? (
                      <td style={{ color: "green" }}>เปิดทำการเช็คชื่อแล้ว</td>
                    ) : t.sessionStatus == 1 ? (
                      <td style={{ color: "red" }}>ปิดทำการเช็คชื่อแล้ว</td>
                    ) : (
                      <td style={{ color: "blue" }}>
                        กรุณาเพิ่มรายชื่อนักศึกษา
                      </td>
                    )}
                    <td>
                      {t.sessionStatus === -99 ? (
                        <button
                          data-toggle="modal"
                          className="btn-warning btn"
                          data-target="#importStudentModal"
                          onClick={() =>
                            setSelectClassData({
                              uqID: t.uqID,
                              teacherID: t.teacherID,
                            })
                          }
                        >
                          เพิ่มรายชื่อนักศึกษา
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-success mx-1"
                          onClick={() => {
                            props.history.push({
                              pathname: "/Attendants",
                              state: {
                                detailClass: t.uqID,
                                selectedDate: t.currentDate,
                              },
                            });
                          }}
                        >
                          สถิติการเข้าห้อง
                        </button>
                      )}
                      {t.sessionStatus === 0 || t.sessionStatus === 1 ? (
                        <button
                          type="button"
                          className="btn btn-primary mx-1"
                          onClick={() => {
                            props.history.push({
                              pathname: "/seatmap",
                              state: {
                                detailClass: t.uqID,
                                selectedDate: t.currentDate,
                              },
                            });
                          }}
                        >
                          แผนผังที่นั่ง
                        </button>
                      ) : null}
                      <button
                        type="button"
                        className="btn btn-info mx-1"
                        data-toggle="modal"
                        data-target="#editModal"
                        onClick={() => {
                          setEditClassId(t.id);
                          setEditClassName(t.name);
                          setEditClassDesc(t.desc);
                          setEditClassStartTime(t.startTime);
                          setEditClassEndTime(t.endTime);
                          setEditClassSemester(t.semester);
                          setEditClassUqId(t.uqID);
                        }}
                      >
                        แก้ไขข้อมูลห้อง
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger mx-1"
                        data-toggle="modal"
                        data-target="#removeClass"
                        onClick={() => {
                          setEditClassId(t.id);
                          setEditClassName(t.name);
                          setEditClassDesc(t.desc);
                          setEditClassStartTime(t.startTime);
                          setEditClassEndTime(t.endTime);
                          setEditClassSemester(t.semester);
                          setEditClassUqId(t.uqID);
                          setSelectClassCurrentDate(t.currentDate);
                        }}
                      >
                        ลบห้องเช็คชื่อ
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="modal fade" id="importStudentModal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title head_text">เพิ่มรายชื่อนักศึกษา</h5>
            </div>
            <h5 className="mx-2">กรุณาใส่ไฟล์ชื่อนักศึกษาภาษาอังกฤษ</h5>
            <ExcelReader className="m-2" classData={selectedClassData} />
            <h5 className="mx-2">กรุณาใส่ไฟล์ชื่อนักศึกษาภาษาไทย</h5>
            <ExcelReader className="m-2" classData={selectedClassData} />
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-success"
                data-dismiss="modal"
                onClick={() => fetchClassAPI()}
              >
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="editModal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title head_text">แก้ไขข้อมูลห้อง</h5>
            </div>
            <div className="col-6">
              <label for="inputAddress" className="form-label mt-3 ml-3">
                ต้องการเปิดห้องเรียน
              </label>
              <div className="col-5 d-flex ml-5">
                <DatePicker
                  selected={editStartDate}
                  onChange={(date) => {
                    let myDate = moment(date).format("YYYY-MM-DD").toString();
                    setEditStartDate(myDate);
                    console.log(myDate)
                  }}
                  customInput={<ExampleCustomInput />}
                />
              </div>
            </div>
            <div className="col-6">
              <label for="inputAddress" className="form-label mt-3 ml-3">
                ต้องการปิดห้องเรียน
              </label>
              <div className="col-5 d-flex ml-5">
                <DatePicker
                  selected={editEndDate}
                  onChange={(date) => {
                    let myDate = moment(date).format("YYYY-MM-DD").toString();
                    setEditEndDate(myDate)
                    console.log(myDate)
                  }}
                  customInput={<ExampleCustomInput />}
                />
              </div>
            </div>
            <div className="container mt-3">
              <form className="row g-3">
                <div className="col-6">
                  <label for="inputAddress" className="form-label">
                    รหัสวิชา
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="inputAddress"
                    value={editClassId}
                    onChange={(evt) => onChangeTextClassID(evt)}
                  ></input>
                </div>
                <div className="col-6">
                  <label for="inputAddress" className="form-label">
                    ชื่อวิชา
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="inputAddress"
                    value={editClassName}
                    onChange={(evt) => onChangeTextClassName(evt)}
                  ></input>
                </div>
                <div className="col-6">
                  <label for="inputAddress" className="form-label">
                    เวลาเรียน
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="inputAddress"
                    value={editClassStartTime}
                    onChange={(evt) => onChangeTextClassStartTime(evt)}
                  ></input>
                </div>
                <div className="col-6">
                  <label for="inputAddress" className="form-label">
                    เวลาเลิกเรียน
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="inputAddress"
                    value={editClassEndTime}
                    onChange={(evt) => onChangeTextClassEndTime(evt)}
                  ></input>
                </div>
                <div className="col-6">
                  <label for="inputAddress" className="form-label">
                    ห้องเรียน
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="inputAddress"
                    value={editClassDesc}
                    onChange={(evt) => onChangeTextClassDesc(evt)}
                  ></input>
                </div>
                <div className="col-6">
                  <label for="inputAddress" className="form-label">
                    ภาคการศึกษา
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="inputAddress"
                    value={editClassSemester}
                    onChange={(evt) => onChangeTextClassSemester(evt)}
                  ></input>
                </div>
              </form>
              <div className="modal-footer mt-3">
                <button
                  type="button"
                  className="btn btn-success"
                  data-dismiss="modal"
                  onClick={async () => {
                    await editClassDetail();
                    await fetchClassAPI();
                  }}
                >
                  ยืนยัน
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="removeClass">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title head_text">ยืนยันที่จะลบห้องเรียน</h5>
            </div>
            <div className="box mt-3">
              <h6>รหัสวิชา: {editClassId}</h6>
              <h6>ชื่อวิชา: {editClassName}</h6>
              <h6>
                เวลา: {editClassStartTime} - {editClassEndTime}
              </h6>
              <h6>ห้องเรียน: {editClassDesc}</h6>
              <h6>ภาคการศึกษา: {editClassSemester}</h6>
            </div>
            <div className="modal-footer mt-3">
              <button
                type="button"
                className="btn btn-success"
                data-dismiss="modal"
                onClick={async () => {
                  await removeClassByDate(
                    editClassUqId,
                    selectClassCurrentDate
                  );
                  await fetchClassAPI();
                }}
              >
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
