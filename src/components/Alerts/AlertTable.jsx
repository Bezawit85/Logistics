import { Pagination } from "antd";
import React, { useEffect, useState } from "react";

const VehicleTable = ({ target, handleChange, showDetail, handleAssign }) => {
  const [page, setPage] = useState(1);
  const [postPerPage, setpostPerPage] = useState(5);
  const lastIndexOfPage = page * postPerPage;
  const firstIndexPage = lastIndexOfPage - postPerPage;
  const currentPage = target?.slice(firstIndexPage, lastIndexOfPage) || 1;
  const totalPages = target?.length || 1;
  const onShowSizeChange = (current, pageSize) => {
    setpostPerPage(pageSize);
    console.log(pageSize);
  };
  useEffect(() => {
    setPage(1);
  }, [target]);
  return (
    <div >
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Index</th>
              <th>Driver Owner</th>
              <th>Driver Name</th>
              <th>Alert Location</th>
              <th>Plate Number</th>
              <th>Start Date</th>
              <th>Finished Date</th>
            </tr>
          </thead>

          <tbody>
            {target?.length > 0 ? (
              currentPage.map((item, index) => (
                <tr className="" key={index}>
                  <td>{index + 1}</td>
                  <td>{item.owner}</td>
                  <td>{item.driver}</td>
                  <td>{item.alertocation}</td>
                  <td>{item.plateNumber}</td>
                  <td>
                    {item.alertstart}
                  </td>
                  <td>
                    {item.alertfinish}
                  </td>
                 
                </tr>
              ))
            ) : (
              <tr>
                <td>NoRecored Found</td>
              </tr>
            )}
          </tbody>
        </table>
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
    
    </div>
  );
};

export default VehicleTable;
