import React, { useState } from "react";
import DatePicker from "react-datepicker";
import * as FcIcons from 'react-icons/fc';
 
import "react-datepicker/dist/react-datepicker.css";

import './App.css'
function MyApp() {
  const [startDate, setStartDate] = useState(new Date());
  const ExampleCustomInput = ({ value, onClick }) => (
    <button className="bt btn" onClick={onClick}>
      <FcIcons.FcCalendar className='mr-3 menu-bars'/>
      {value}
    </button>
  );
  return (
    <DatePicker
      selected={startDate}
      onChange={date => setStartDate(date)}
      customInput={<ExampleCustomInput />}
    />
  );
};

export default MyApp
