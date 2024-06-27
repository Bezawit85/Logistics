import { Pagination } from "antd";
import React, { useEffect, useState } from "react";

const VehicleTable = ({
  target,
  handleChange,
  showDetail,
  handleAssign,
  isCallCenter,
}) => {
  const [page, setPage] = useState(1);
  const [postPerPage, setpostPerPage] = useState(5);
  const lastIndexOfPage = page * postPerPage;
  const firstIndexPage = lastIndexOfPage - postPerPage;
  const currentPage = target.slice(firstIndexPage, lastIndexOfPage);
  const totalPages = target.length;
  const onShowSizeChange = (current, pageSize) => {
    setpostPerPage(pageSize);
    console.log(pageSize);
  };
  useEffect(() => {
    setPage(1);
  }, [target]);

  return (
    <div>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Index</th>
              <th>Vehicle Owner</th>
              <th>Vehicle Name</th>
              <th>Vehice Type</th>
              <th>Plate Number</th>
              <th>Status</th>
              <th>Assigned Driver</th>
              <th>Detail</th>
              {!isCallCenter() && <th>Assign Driver</th>}
            </tr>
          </thead>

          <tbody>
            {target.length > 0 ? (
              currentPage.map((item, index) => (
                <tr className="" key={index}>
                  <td>{index + 1}</td>
                  <td>{item.vehicleOwner}</td>
                  <td>{item.vehicleName}</td>
                  <td>{item.vehicleCatagory}</td>
                  <td>{item.plateNumber}</td>
                  <td
                    style={{
                      color: `${
                        item.status.toLowerCase() === "maintaining"
                          ? "red"
                          : item.status.toLowerCase() === "parked"
                          ? "green"
                          : item.status.toLowerCase() == "instock"
                          ? "blue"
                          : "orange"
                      }`,
                    }}
                  >
                    {item.status}
                  </td>
                  <td>
                    {item.driverName == "null" ? "UNASSIGNED" : item.driverName}
                  </td>

                  <td>

                      <button
                        className="table-btn"
                        onClick={() => showDetail(item)}
                      >
                        Detail
                      </button>
                    
                  </td>
                  {!isCallCenter() && (
                  <td>
                    {item.driverName == "null" ? (
                      <button
                        className="table-btn btn-bg-lightred"
                        onClick={() => handleAssign(item)}
                        disabled={isCallCenter()}
                      >
                        Assign
                      </button>
                    ) : (
                      <button
                        className="table-btn"
                        onClick={() => handleChange(item)}
                        disabled={isCallCenter()}
                      >
                        Change Driver
                      </button>
                    )}
                  </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td>NoRecored Found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        onChange={(page) => setPage(page)}
        pageSize={postPerPage}
        current={page}
        total={totalPages}
        showQuickJumper
        showSizeChanger
        onShowSizeChange={onShowSizeChange}
      />
    </div>
  );
};

export default VehicleTable;
