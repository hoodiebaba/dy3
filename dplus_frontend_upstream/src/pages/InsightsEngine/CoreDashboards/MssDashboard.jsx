import React from "react";
import SupersetDashboard from "../../SuperSet/SupersetDashboard";
import UrlDashboard from "../../SuperSet/UrlDashboard";

const MssDashboard = () => {
  return (
    <div className="w-full h-full flex flex-col">
      {/* Dashboard */}
      <div className="flex-1">
        {/* <SupersetDashboard
          dashboardUuid={"e9575f83-1fe7-46a3-9461-772445ceee95"} // dashboard UUID here
        /> */}
          <UrlDashboard
          dashboardId={13}   // dashboard ID here
        />
      </div>

    </div>
  );
};

export default MssDashboard;