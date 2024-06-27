import React, { useState, useEffect } from "react";
import { Pagination } from "antd";
import UserModal from "./UserModal";
import { showSuccessMessage } from "../../components/SwalMessages";
import { mainAPI, endpoints } from "../../components/mainAPI";
import { BsToggleOn, BsToggleOff } from "react-icons/bs";
import "./create.css";

const CreateUser = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  const jwt = JSON.parse(localStorage.getItem("jwt"));

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const roles = ["SubAdmin", "CallCenter", "SuperAdmin"];
        const fetchRequests = roles.map(async (role) => {
          const response = await fetch(`${mainAPI}${endpoints.List.Users}/${role}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${jwt}`,
            },
          });
          if (!response.ok) {
            throw new Error(`Failed to fetch data for role ${role}`);
          }
          const { listOfUsers } = await response.json();
          return {
            role,
            users: listOfUsers.map((user) => ({ ...user, role })),
          };
        });
        const responseData = await Promise.all(fetchRequests);
        setUsers(responseData);
        localStorage.setItem("users", JSON.stringify(responseData));
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [jwt, refresh]);

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users
    .flatMap((role) => role.users)
    .slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSelectUser = async (selectedUser) => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    };
    const EnableDisableApi = `${mainAPI}${endpoints.Enable}/${selectedUser.id}`;
    setLoading(true);
    try {
      const res = await fetch(EnableDisableApi, options);
      const data = await res.json();
      if (res.ok) {
        const updatedUsers = users.map((roleData) => {
          return {
            role: roleData.role,
            users: roleData.users.map((user) => {
              if (user.id === selectedUser.id) {
                return {
                  ...user,
                  status: !user.status, // Toggle the status property
                };
              }
              return user;
            }),
          };
        });
        setUsers(updatedUsers);
        localStorage.setItem("users", JSON.stringify(updatedUsers));
        showSuccessMessage({ message: data.message });
      } else {
        console.error("Failed to update user");
        setError(data.message); // Assuming the error message is in data.message
      }
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-bar">
      <div>
        <h2>Create User</h2>
      </div>
      <hr className="hr" />
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <>
          <div className="userTable">
            <table className="tableUser">
              <thead>
                <tr className="usersList">
                  <th>ID</th>
                  <th>Driver Name</th>
                  <th>Role</th>
                  <th>Enable/Disable</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr className="usersList" key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.role}</td>
                    <td>
                      {user.status ? (
                        <BsToggleOn
                          onClick={() => handleSelectUser(user)}
                          size="1.8rem"
                          style={{ cursor: "pointer", color: "green" }}
                        />
                      ) : (
                        <BsToggleOff
                          onClick={() => handleSelectUser(user)}
                          size="1.8rem"
                          style={{ cursor: "pointer", color: "red" }}
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="wrapItems">
            <Pagination
              className="pagination"
              defaultCurrent={1}
              total={users.flatMap((role) => role.users).length}
              pageSize={usersPerPage}
              onChange={paginate}
            />
            <button className="bttn" onClick={openModal}>
              CreateUser
            </button>
          </div>
          <UserModal isOpen={isModalOpen} onCloseModal={closeModal} />
        </>
      )}
    </div>
  );
};

export default CreateUser;
