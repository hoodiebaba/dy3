import React from "react";
import { useDispatch, useSelector } from "react-redux";
import TelecomMap from "./TelecomMap";
import TelecomMapCard from "./TelecomMapCard";
import MapActions from "../../store/actions/map-actions";

const TelecomMapsContainer = () => {

  const dispatch = useDispatch();
  const syncEnabled = useSelector(state => state.map.syncEnabled);

  /* ============================================================
     🔹 Toggle Sync On / Off
  ============================================================ */
  const handleToggleSync = () => {
    dispatch(MapActions.setSyncEnabled(!syncEnabled));
  };

  /* ============================================================
     🔹 Operator List (Can later come from backend)
  ============================================================ */
  const operators = ["Huawei", "Huawei", "Huawei", "Huawei"];

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>

      {/* ============================================================
          🔹 2x2 Grid Layout
      ============================================================ */}
      {/* <div
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "1fr 1fr",
          gap: "8px",
          padding: "8px",
          background: "#f3f4f6"
        }}
      >  */}
          {/* {operators.map((op) => (
            <TelecomMapCard key={op} operator={op} />
        ))} */}
      
     
      {/* ============================================================
          🔹 3x2 Grid Layout
      ============================================================ */}
        <div
            style={{
              flex: 1,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gridTemplateRows: "1fr 1fr 1fr",
              gap: "8px",
              padding: "8px",
              background: "#f3f4f6"
            }}
          >

          <TelecomMapCard key={"Telkom"} operator={"Telkom"} />
          <TelecomMapCard key={"China Mobile"} operator={"China Mobile"} />
          <TelecomMapCard key={"Airtel"} operator={"Airtel"} />
          <TelecomMapCard key={"Jio"} operator={"Jio"} />
          <TelecomMapCard key={"Safaricom"} operator={"Safaricom"} />
          <TelecomMapCard key={"Zain"} operator={"Zain"} />
         
      </div> 
    </div>
  );
};

export default TelecomMapsContainer;