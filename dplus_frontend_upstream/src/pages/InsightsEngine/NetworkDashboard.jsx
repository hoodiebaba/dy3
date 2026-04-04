import React from "react";
import UrlDashboard from "../SuperSet/UrlDashboard";

const NetworkDashboard = () => {
  return (
    <div className="w-full h-full flex flex-col">
      {/* Dashboard */}
      <div className="flex-1">
        <UrlDashboard
          dashboardId={6}   // dashboard ID here
        />
      </div>

    </div>
  );
};

export default NetworkDashboard;