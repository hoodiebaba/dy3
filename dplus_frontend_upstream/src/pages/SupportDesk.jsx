import React from "react";

const SupportDesk = () => {
  return (
    <div className="w-full h-screen">
      <iframe
        // src="http://192.168.1.100:8080"
        src="http://192.168.0.102/"
        // src="http://support@datayog.com:Qwert@192.168.0.100:8080/#dashboard"
        title="Support Desk"
        className="w-full h-full border-none"
      />
    </div>
  );
};

export default SupportDesk;