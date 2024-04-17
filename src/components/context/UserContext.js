import React, { createContext, useContext, useEffect, useState } from "react";

const ContextUser = createContext(null);

export function useUserContext() {
  return useContext(ContextUser);
}

function UserContext({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const isAdmin = () => currentUser && currentUser.role.includes("ADMIN");
  const isSubAdmin = () => currentUser && currentUser.role.includes("SUBADMIN");
  const isSuperAdmin = () => currentUser && currentUser.role.includes("SUPERADMIN");
  const isCallCenter = () => currentUser && currentUser.role.includes("CALLCENTER");

  const [jwt, setJwt] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedJwt = localStorage.getItem("jwt");

    if (storedUser && storedJwt) {
      setCurrentUser(JSON.parse(storedUser));
      setJwt(JSON.parse(storedJwt));
    }
  }, []);


  return (
    <ContextUser.Provider value={{ currentUser, setCurrentUser, jwt, isAdmin, isSubAdmin, isCallCenter }}>
      {children}
    </ContextUser.Provider>
  );
}

export default  UserContext ;
