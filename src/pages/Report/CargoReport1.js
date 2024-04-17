import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import "./Table.css";
import * as React from "react";
import { mainAPI } from "../../components/mainAPI";
const CargoReport = () => {
  const jwt = JSON.parse(localStorage.getItem("jwt"));

  const customStyles = {
    headRow: {
      style: {
        backgroundColor: "#034694",
        color: "white",
      },
    },
    headCells: {
      style: {
        fontSize: "14px",
        fontWeight: "500",
      },
    },
    cells: {
      style: {
        fontSize: "15px",
      },
    },
    table: {
      width: "500px",
      height: "500px",
      border: "60px solid #300AC",
    },
    rows: {
      style: {
        minHeight: "44px",
      },
    },
  };
  const column = [
    {
      name: "Index",
      selector: (row) => row.id,
      field: "id",
    },
    {
      name: "Name",
      selector: (row) => row.ownerName,
      field: "ownerName",
    },
    {
      name: "TotalShipping",
    },

    {
      name: "TotalRevenue",
      selector: (row) => row.revenue,
      field: "revenue",
    },
  ];

  const [records, setRecords] = useState([]);
  const totalRevenue = records.reduce(
    (total, record) => total + record.revenue,
    0
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${jwt}`,
        };

        const ownerRes = await fetch(`${mainAPI}/Api/Admin/All/CargoOwners`, { headers });

        if (ownerRes.status === 401) {
          console.log("Unable to Load!! server responded with 401");
        }
        const ownerData = await ownerRes.json();
        if (ownerData && ownerRes.ok) {
          console.log(ownerData);
          setRecords(ownerData.cargoOwners);
          setFilterRecords(ownerData.cargoOwners);
        }
        if (ownerRes.status === 400) {
          console.log("Invalid API server 400");
        }
      } catch (e) {
        console.log(e);
      }
    };

    fetchData();
  }, []);

  const [filterRecords, setFilterRecords] = useState([]);

  const handleFilter = (event) => {
    const newData = filterRecords.filter((row) =>
      row.name.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setRecords(newData);
  };
  const exportColumns = column
    .filter((col) => col.name !== "Detail")
    .map((col) => ({
      title: col.name,
      dataKey: col.field,
    }));
  const exportPDF = () => {
    const filteredData = records.map((row) =>
      exportColumns.reduce((obj, column) => {
        if (column.dataKey === "city") {
          obj[column.dataKey] = row.address ? row.address.city : "";
        } else {
          obj[column.dataKey] = row[column.dataKey];
        }
        return obj;
      }, {})
    );
    import("jspdf").then((jsPDF) => {
      import("jspdf-autotable").then(() => {
        const doc = new jsPDF.default(0, 0);
        doc.autoTable(exportColumns, filteredData);
        doc.save("CargoReport.pdf");
      });
    });
  };
  const handleExcelDownload = () => {
    const workbook = XLSX.utils.book_new();
    const filteredData = records.map((row) =>
      exportColumns.reduce((obj, column) => {
        if (column.dataKey === "city") {
          obj[column.dataKey] = row.address ? row.address.city : "";
        } else {
          obj[column.dataKey] = row[column.dataKey];
        }
        return obj;
      }, {})
    );

    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Table Data");
    const excelData = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const excelBlob = new Blob([excelData], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(excelBlob, "CargoReport.xlsx");
  };
  return (
    <div className="tableReport">
    <div className="table-containers" id="report-Tables" >
        <table className="data-tables">
          <thead>
            <tr>
              <th>Index</th>
              <th>Cargo Owner</th>
              <th>Business Name</th>
              <th>Revenue</th>
            </tr>
          </thead>

          <tbody>
            {records.length > 0 ? (
              records.map((item, index) => (
                <tr className="" key={index}>
                  <td>{index + 1}</td>
                  <td>{item.ownerName}</td>
                  <td>{item.businessINF.businessName}</td>
                  <td>{item.revenue}</td>                 
                </tr>
              ))
            ) : (
              <tr>
                <td>NoRecored Found</td>
              </tr>
            )}
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
              onClick={handleExcelDownload}
            >
              Export Excel
            </button>
          </div>
        </div>
        </div>
  ); 
};
export default CargoReport;
