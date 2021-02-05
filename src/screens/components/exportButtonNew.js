import * as React from "react";
import { useState, useEffect } from "react";

import {
  ExcelExport,
  ExcelExportColumn,
  ExcelExportColumnGroup,
} from "@progress/kendo-react-excel-export";
import products from "./products.json";

const data = products;
const fields = Object.keys(data[0]);

const classDetail = {
  sessionID: "261111",
  sessionName: "calculus1",
  semester: "1/2563",
};

const myDate = [
  "2020-12-11",
  "2020-12-12",
  "2020-12-13",
  "2020-12-14",
  "2020-12-15",
];

class App extends React.Component {
  _exporter;
  export = () => {
    this._exporter.save();
  };
  render() {
    return (
      <div>
        <button
          type="button"
          className="btn btn-success mx-1"
          onClick={this.export}
        >
          Export Excel
        </button>

        <ExcelExport
          data={data}
          fileName="Products.xlsx"
          ref={(exporter) => {
            this._exporter = exporter;
          }}
        >
          <ExcelExportColumnGroup
            title={
              classDetail.sessionName +
              " " +
              classDetail.sessionID +
              " (" +
              classDetail.semester +
              ")"
            }
            headerCellOptions={{
              textAlign: "center",
            }}
            locked={true}
            width={300}
          >
            <ExcelExportColumn
              title="Students ID"
              field="studentsID"
              width={150}
              headerCellOptions={{
                textAlign: "center",
              }}
            />
            <ExcelExportColumn
              title="Students Name"
              field="studentsName"
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
              {myDate.map((field) => (
                <ExcelExportColumn
                  field={field}
                  locked={field === "studentsID"}
                  width={100}
                />
              ))}
            </ExcelExportColumnGroup>
            <ExcelExportColumn
              title="Presents"
              field="presents"
              width={50}
              headerCellOptions={{
                textAlign: "center",
              }}
            />
            <ExcelExportColumn
              title="Absents"
              field="absents"
              width={50}
              headerCellOptions={{
                textAlign: "center",
              }}
            />
            <ExcelExportColumn
              title="Sessions all"
              field="sessionAll"
              width={50}
              headerCellOptions={{
                textAlign: "center",
              }}
            />
            <ExcelExportColumn
              title="Percentage"
              field="percentage"
              width={70}
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
