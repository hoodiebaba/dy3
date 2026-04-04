import React from "react";
import UrlDashboard from "../../SuperSet/UrlDashboard";
import SupersetDashboard from "../../SuperSet/SupersetDashboard";

const NSAtoSA5GPrePostDashboard = () => {
  return (
    <div className="w-full h-full flex flex-col">
      {/* Dashboard */}
      <div className="flex-1">
        <UrlDashboard
          dashboardId={23}   // dashboard ID here
        />
      </div>

      {/* <SupersetDashboard dashboardUuid={"4a348d07-616c-40a0-aa26-704d849266e2"} /> */}
    </div>
  );
};

export default NSAtoSA5GPrePostDashboard;


