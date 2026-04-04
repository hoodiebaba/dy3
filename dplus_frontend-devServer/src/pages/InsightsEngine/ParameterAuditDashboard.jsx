import React from "react";
import UrlDashboard from "../SuperSet/UrlDashboard";
import SupersetDashboard from "../SuperSet/SupersetDashboard";

const ParameterAuditDashboard = () => {

  console.log("ParameterAuditDashboard rendered");
  return (
    <div className="w-full h-full flex flex-col">
      {/* Dashboard */}
      <div className="flex-1">
        <UrlDashboard
          dashboardId={21}   // dashboard ID here
        />
      </div>

      {/* <SupersetDashboard dashboardUuid={"69f265fd-9c0f-4cb9-8d10-f8d4df35f610"} /> */}
    </div>
  );
};

export default ParameterAuditDashboard;