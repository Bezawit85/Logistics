import { Pagination } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const MarketTable = ({ target }) => {
  const [page, setPage] = useState(1);
  const [postPerPage, setpostPerPage] = useState(5);
  const lastIndexOfPage = page * postPerPage;
  const firstIndexPage = lastIndexOfPage - postPerPage;
  const currentPage = target.slice(firstIndexPage, lastIndexOfPage);
  const totalPages = target.length;

  const onShowSizeChange = (current, pageSize) => {
    setpostPerPage(pageSize);
  };
  useEffect(() => {
    setPage(1);
  }, [target]);
  const navigate = useNavigate();
  const showDetail = (item) => {
    if(item.status === 'NEW'){
    navigate(`/market/marketDetailNew/${item.id}`);
  }
    else
    navigate(`/market/marketDetailActive/${item.id}`);
  };

  return (
    <div>
      <div className="table-container">
        <table
          className="data-table"
          style={{
            width: "80%",
          }}
        >
          <thead>
            <tr>
              <th>Index</th>
              <th>Name</th>
              <th>From</th>
              <th>To</th>
              <th>weight</th>
              <th>Status</th>
              <th>Detail</th>
            </tr>
          </thead>

          <tbody>
            {target.length > 0 ? (
              currentPage.map((item, index) => (
                <tr className="" key={index}>
                  <td>{index + 1}</td>
                  <td>{item.cargoOwner}</td>
                  <td>{item.pickUp}</td>
                  <td>{item.dropOff}</td>
                  <td>{item.weight}</td>
                  <td
                    style={{
                      color: `${
                        item.status.toLowerCase() === "finished"
                          ? "green"
                          : item.status.toLowerCase() === "active"
                          ? "red"
                          : item.status.toLowerCase() == "acepted"
                          ? "black"
                          : "orange"
                      }`,
                    }}
                  >
                    {item.status}
                  </td>

                  <td>
                    <button
                      className="table-btn"
                      onClick={() => showDetail(item)}
                    >
                      Detail
                    </button>
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

export default MarketTable;
