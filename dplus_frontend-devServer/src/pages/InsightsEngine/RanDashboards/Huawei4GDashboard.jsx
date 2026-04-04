import React from "react";
import UrlDashboard from "../../SuperSet/UrlDashboard";
import SupersetDashboard from "../../SuperSet/SupersetDashboard";

const Huawei4GDashboard = () => {
  return (
    <div className="w-full h-full flex flex-col">
      {/* Dashboard */}
      <div className="flex-1">
        <UrlDashboard
          dashboardId={16}   // dashboard ID here
        />
      </div>

      {/* <SupersetDashboard dashboardUuid={"a36b6cb8-0959-4f91-a41f-62cfba7ae398"} /> */}
    </div>
  );
};

export default Huawei4GDashboard;