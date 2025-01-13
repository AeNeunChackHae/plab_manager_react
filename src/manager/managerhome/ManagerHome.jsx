import React from "react";
import { Routes, Route } from "react-router-dom";
import ManagerHomePage from "../managerhome/managerhomepage/ManagerHomePage";

function ManagerHome() {
  return (
    <>
      <Routes>
        <Route path="/plabfootball" element={<ManagerHomePage />} />
      </Routes>
    </>
  );
}

export default ManagerHome;