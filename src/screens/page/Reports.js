import React from "react";
import { useState, useEffect } from "react";
import ExportComponent from "../components/exportButtonNew";
const url = require("../components/urlConfig");

function Reports(props) {
  const [value, onChange] = useState(new Date());
  const [reportClass, setReportClass] = useState([]);
  const [semester, setSemester] = useState("");
  const [teacherIDState, setTeacherIDState] = useState(null);
  const [editLateTime, setEditLateTime] = useState(null);
  const [editAbsentTime, setEditAbsentTime] = useState(null);
  const [isShowExportButton, setIsShowExportButton] = useState(false);

  const [selectedClassData, setSelectedClassData] = useState(null);

  useEffect(() => {
    if (
      selectedClassData != null &&
      editLateTime != null &&
      editAbsentTime != null
    ) {
      console.log(selectedClassData, editLateTime, editAbsentTime);
      setIsShowExportButton(true);
    }
  }, [selectedClassData, editLateTime, editAbsentTime]);

  useEffect(() => {
    var teacherID = localStorage.getItem("teacherID");
    setTeacherIDState(teacherID);
  }, []);

  useEffect(() => {
    if (semester != "") reportClassAPI(teacherIDState);
  }, [teacherIDState, semester]);

  const head = [
    "รหัสวิชา",
    "ชื่อวิชา",
    "เวลาเรียน",
    "ห้องเรียน",
    "สาย",
    "ขาด",
    "ออกเอกสาร",
  ];

  const reportClassAPI = async (teacherID) => {
    await fetch(url.endpointWebApp + "/getClassReport", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        teacherID: teacherID,
        semester: semester,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setReportClass(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleChange = (event) => {
    setSemester(event.target.value);
  };

  const onChangeEditLateTime = (event) => {
    setEditLateTime(event.target.value);
    console.log(event.target.value);
  };

  const onChangeEditAbsentTime = (event) => {
    setEditAbsentTime(event.target.value);
    console.log(event.target.value);
  };

  return (
    <div className="container-fluid pt-4 ">
      <div style={{ backgroundColor: "red" }}></div>
      <div className="box">
        <h3 className="head_text">ออกรายงาน</h3>
        <div className="box mt-5">
          <h4 className="head_text">
            <select
              className="form-select form-select-lg mb-3"
              aria-label="Default select example"
              onChange={(e) => handleChange(e)}
            >
              <option selected>กรุณาเรื่องภาคการศึกษา</option>
              <option value="2/2563">2/2563</option>
              <option value="1/2563">1/2563</option>
              <option value="2/2562">2/2562</option>
            </select>
          </h4>
          <div className="row mt-5">
            <div className="col">
              <table className="table table-secondary table-striped">
                <thead>
                  {head.map((h, idx) => (
                    <th key={idx}>{h}</th>
                  ))}
                </thead>
                <tbody>
                  {reportClass.map((t, idex) => (
                    <tr key={idex}>
                      <td>{t.classID}</td>
                      <td>{t.className}</td>
                      <td>
                        {t.classStartTime} - {t.classEndTime}
                      </td>
                      <td>{t.classDesc}</td>
                      <td className="col-1">
                        <select
                          className="select-report"
                          aria-label="Default select example"
                          onChange={(evt) => onChangeEditLateTime(evt)}
                        >
                          <option selected>สาย</option>
                          <option value="0">0</option>
                          <option value="15">15</option>
                          <option value="30">30</option>
                          <option value="45">45</option>
                        </select>
                      </td>
                      <td className="col-1">
                        <select
                          className="select-report"
                          aria-label="Default select example"
                          onChange={(evt) => onChangeEditAbsentTime(evt)}
                        >
                          <option selected>ขาด</option>
                          <option value="15">15</option>
                          <option value="30">30</option>
                          <option value="45">45</option>
                          <option value="59">60</option>
                        </select>
                      </td>
                      <div>
                        <ExportComponent
                          uqID={t.classUqID}
                          lateTime={editLateTime}
                          absentTime={editAbsentTime}
                          teacherID={teacherIDState}
                        />
                      </div>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;
{
  /* <ExportComponent uqID={t.classUqID} lateTime={editLateTime} absentTime={editAbsentTime} /> */
}

