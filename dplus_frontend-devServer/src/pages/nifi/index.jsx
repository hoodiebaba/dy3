import React from "react";

const NifiViewer = () => {
  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <iframe
  src="https://dell5070l:8444/nifi"
  width="100%"
  height="100%"
  style={{ border: "none" }}
/>
    </div>
  );
};

export default NifiViewer;