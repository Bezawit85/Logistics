import { Pagination } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserTable = ({ target }) => {
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
  console.log(target)
  const navigate = useNavigate();
  const PostCargo = (phone) =>{
    navigate(`/Cargo/PostCargo/${phone}`)
  }
  const showDetail = (user) => {
    navigate(`/cargoOwnerDetail/${user.id}`);
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
              <th>Cargo Owner</th>
              <th>Phone Number</th>
              <th>Business Name</th>
              <th>license Number</th>
              <th>Tin Number</th>
              <th>Enabled</th>
              <th>Detail</th>
              <th>Post Market</th>
            </tr>
          </thead>

          <tbody>
            {target.length > 0 ? (
              currentPage.map((item, index) => (
                <tr className="" key={index}>
                  <td>{index + 1}</td>
                  <td>{item.ownerName}</td>
                  <td>{item.phoneNumber}</td>
                  <td>{item.businessINF.businessName}</td>
                  <td>{item.businessINF.licenseNumber}</td>
                  <td>{item.businessINF.tinNumber}</td>
                  <td
                    style={{
                      color: `${
                        item.enabled
                          ? "green"
                          : "red"
                      }`,
                    }}
                  >
                    {item.enabled ? 'Enabled' : 'Disabled'}
                  </td>
                  <td>
                    <button
                      className="table-btn"
                      onClick={() => showDetail(item)}
                    >
                      Detail
                    </button>
                  </td>
                  <td><button
                  onClick={()=>PostCargo(item.phoneNumber)}
                      className="table-btn"
                    >
                      Post
                    </button></td>
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

export default UserTable;
