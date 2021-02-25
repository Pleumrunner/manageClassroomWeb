import React, { useState } from "react";
import ExportComponent from "./exportButtonNew";

const ReportTableRow = ({ t, idex, ...props }) => {
  const [teacherIDState, setTeacherIDState] = useState(null);
  const [selectedRowData, setSelectedRowData] = useState({});
  const [isReportCreate, setIsReportCreate] = useState(false);
  const [lateTime, setLateTime] = useState(null);
  const [absentTime, setAbsentTime] = useState(null);

  React.useEffect(() => {
    const techerID = localStorage.getItem("teacherID");
    setTeacherIDState(techerID);
  }, []);

  function handleSelectRowClick(t) {
    return new Promise((resolve, reject) => {
      var lateTime = document.getElementById(t.classUqID + "-" + "late");
      var absentTime = document.getElementById(t.classUqID + "-" + "absent");

      var strLateTime = lateTime.options[lateTime.selectedIndex].text;

      var strAbsentTime = absentTime.options[absentTime.selectedIndex].text;
      if (strAbsentTime == "ขาด") {
        strAbsentTime = null;
      }
      if (strLateTime == "สาย") {
        strLateTime = null;
      }
      console.log(`late: ${strLateTime} absent: ${strAbsentTime}`);
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
      resolve({
        uqID: t.classUqID,
        late: strLateTime,
        absent: strAbsentTime,
        teacherID: teacherIDState,
      });
    });
  }
  return (
    <>
      <tr>
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
            onChange={(evt) => setLateTime(evt.target.value)}
            id={t.classUqID + "-" + "late"}
          >
            <option selected>สาย</option>
            <option value={0}>0</option>
            <option value={15}>15</option>
            <option value={30}>30</option>
            <option value={45}>45</option>
          </select>
        </td>
        <td className="col-1">
          <select
            className="select-report"
            aria-label="Default select example"
            onChange={(evt) => setAbsentTime(evt.target.value)}
            id={t.classUqID + "-" + "absent"}
          >
            <option selected>ขาด</option>
            <option value={15}>15</option>
            <option value={30}>30</option>
            <option value={45}>45</option>
            <option value={59}>60</option>
          </select>
        </td>
        <div>
          <ExportComponent
            uqID={selectedRowData.uqID}
            lateTime={lateTime}
            absentTime={absentTime}
            teacherID={selectedRowData.teacherID}
            handleSelectRowClick={() => handleSelectRowClick(t)}
          />
        </div>
      </tr>
    </>
  );
};

export default ReportTableRow;
