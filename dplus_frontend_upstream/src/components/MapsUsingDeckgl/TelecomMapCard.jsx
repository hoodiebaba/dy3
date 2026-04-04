import React, { useState } from "react";
import TelecomMap from "./TelecomMap";

const TelecomMapCard = ({ operator }) => {

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "8px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        position: "relative"
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "8px 12px",
          fontWeight: 600,
          borderBottom: "1px solid #e5e5e5",
          background: "#fafafa",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        {operator}

        {/* Slide Toggle */}
        {/* <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          style={{
            background: "#111827",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            padding: "4px 8px",
            cursor: "pointer"
          }}
        >
          {isFilterOpen ? "→" : "←"}
        </button> */}
      </div>

      {/* Body */}
      <div style={{ flex: 1, position: "relative" }}>
        <TelecomMap operator={operator} />

        {/* SLIDE FILTER PANEL */}
        {/* <div
          style={{
            position: "absolute",
            top: 0,
            right: isFilterOpen ? 0 : "-260px",
            width: "260px",
            height: "100%",
            background: "#ffffff",
            borderLeft: "1px solid #e5e5e5",
            transition: "0.3s",
            overflowY: "auto",
            padding: "12px",
            boxShadow: "-2px 0 8px rgba(0,0,0,0.1)"
          }}
        >
          <h4>Technology</h4>
          <label><input type="checkbox" /> 2G</label><br />
          <label><input type="checkbox" /> 3G</label><br />
          <label><input type="checkbox" /> 4G</label><br />
          <label><input type="checkbox" /> 5G</label>

          <hr />

          <h4>Region</h4>
          <label><input type="checkbox" /> North</label><br />
          <label><input type="checkbox" /> South</label><br />
          <label><input type="checkbox" /> East</label><br />
          <label><input type="checkbox" /> West</label>
        </div> */}
      </div>
    </div>
  );
};

export default TelecomMapCard;