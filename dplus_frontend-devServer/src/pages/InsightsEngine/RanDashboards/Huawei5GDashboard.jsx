import React from "react";
import UrlDashboard from "../../SuperSet/UrlDashboard";
import SupersetDashboard from "../../SuperSet/SupersetDashboard";

const Huawei5GDashboard = () => {
  return (
    <div className="w-full h-full flex flex-col">
      {/* Dashboard */}
      <div className="flex-1">
        <UrlDashboard
          dashboardId={18}   // dashboard ID here
        />
      </div>

      {/* <SupersetDashboard dashboardUuid={"4eb6cf80-c7c2-4e9b-a0ad-c35b56822f1f"} /> */}
    </div>
  );
};

export default Huawei5GDashboard;