import React from 'react'



export default function reportRow(props) {

    return (
        <div>
            
            <h1>{props.uqID}</h1>
        </div>
    )
}

// {reportClass.map((t, idex) => (
//     <tr key={idex}>
//       <td>{t.classID}</td>
//       <td>{t.className}</td>
//       <td>
//         {t.classStartTime} - {t.classEndTime}
//       </td>
//       <td>{t.classDesc}</td>
//       <td className="col-1">
//         <select
//           className="select-report"
//           aria-label="Default select example"
//           onChange={(evt) => onChangeEditLateTime(evt)}
//           id={t.uqID+'-'+'late'}
//         >
//           <option selected>สาย</option>
//           <option value="0">0</option>
//           <option value="15">15</option>
//           <option value="30">30</option>
//           <option value="45">45</option>
//         </select>
//       </td>
//       <td className="col-1">
//         <select
//           className="select-report"
//           aria-label="Default select example"
//           onChange={(evt) => onChangeEditAbsentTime(evt)}
//         >
//           <option selected>ขาด</option>
//           <option value="15">15</option>
//           <option value="30">30</option>
//           <option value="45">45</option>
//           <option value="59">60</option>
//         </select>
//       </td>
//       <div>
//         {/* <ExportComponent
//           uqID={t.classUqID}
//           lateTime={editLateTime}
//           absentTime={editAbsentTime}
//           teacherID={teacherIDState}
//         /> */}
//         <button
//           type="button"
//           className="btn btn-danger"
//           onClick={(e) => {
//             // setClassName(t.className)
//             // setClassId(t.classID)
//             // setStartTime(t.classStartTime)
//             // setEndTime(t.classEndTime)
//             // setClassRoom(t.classDesc)
//             // setLate(editLateTime)
//             // setAbsent(editAbsentTime)
//             // console.log(t.className,t.classID,t.classStartTime,t.classEndTime,t.classDesc)
//             // reply_click(this)
//             // console.log(e.)
//             // var e = document.getElementById(t.uqID+'-'+'late');
//             // var strUser = e.options[e.selectedIndex].text;
//             // console.log(strUser)
//           }}
          
//         >
//           test
//         </button>
//       </div>
//     </tr>
//   ))}