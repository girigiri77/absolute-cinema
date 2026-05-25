import React from "react";

const LightStreaks: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={"pointer-events-none absolute inset-0 overflow-hidden " + className}>
      <div
        className="streak absolute -top-10 left-0 h-[140%] w-40 bg-gradient-to-r from-transparent via-fuchsia-500/15 to-transparent blur-2xl"
        style={{ animationDelay: "0s" }}
      />
      <div
        className="streak absolute top-1/4 left-0 h-[140%] w-32 bg-gradient-to-r from-transparent via-purple-400/10 to-transparent blur-2xl"
        style={{ animationDelay: "2.5s" }}
      />
      <div
        className="streak absolute top-1/2 left-0 h-[140%] w-48 bg-gradient-to-r from-transparent via-blue-400/10 to-transparent blur-2xl"
        style={{ animationDelay: "5s" }}
      />
    </div>
  );
};

export default LightStreaks;
