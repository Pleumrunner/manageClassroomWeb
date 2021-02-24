
import * as React from "react";
import {
  ExcelExport,
  ExcelExportColumn,
  ExcelExportColumnGroup,
} from "@progress/kendo-react-excel-export";
const url = require("../components/urlConfig");

class App extends React.Component {
  state = {
    studentStat: [],
    dateList: [],
    classDetail : {}
  };

  _exporter;
  export = () => {
    this._exporter.save();
  };

  componentDidMount = async () => {
    console.log(
      this.props.teacherID,
      this.props.uqID,
      this.props.lateTime,
      this.props.absentTime
    );
    // await fetch(url.endpointWebApp + "/exportClassReport", {
    //   method: "POST",
    //   headers: {
    //     Accept: "application/json",
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     teacherID: this.props.teacherID,
    //     uqID: this.props.uqID,
    //     lateTime: this.props.lateTime,
    //     absentTime: this.props.absentTime,
    //   }),
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log(data);
    //     this.setState({
    //       studentStat: data.myStudentReport,
    //       dateList: data.classCheckedDateList,
    //       classDetail: data.classDetail
    //     });
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });
  };

  render() {
    
    return (
      <div>
        <button
          type="button"
          className="btn btn-success mx-1"
          onClick={this.export}
        >
          สร้างรายงาน Excel
        </button>

        <ExcelExport
          data={this.state.studentStat}
          fileName="Products.xlsx"
          ref={(exporter) => {
            this._exporter = exporter;
          }}
        >
          <ExcelExportColumnGroup
            title={
              this.state.classDetail.sessionName +
              " " +
              this.state.classDetail.sessionID +
              " (" +
              this.state.classDetail.semester +
              ")"
            }
            headerCellOptions={{
              textAlign: "center",
            }}
            locked={true}
            width={300}
          >
            <ExcelExportColumn
              title="StudentID"
              field="studentID"
              width={150}
              headerCellOptions={{
                textAlign: "center",
              }}
            />
            <ExcelExportColumn
              title="StudentName"
              field="studentName"
              width={200}
              headerCellOptions={{
                textAlign: "center",
              }}
            />
            <ExcelExportColumnGroup
              title="Sessions"
              headerCellOptions={{
                textAlign: "center",
              }}
            >
              {this.state.dateList.map((field) => (
                <ExcelExportColumn
                  field={field}
                  locked={field === "studentID"}
                  width={100}
                />
              ))}
            </ExcelExportColumnGroup>
            <ExcelExportColumn
              title="Present"
              field="present"
              width={70}
              headerCellOptions={{
                textAlign: "center",
              }}
            />
            <ExcelExportColumn
              title="Absents"
              field="absent"
              width={70}
              headerCellOptions={{
                textAlign: "center",
              }}
            />
            <ExcelExportColumn
              title="Sessions all"
              field="all"
              width={70}
              headerCellOptions={{
                textAlign: "center",
              }}
            />
            <ExcelExportColumn
              title="Percentage"
              field="presentPercentage"
              width={100}
              headerCellOptions={{
                textAlign: "center",
              }}
            />
          </ExcelExportColumnGroup>
        </ExcelExport>
      </div>
    );
  }
}

export default App;
