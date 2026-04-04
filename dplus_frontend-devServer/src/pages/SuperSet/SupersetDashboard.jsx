// import React, { useEffect, useRef } from "react";
// import { embedDashboard } from "@superset-ui/embedded-sdk";

// const SupersetDashboard = () => {
//   const dashboardRef = useRef(null);
//   const DASHBOARD_UUID = "66f9c592-4552-4b37-9ad9-1f9f4d1a1ea6";

//   useEffect(() => {
//     const loadDashboard = async () => {
//       if (dashboardRef.current) {
//         console.log("Attempting to embed dashboard...");
        
//         embedDashboard({
//           id: DASHBOARD_UUID,
//           supersetDomain: "http://127.0.0.1:8088", // No trailing slash!
//           mountPoint: dashboardRef.current,
//           fetchGuestToken: async () => {
//             console.log("Fetching Guest Token...");
            
//             // 1. LOGIN
//             const loginResp = await fetch("http://127.0.0.1:8088/api/v1/security/login", {
//               method: 'POST',
//               headers: { 'Content-Type': 'application/json' },
//               body: JSON.stringify({
//                 username: "admin", password: "Admin123", provider: "db", refresh: true
//               })
//             });
//             const { access_token } = await loginResp.json();
//             console.log("Access Token Received");

//             // 2. GUEST TOKEN
//             const guestResp = await fetch("http://127.0.0.1:8088/api/v1/security/guest_token/", {
//               method: 'POST',
//               headers: {
//                 'Authorization': `Bearer ${access_token}`,
//                 'Content-Type': 'application/json'
//               },
//               body: JSON.stringify({
//                 user: { username: "admin" },
//                 resources: [{ type: "dashboard", id: DASHBOARD_UUID }],
//                 rls: []
//               })
//             });

//             const guestData = await guestResp.json();
//             console.log("Guest Token Received:", guestData.token);
//             return guestData.token;
//           },
//           dashboardUiConfig: { 
//             hideTitle: true,
//             filters: { visible: true }
//           },
//         });
//       }
//     };

//     loadDashboard();
//   }, []);

//   return (
//     <div style={{ width: '100vw', height: '100vh', background: '#f5f5f5' }}>
//       {/* This CSS ensures the SDK's internal wrapper fills the div */}
//       <style>{`
//         iframe {
//           width: 100% !important;
//           height: 100% !important;
//           border: none !important;
//         }
//         #superset-mount {
//            width: 100%;
//            height: 100%;
//         }
//       `}</style>
      
//       <div 
//         id="superset-mount"
//         ref={dashboardRef} 
//         style={{ width: '100%', height: '100%' }} 
//       />
//     </div>
//   );
// };

// export default SupersetDashboard;

import React, { useEffect, useRef } from "react";
import { embedDashboard } from "@superset-ui/embedded-sdk";
import { useParams, useSearchParams } from "react-router-dom";
import { supersetUiOrigin } from "../../utils/url";
import { requestSupersetGuestToken } from "../../utils/supersetGuestToken";

const SupersetDashboard = ({
  dashboardUuid = null,
  filterId = null,
  filterValue = null,
}) => {
  const dashboardRef = useRef(null);
  // const DASHBOARD_UUID = "b5259bc2-8f63-4097-ab6e-5fb3cdece14f";
  // const FILTER_ID = "NATIVE_FILTER-yDIlZg7WKCX-OaG9L1caB"; 
  // const { uuid } = useParams();
  // const finalUuid = dashboardUuid || uuid;

  // const [searchParams] = useSearchParams();
  // const cellFromUrl = searchParams.get("cell");
  // const filterIdFromUrl = searchParams.get("filterId");
  // const effectiveFilterId = filterId ?? filterIdFromUrl;
  // const finalFilterValue = filterValue ?? cellFromUrl;

  const { uuid } = useParams();
  const [searchParams] = useSearchParams();

  const cellFromUrl = searchParams.get("cell");
  const filterIdFromUrl = searchParams.get("filterId");

  const finalUuid = dashboardUuid ?? uuid;
  const effectiveFilterId = filterId ?? filterIdFromUrl;
  const finalFilterValue = filterValue ?? cellFromUrl;

  useEffect(() => {

    // if (!dashboardUuid) return;
    if (!finalUuid) return;
    if (!dashboardRef.current) return;

    const loadDashboard = async () => {
      if (dashboardRef.current) {
        embedDashboard({
          // id: dashboardUuid, //SDK method 
          id: finalUuid,
          supersetDomain: supersetUiOrigin,
          mountPoint: dashboardRef.current,
          fetchGuestToken: async () => {
            return requestSupersetGuestToken({
              user: { username: "admin" },
              resources: [{ type: "dashboard", id: finalUuid }],
              rls: [],
            });
          },
          dashboardUiConfig: { 
            hideTitle: true,
            filters: { visible: true },

            ...(effectiveFilterId && finalFilterValue && {
                  urlParams: {
                    native_filters: `(${effectiveFilterId}:(filterState:(value:!('${finalFilterValue}')),extraFormData:(filters:!((col:cell_name,op:IN,val:!('${finalFilterValue}'))))))`
                }
            }),

            // ...(filterId && finalFilterValue
            // ? {
            //      initialFilters: {
            //         [filterId]: {
            //           value: Array.isArray(finalFilterValue)
            //             ? finalFilterValue
            //             : [finalFilterValue],
            //         },
            //       },
            //   }
            // : {}),
            

            // nativeFilters: cellName
            // ? {
            //     filters: {
            //       [FILTER_ID]: {
            //         value: [cellName],
            //       },
            //     },
            //   }
            // : {},
          },
        });

      }
    };

    loadDashboard();
  }, [finalUuid, effectiveFilterId, finalFilterValue]);

  return (
    <div style={{ width: '100%', height: '100vh', background: '#f5f5f5' }}>
      {/* This CSS ensures the SDK's internal wrapper fills the div */}
      <style>{`
        iframe {
          width: 100% !important;
          height: 100% !important;
          border: none !important;
        }
        #superset-mount {
           width: 100%;
           height: 90%;
        }
      `}</style>
      
      <div 
        id="superset-mount"
        ref={dashboardRef} 
        style={{ width: '100%', height: '90%' }} 
      />
    </div>

  );
};

export default SupersetDashboard;
