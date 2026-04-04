import React from "react";

const NifiViewer = () => {
  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <iframe
        // src={`https://${window.location.hostname}:8443/nifi`}
        // src = "/nifi-app"
        src="https://192.168.0.100:8080/nifi"
        width="100%"
        height="100%"
        style={{ border: "none" }}
      />
    </div>
  );
};

export default NifiViewer;
