import React from "react";
import { useState, useEffect } from "react";
import ReportTableRow from '../components/ReportTableRow'
import ExportComponent from "../components/exportButtonNew";
import ReportRow from "../components/reportRow";
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

  const [selectedRowData, setSelectedRowData] = useState({});
  const [isReportCreate, setIsReportCreate] = useState(false);

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

  function handleSelectRowClick(e , t){
    var lateTime = document.getElementById(
      t.classUqID + "-" + "late"
    );
    var absentTime = document.getElementById(
      t.classUqID + "-" + "absent"
    );

    var strLateTime =
      lateTime.options[lateTime.selectedIndex].text;

    var strAbsentTime =
      absentTime.options[absentTime.selectedIndex].text;
    if (strAbsentTime == "ขาด") {
      strAbsentTime = null;
    }
    if (strLateTime == "สาย") {
      strLateTime = null;
    }
    console.log(
      `late: ${strLateTime} absent: ${strAbsentTime}`
    );
    console.log(
      t.className,
      t.classID,
      t.classStartTime,
      t.classEndTime,
      t.classDesc
    );

    setSelectedRowData({
      uqID: t.classUqID,
      late: strLateTime,
      absent: strAbsentTime,
      teacherID: teacherIDState,
    });
    setIsReportCreate(true);
  }

  return (
    <div className="container-fluid pt-4 ">
      <div className="box">
        <h3 className="head_text">สร้างรายงาน</h3>
        <div className="box mt-5">
          <h4 className="head_text">
            <select
              className="form-select form-select-lg mb-3"
              aria-label="Default select example"
              onChange={(e) => handleChange(e)}
            >
              <option selected>กรุณาเลือกภาคการศึกษา</option>
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
                  {
                  reportClass.map((t, idex) => (
                    <ReportTableRow 
                      key={idex}
                      t = {t}
                      idex = {idex}
                    />
                  ))
                  }
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
