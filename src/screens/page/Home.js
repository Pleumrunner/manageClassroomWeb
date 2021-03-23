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
import firebase from "../../config/firebaseConfig";

const db = firebase.firestore();

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
  const [editMon, setEditMon] = useState(false);
  const [editTue, setEditTue] = useState(false);
  const [editWed, setEditWed] = useState(false);
  const [editThu, setEditThu] = useState(false);
  const [editFri, setEditFri] = useState(false);
  const [editSat, setEditSat] = useState(false);
  const [editSun, setEditSun] = useState(false);
  const [selectClassCurrentDate, setSelectClassCurrentDate] = useState(null);

  const [teacherIDState, setTeacherIDState] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [editClassStartDate, setEditClassStartDate] = useState(null);
  const [editClassEndDate, setEditClassEndDate] = useState(null);
  const [editClassDupDay, setEditClassDupDay] = useState(null);

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
    "รูปแบบการเช็คชื่อ",
    "รายละเอียด",
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

  // useEffect(() => {
  //   if (teacherIDState != null && selectedDate != null) {
  //     var mySessionData = [];
  //     const subscriber = db
  //       .collection("Classroom")
  //       .doc(teacherIDState)
  //       .collection("sessions")
  //       .onSnapshot((querySnapshot) => {
  //         // console.log("Total users: ", querySnapshot.size);

  //         querySnapshot.forEach((classData) => {
  //           // console.log(classData.id, classData.data());
  //           const myClassData = classData.data();
  //           const regisDateList = myClassData.registeredDay;
  //           if (regisDateList.includes(moment(selectedDate).format("YYYY-MM-DD").toString())) {
  //             // console.log(myClassData);
  //             mySessionData.push(myClassData);
  //           }
  //         });
  //         console.log(mySessionData);
  //         setSessionsData(mySessionData);
  //       });

  //     // Stop listening for updates when no longer required
  //     return () => subscriber();
  //   }
  // }, [selectedDate, teacherIDState]);

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

  // useEffect(() => {
  //   // if(sessionsData.length != 0){
  //   // setEditSun(sessionsData.duplicatedDay[0])
  //   // setEditMon(sessionsData.duplicatedDay[1])
  //   // setEditTue(sessionsData.duplicatedDay[2])
  //   // setEditWed(sessionsData.duplicatedDay[3])
  //   // setEditThu(sessionsData.duplicatedDay[4])
  //   // setEditFri(sessionsData.duplicatedDay[5])
  //   // setEditSat(sessionsData.duplicatedDay[6])
  //   // }
  //   console.log(sessionsData);
  // }, [sessionsData]);

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

  const removeClassAllDate = async (teacherID, uqClassID) => {
    console.log(teacherID, uqClassID);

    await fetch(url.endpointWebApp + "/removeClassAllDate", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uqID: uqClassID,
        teacherID: teacherID,
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
    console.log(
      editClassId,
      editClassName,
      editClassStartTime,
      editClassEndTime,
      editClassDesc,
      editClassSemester,
      editStartDate,
      editEndDate
    );
    console.log(editClassUqId, teacherIDState, [
      editSun,
      editMon,
      editThu,
      editWed,
      editThu,
      editFri,
      editSat,
    ]);
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
        editStartDate: moment(editStartDate).format("YYYY-MM-DD").toString(),
        editEndDate: moment(editEndDate).format("YYYY-MM-DD").toString(),
        editDupDay: [
          editSun,
          editMon,
          editThu,
          editWed,
          editThu,
          editFri,
          editSat,
        ],
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
              dateFormat="dd/MM/yyyy"
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
                      {t.duplicatedDay[0] == true ? <td>อา.</td> : null}
                      {t.duplicatedDay[1] == true ? <td>จ.</td> : null}
                      {t.duplicatedDay[2] == true ? <td>อ.</td> : null}
                      {t.duplicatedDay[3] == true ? <td>พ.</td> : null}
                      {t.duplicatedDay[4] == true ? <td>พฤ.</td> : null}
                      {t.duplicatedDay[5] == true ? <td>ศ.</td> : null}
                      {t.duplicatedDay[6] == true ? <td>ส.</td> : null}
                      {t.startTime} - {t.endTime}
                      <br/>
                      {moment(t.startDate).format("DD/MM/YYYY")} - {moment(t.endDate).format("DD/MM/YYYY")}
                    </td>
                    <td>{t.isLocationSet == true ? <td>ระบุสถานที่</td> : <td>ออนไลน์</td>}</td>
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
                          className="btn-warning btn mx-1"
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
                      {t.sessionStatus === -99 ? (
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
                            const dup = t.duplicatedDay;
                            setEditSun(dup[0]);
                            setEditMon(dup[1]);
                            setEditTue(dup[2]);
                            setEditWed(dup[3]);
                            setEditThu(dup[4]);
                            setEditFri(dup[5]);
                            setEditSat(dup[6]);
                            setEditStartDate(new Date(t.startDate));
                            setEditEndDate(new Date(t.endDate));
                          }}
                        >
                          แก้ไข
                        </button>
                      ) : (
                        <></>
                      )}
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
                        ยกเลิก
                      </button>
                      <button
                        type="button"
                        className="btn btn-dark mx-1"
                        data-toggle="modal"
                        data-target="#removeClassAll"
                        onClick={async () => {
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
                        ลบห้อง
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
            <div className="row g-3">
              <div className="col-5">
                <label
                  for="inputAddress"
                  className="form-label mt-3 ml-3 font_bold"
                >
                  วันที่เริ่มต้น
                </label>
                <div className="col-5 d-flex ml-5">
                  <DatePicker
                    dateFormat="dd/MM/yyyy"
                    selected={editStartDate}
                    onChange={(date) => {
                      let myDate = moment(date).format("YYYY-MM-DD").toString();
                      setEditStartDate(new Date(myDate));
                      console.log(myDate);
                    }}
                    customInput={<ExampleCustomInput />}
                  />
                </div>
              </div>
              <div className="col-6">
                <label for="inputAddress" className="form-label mt-3 font_bold">
                  วันที่สิ้นสุด
                </label>
                <div className="col-5 d-flex ml-5">
                  <DatePicker
                    dateFormat="dd/MM/yyyy"
                    selected={editEndDate}
                    onChange={(date) => {
                      let myDate = moment(date).format("YYYY-MM-DD").toString();
                      setEditEndDate(new Date(myDate));
                      console.log(myDate);
                    }}
                    customInput={<ExampleCustomInput />}
                  />
                </div>
              </div>
            </div>
            <label
              for="inputAddress"
              className="form-label mt-3 ml-3 font_bold"
            >
              ทำซ้ำวัน
            </label>
            <div className="row g-3 ml-5">
              <div className="form-check m-3 col-4">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={editMon}
                  onChange={(e) => setEditMon(e.target.checked)}
                  id="flexCheckMon"
                ></input>
                <label className="form-check-label" for="flexCheckMon">
                  วันจันทร์
                </label>
              </div>
              <div className="form-check m-3 col-4">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={editFri}
                  onChange={(e) => setEditFri(e.target.checked)}
                  id="flexCheckFri"
                ></input>
                <label className="form-check-label" for="flexCheckFri">
                  วันศุกร์
                </label>
              </div>
            </div>
            <div className="row g-3 ml-5">
              <div className="form-check m-3 col-4">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={editTue}
                  onChange={(e) => setEditTue(e.target.checked)}
                  id="flexCheckTue"
                ></input>
                <label className="form-check-label" for="flexCheckTue">
                  วันอังคาร
                </label>
              </div>
              <div className="form-check m-3 col-4">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={editSat}
                  onChange={(e) => setEditSat(e.target.checked)}
                  id="flexCheckSat"
                ></input>
                <label className="form-check-label" for="flexCheckSat">
                  วันเสาร์
                </label>
              </div>
            </div>
            <div className="row g-3 ml-5">
              <div className="form-check m-3 col-4">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={editWed}
                  onChange={(e) => setEditWed(e.target.checked)}
                  id="flexCheckWed"
                ></input>
                <label className="form-check-label" for="flexCheckWed">
                  วันพุธ
                </label>
              </div>
              <div className="form-check m-3 col-4">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={editSun}
                  onChange={(e) => setEditSun(e.target.checked)}
                  id="flexCheckSun"
                ></input>
                <label className="form-check-label" for="flexCheckSun">
                  วันอาทิตย์
                </label>
              </div>
            </div>
            <div className="row g-3 ml-5">
              <div className="form-check m-3 col-4">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={editThu}
                  onChange={(e) => setEditThu(e.target.checked)}
                  id="flexCheckThu"
                ></input>
                <label className="form-check-label" for="flexCheckThu">
                  วันพฤหัสบดี
                </label>
              </div>
            </div>
            <div className="container mt-3">
              <form className="row g-3">
                <div className="col-6">
                  <label for="inputAddress" className="form-label font_bold">
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
                  <label for="inputAddress" className="form-label font_bold">
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
                  <label for="inputAddress" className="form-label font_bold">
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
                  <label for="inputAddress" className="form-label font_bold">
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
                  <label for="inputAddress" className="form-label font_bold">
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
                  <label for="inputAddress" className="form-label font_bold">
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
              <h5 className="modal-title head_text">
                ยืนยันที่จะลบห้องเรียนวันที่{" "}
                {moment(selectClassCurrentDate).format("DD/MM/YYYY")}
              </h5>
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
      <div className="modal fade" id="removeClassAll">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title head_text">
                ยืนยันที่จะลบห้องเรียนทั้งหมด
              </h5>
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
                  console.log(teacherIDState, editClassUqId);
                  await removeClassAllDate(teacherIDState, editClassUqId);
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
