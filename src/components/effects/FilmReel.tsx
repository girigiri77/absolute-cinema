import React from "react";

const FilmReel: React.FC<{ className?: string }> = ({ className = "" }) => {
  // A double-row of "perforations" that scrolls horizontally
  const cells = Array.from({ length: 60 });
  return (
    <div className={"pointer-events-none select-none " + className}>
      <div className="overflow-hidden opacity-30">
        <div className="flex reel-scroll" style={{ width: "200%" }}>
          {[...cells, ...cells].map((_, i) => (
            <div
              key={i}
              className="flex h-6 w-12 shrink-0 items-center justify-center"
            >
              <div className="h-3 w-7 rounded-[3px] bg-white/40" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilmReel;
