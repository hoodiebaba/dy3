import React from "react";
import UrlDashboard from "../../SuperSet/UrlDashboard";
import SupersetDashboard from "../../SuperSet/SupersetDashboard";

const WorstCellsDashboard = () => {
  return (
    <div className="w-full h-full flex flex-col">
      {/* Dashboard */}
      <div className="flex-1">
        <UrlDashboard
          dashboardId={22}   // dashboard ID here
        />
      </div>

      {/* <SupersetDashboard dashboardUuid={"6bdec5a6-cce0-4376-9fff-3a5174627cba"} /> */}
    </div>
  );
};

export default WorstCellsDashboard;