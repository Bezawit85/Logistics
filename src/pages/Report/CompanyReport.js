import "./Table.css";
import * as React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const CompanyReport = ({ currentPage, records }) => {
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [["Id", "Name", "Vehicle", "Driver", "Revenue"]],
      body: records.map((item) => [
        item.id,
        item.firstName,
        item.totalVehicles,
        item.totalDrivers,
        item.revenue,
      ]),
    });
    doc.save("CompanyReport.pdf");
  };
  const exportToExcel = () => {
    const data = records.map((item) => ({
      Id: item.id,
      Name: item.firstName,
      Vehicle: item.totalVehicles,
      Driver: item.totalDrivers,
      Revenue: item.revenue,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "CargoReport");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAsExcelFile(excelBuffer, "CargoReport");
  };

  const saveAsExcelFile = (buffer, fileName) => {
    const data = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(data, fileName + ".xlsx");
  };

  const totalRevenue = records.reduce(
    (total, record) => total + record.revenue,
    0
  );

  return (
    <div className="tableReports">
      <div className="table-containers" id="report-Tables">
        <table className="data-tables">
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Vehicle</th>
              <th>Driver</th>
              <th>Revenue</th>
            </tr>
          </thead>

          <tbody>
            {currentPage.map((item, index) => (
              <tr className="" key={index}>
                <td>{index + 1}</td>
                <td>{item.firstName}</td>
                <td>{item.totalVehicles}</td>
                <td>{item.totalDrivers}</td>
                <td>{item.revenue}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ display: "flex", justifyContent: "right" }}>
          Total Revenue: {totalRevenue}
        </div>
        <div style={{ gap: "3px", justifyContent: "space-between" }}>
          <button className="bttn" onClick={exportPDF}>
            Export PDF
          </button>
          <button
            style={{ marginLeft: "10px" }}
            className="bttn"
            onClick={exportToExcel}
          >
            Export Excel
          </button>
        </div>
      </div>
    </div>
  );
};
export default CompanyReport;
