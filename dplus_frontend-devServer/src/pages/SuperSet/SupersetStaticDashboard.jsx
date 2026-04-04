// import React, { useEffect, useRef } from "react";
// import { embedDashboard } from "@superset-ui/embedded-sdk";

// const SupersetStaticDashboard = ({ dashboardUuid }) => {
//   const dashboardRef = useRef(null);

//   useEffect(() => {
//     if (!dashboardRef.current || !dashboardUuid) return;

//     const mountPoint = dashboardRef.current;

//     embedDashboard({
//       id: dashboardUuid,
//       supersetDomain: "http://192.168.0.100:8088",
//       mountPoint,

//       fetchGuestToken: async () => {
//         console.log("Fetching Guest Token...");

//         const response = await fetch(
//           "http://192.168.0.100:8089/api/superset/guest-token",
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               user: { username: "admin" },
//               resources: [{ type: "dashboard", id: dashboardUuid }],
//               rls: [],
//             }),
//           }
//         );

//         const data = await response.json();
//         console.log("Guest Token Received:", data.token);

//         return data.token;
//       },

//       dashboardUiConfig: {
//         hideTitle: true,
//         filters: { visible: true },
//       },
//     });
//   }, []); // <-- IMPORTANT: static embed only once

//   return (
//     <div style={{ width: "100%", height: "100vh" }}>
//       <div
//         ref={dashboardRef}
//         style={{ width: "100%", height: "100%" }}
//       />
//     </div>
//   );
// };

// export default SupersetStaticDashboard;
