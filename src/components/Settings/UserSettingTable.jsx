import { Pagination } from "antd";
import React, { useEffect, useState } from "react";
import SendMsg from "./SendMsg";

const UserSettingTable = ({ target, setShowSetting, name, owner }) => {

  const [page, setPage] = useState(1);
  const [postPerPage, setpostPerPage] = useState(4);
  const lastIndexOfPage = page * postPerPage;
  const firstIndexPage = lastIndexOfPage - postPerPage;
  const currentPage =
    name === "LogoAvatar" ? 1 : target.slice(firstIndexPage, lastIndexOfPage);
  const totalPages = target.length;
  const onShowSizeChange = (current, pageSize) => {
    setpostPerPage(pageSize);
  };

  useEffect(() => {
    setPage(1);
  }, [target]);

  const hideModal = () => {
    const modal = document.getElementById("setting-manage");
    window.onclick = (event) => {
      if (event.target == modal) {
        setShowSetting(false);
      }
    };
  };

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);

  const selectAll = () => {
    setSelectedUsers([]);

    if (!isAllSelected) {
      owner.forEach((user) => {
        setSelectedUsers((prevSelectedUsers) => [
          ...prevSelectedUsers,
          user.phoneNumber,
        ]);
      });
    }
    setIsAllSelected(!isAllSelected);
  };

  const handleUserSelect = (user) => {
    if (selectedUsers.includes(user.phoneNumber)) {
      setSelectedUsers((prevSelectedUsers) =>
        prevSelectedUsers.filter(
          (phoneNumber) => phoneNumber !== user.phoneNumber
        )
      );
    } else {
      setSelectedUsers((prevSelectedUsers) => [
        ...prevSelectedUsers,
        user.phoneNumber,
      ]);
    }
  };

  const isUserSelected = (user) => {
    return selectedUsers.includes(user.phoneNumber);
  };

  const isAllUsersSelected = () => {
    return selectedUsers.length === owner.length;
  };

  return (
    <div
      className={
        name === "LogoAvatar" ? "Avatar-modal" : "manage-modal-content"
      }
    >
      <table className="data-table" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={selectAll}
                style={{ width: "18px", height: "18px", marginTop: "10px" }}
              />
            </th>
            <th>ID</th>
            <th> {name == "name" ? "Name" : "Name"}</th>
            <th> {name == "name" ? "PhoneNumber" : "PhoneNumber"}</th>
            {name == "LogoAvatar" && <th> Logo </th>}
          </tr>
        </thead>

        <tbody>
          {name === "LogoAvatar" ? (
            <tr className="active_row">
              <td>{target.id}</td>
              <td>{target.avatar}</td>
            </tr>
          ) : (
            currentPage.map((item, index) => (
              <tr className="active_row" key={index}>
                <td>
                  <input
                    type="checkbox"
                    checked={isUserSelected(item)}
                    onChange={() => handleUserSelect(item)}
                    style={{ width: "18px", height: "18px", marginTop: "10px" }}
                  />
                </td>
                <td>{item.id}</td>
                <td>{item.firstName}</td>
                <td>{item.phoneNumber}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {selectedUsers.length > 0 && (
        <SendMsg title={name} id={selectedUsers} target={target} />
      )}
      <Pagination
        onChange={(page) => setPage(page)}
        pageSize={postPerPage}
        current={page}
        total={totalPages}
        onShowSizeChange={onShowSizeChange}
      />
    </div>
  );
};

export default UserSettingTable;
