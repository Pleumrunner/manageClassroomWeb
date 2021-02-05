import React from "react";
import { useState, useEffect } from "react";
import * as FaIcons from "react-icons/fa";
import { Link } from "react-router-dom";
import "./Navbar.css";

export function Navbarnew() {
  const [teacherIDState, setTeacherIDState] = useState(null);

  useEffect(() => {
    var teacherID = localStorage.getItem("teacherID");
    setTeacherIDState(teacherID);
    console.log(teacherIDState);
  }, [teacherIDState]);

  return (
    <div className="navbar_pleum">
      <div className="rounded float-right">
        <th>
          <td className="mt-4">
            <h6>{teacherIDState}</h6>
          </td>
          <td>
            <Link to="/login" className="menu-bars-user">
              <FaIcons.FaUserCircle style={{ color: "fff" }} />
            </Link>
          </td>
        </th>
      </div>
    </div>
  );
}

export default Navbarnew;
