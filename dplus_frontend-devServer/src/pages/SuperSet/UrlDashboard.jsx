import React, { useMemo, useState, useEffect } from "react";

const SUPERSET_BASE = "http://192.168.0.100:8088";

const UrlDashboard = ({
  dashboardId,
  filterId = null,
  filterColumn = null,
  filterValue = null,
  standalone = 2, //DEFAULT TO 2, WHICH HIDES THE TOP NAV BAR AND LEFT SIDEBAR, BUT SHOWS FILTERS. SET TO 3 TO HIDE FILTERS ALSO  or add &show_filters=0 in the URL
  height = "100%",
}) => {

  const [loading, setLoading] = useState(true);

  const buildUrl = useMemo(() => {
    if (!dashboardId) return null;

    let url = `${SUPERSET_BASE}/superset/dashboard/${dashboardId}/`;
    // let url = `${SUPERSET_BASE}/superset/dashboard/${dashboardId}/?standalone=${standalone}&reset_filters=1`;

    if (filterId && filterColumn && filterValue) {
      const encoded = encodeURIComponent(filterValue);

      url +=
        `?native_filters=(` +
        `${filterId}:(` +
        `filterState:(value:!('${encoded}')),` +
        `extraFormData:(filters:!((col:'${filterColumn}',op:IN,val:!('${encoded}'))))` +
        `)` +
        `)`;
    }

    if (standalone) {
      url += url.includes("?")
        ? `&standalone=${standalone}`
        : `?standalone=${standalone}`;
    }

    return url;
  }, [dashboardId, filterId, filterColumn, filterValue, standalone]);

  console.log("Superset URL:", buildUrl);

  if (!buildUrl) return null;

  return (
    <iframe
      key={buildUrl}
      src={buildUrl}
      title="Superset Dashboard"
      style={{
        width: "100%",
        height: height,
        border: "none",
      }}
    />
  //   <div style={{ position: "relative", height }}>
  //   {loading && (
  //     <div
  //       style={{
  //         position: "absolute",
  //         inset: 0,
  //         background: "#fff",
  //         zIndex: 9999,
  //         display: "flex",
  //         justifyContent: "center",
  //         alignItems: "center",
  //       }}
  //     >
  //       Loading Dashboard...
  //     </div>
  //   )}

  //   <iframe
  //     key={buildUrl}
  //     src={buildUrl}
  //     title="Superset Dashboard"
  //     onLoad={() => {
  //       setTimeout(() => {
  //         setLoading(false);
  //       }, 1500);
  //     }}
  //     style={{
  //       width: "100%",
  //       height: "100%",
  //       border: "none",
  //       visibility: loading ? "hidden" : "visible",
  //     }}
  //   />
  // </div>

  );
};

export default UrlDashboard;
