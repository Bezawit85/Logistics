import { Pagination } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../components/context/UserContext";

const UserTable = ({ target }) => {
  const {isCallCenter} = useUserContext();
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
  const navigate = useNavigate();
  const showDetail = (user) => {
    navigate(`/users/${user.roles}/${user.id}`);
  };
  const addDriver = (item) => {
    navigate(`/users/addDriver/${item.phoneNumber}`);
  };
  const addVehicle = (item) => {
    navigate(`/users/addVehicle/${item.phoneNumber}`);
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
              <th>First Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Role</th>
              <th>Total Driver</th>
              <th>Total Vehicle</th>
              <th>Detail</th>
             {!isCallCenter() && <th>Add Vehicle</th>}
             {!isCallCenter() && <th>Add Driver</th>}
            </tr>
          </thead>

          <tbody>
            {target.length > 0 ? (
              currentPage.map((item, index) => (
                <tr className="" key={index}>
                  <td>{index + 1}</td>
                  <td>{item.companyName}</td>
                  <td>{item.firstName}</td>
                  <td>{item.email}</td>
                  <td>{item.phoneNumber}</td>
                  <td
                    style={{
                      color: `${
                        item.roles.toLowerCase() === "maintaining"
                          ? "red"
                          : item.roles.toLowerCase() === "parked"
                          ? "green"
                          : item.roles.toLowerCase() == "instock"
                          ? "blue"
                          : "orange"
                      }`,
                    }}
                  >
                    {item.roles}
                  </td>
                  <td>{item.totalDrivers}</td>
                  <td>{item.totalVehicles}</td>
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
                    <button
                      className="table-btn"
                      onClick={() => addVehicle(item)}
                    >
                      AddVehicle
                    </button>
                  </td>
                  )}
                  {!isCallCenter() && (
                  <td>
                    <button
                      className="table-btn"
                      onClick={() => addDriver(item)}
                    >
                      AddDriver
                    </button>
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

export default UserTable;
