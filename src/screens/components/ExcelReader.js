import React, { Component,useEffect } from "react";
import XLSX from "xlsx";
import { make_cols } from "./MakeColumns";
import { SheetJSFT } from "./types";

const url = require("../components/urlConfig");

class ExcelReader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: {},
      data: [],
      cols: [],
    };
    this.handleFile = this.handleFile.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  
  handleChange(e) {
    const files = e.target.files;
    if (files && files[0]) this.setState({ file: files[0] });
  }

  handleFile() {
    /* Boilerplate to set up FileReader */
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;

    reader.onload = (e) => {
      /* Parse data */
      const bstr = e.target.result;
      const wb = XLSX.read(bstr, {
        type: rABS ? "binary" : "array",
        bookVBA: true,
      });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_json(ws);

      var myData = []
      for(var i=6;i<data.length;i++){
        // console.log(data[i])
        myData.push({
          id:data[i]['__EMPTY'],
          name:data[i]['__EMPTY_1'] + ' ' + data[i]['__EMPTY_2'],
      })
      }
      console.log(myData)

      /* Update state */
      // this.setState({ data: data, cols: make_cols(ws["!ref"]) }, () => {
      //   // console.log(JSON.stringify(this.state.data, null, 2));
      //   // console.log('Test Set state')
      //   this._addStudentTestAPI(this.props.classData.uqID,this.props.classData.teacherID);
      // });
      this.setState({data:myData},() => {
        this._addStudentTestAPI(this.props.classData.uqID,this.props.classData.teacherID);
      })
    };

    if (rABS) {
      reader.readAsBinaryString(this.state.file);
    } else {
      reader.readAsArrayBuffer(this.state.file);
    }
  }

  async _addStudentTestAPI(classUqIDparam,teacherIDparam) {
    var uqID = classUqIDparam;
    var teacherID = teacherIDparam;
    var studentList = this.state.data;
    console.log(uqID);
    console.log(teacherID);
    console.log(studentList);
    await fetch(
      url.endpointWebApp + "/addNewStudents",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uqID: uqID,
          teacherID: teacherID,
          studentList: studentList,
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    return (
      <div>
        <label htmlFor="file">Upload an EXCEL or CSV</label>
        <br />
        <input
          type="file"
          className="form-control"
          id="file"
          accept={SheetJSFT}
          onChange={this.handleChange}
        />
        <br />
        <input
          type="submit"
          value="Process Triggers"
          onClick={this.handleFile}
        />
      </div>
    );
  }
}

export default ExcelReader;
