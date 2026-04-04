import React from "react";
import SupersetDashboard from "../../SuperSet/SupersetDashboard";
import UrlDashboard from "../../SuperSet/UrlDashboard";

const MgwDashboard = () => {
  return (
    <div className="w-full h-full flex flex-col">
      {/* Dashboard */}
      <div className="flex-1">
        {/* <SupersetDashboard
          dashboardUuid={"f753e6b3-d0ce-490a-9b83-064ef9c7500d"} // dashboard UUID here
        /> */}
        <UrlDashboard
          dashboardId={15}   // dashboard ID here
        />
      </div>
    </div>
  );
};

export default MgwDashboard;

// import React from "react";
// import SupersetStaticDashboard from "../../SuperSet/SupersetStaticDashboard";

// const MgwDashboard = () => {
//   return (
//     <div className="w-full h-full flex flex-col">
//       <div className="flex-1">
//         <SupersetStaticDashboard
//           dashboardUuid="f753e6b3-d0ce-490a-9b83-064ef9c7500d"
//         />
//       </div>
//     </div>
//   );
// };

// export default MgwDashboard;
