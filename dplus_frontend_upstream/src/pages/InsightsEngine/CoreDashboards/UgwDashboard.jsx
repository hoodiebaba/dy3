import React from "react";
import SupersetDashboard from "../../SuperSet/SupersetDashboard";
import UrlDashboard from "../../SuperSet/UrlDashboard";

const UgwDashboard = () => {
  return (
    <div className="w-full h-full flex flex-col">
      {/* Dashboard */}
      <div className="flex-1">
        {/* <SupersetDashboard
          dashboardUuid={"589cfd4e-00f4-4d0c-9904-7ff87809c4d0"} // dashboard UUID here
        /> */}
        <UrlDashboard
          dashboardId={14}   // dashboard ID here
        />
      </div>

    </div>
  );
};

export default UgwDashboard;