import React from "react";
import { useState, useEffect} from "react";
import * as FcIcons from "react-icons/fc";
import "react-datepicker/dist/react-datepicker.css";
import "../components/App.css";
import ExcelReader from "../components/ExcelReader";
import DatePicker from "react-datepicker";

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

  const [removeClass, setRemoveClass] = useState({uqID:null,date:null});

  const [teacherIDState, setTeacherIDState] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const ExampleCustomInput = ({ value, onClick }) => (
    <button className="bt btn" onClick={onClick}>
      <FcIcons.FcCalendar className="mr-3 menu-bars" />
      {value}
    </button>
  );
  const head = [
    "Session ID",
    "Name",
    "Time",
    "Room",
    "Semester",
    "Status",
    "Management",
  ];
  const papaparseOptions = {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.toLowerCase().replace(/\W/g, "_"),
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setcurrentDate(moment(new Date()).format("YYYY-MM-DD").toString())
      setcurrentTime(moment(new Date()).format("HH:mm").toString())
      fetchClassAPI()
      console.log('This will run every second!');
    }, 60000);
    return () => clearInterval(interval);
  }, [sessionsData]);

  useEffect(() => {
    var teacherID = localStorage.getItem("teacherID");
    setTeacherIDState(teacherID);
    console.log(selectedDate);
    console.log(teacherIDState);

    if(teacherIDState!=null)
    fetchClassAPI();

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

  const removeClassByDate = async (uqID,date) => {
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
  } 

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
          <h3 className="head_text">My Classroom</h3>
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
                      <td style={{ color: "orange" }}>Waiting</td>
                    ) : t.sessionStatus == 0 ? (
                      <td style={{ color: "green" }}>Openning</td>
                    ) : t.sessionStatus == 1 ? (
                      <td style={{ color: "red" }}>Closed</td>
                    ) : (
                      <td style={{ color: "blue" }}>In progress</td>
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
                          Import Student
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-success mx-1"
                          onClick={() => {
                            props.history.push({
                              pathname: '/Attendants',
                              state: { 
                                detailClass: t.uqID,
                                selectedDate: t.currentDate
                              }
                            })
                            }
                          }
                        >
                          Attendance
                        </button>
                      )}
                      {(t.sessionStatus === 0 || t.sessionStatus === 1) ? (
                        <button
                          type="button"
                          className="btn btn-primary mx-1"
                          onClick={() => {
                            props.history.push({
                              pathname: '/seatmap',
                              state: { 
                                detailClass: t.uqID,
                                selectedDate: t.currentDate
                              }
                            })
                            }
                          }
                        >
                          Seatmap
                        </button>
                      ):(null)}
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
                         }
                        }
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger mx-1"
                        onClick={async () => {
                          await removeClassByDate(t.uqID,t.currentDate);
                          await fetchClassAPI()
                        }}
                      >
                        Remove
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
              <h5 className="modal-title head_text">Import students</h5>
            </div>
            <ExcelReader classData={selectedClassData} />
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-success"
                data-dismiss="modal"
                onClick={() => fetchClassAPI()}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="editModal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title head_text">Edit Session</h5>
            </div>
            <div className="container mt-3">
              <form className="row g-3">
                <div className="col-6">
                  <label for="inputAddress" className="form-label">
                    Session ID
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
                    Session name
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
                    Start time
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
                    End time
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
                    Room
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
                    Semester
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
                    await editClassDetail()
                    await fetchClassAPI()
                  }}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
