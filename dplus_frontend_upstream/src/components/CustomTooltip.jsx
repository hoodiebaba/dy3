const CustomTooltip = ({ text, children }) => {
    return (
        <div className="relative group flex flex-col items-center">
            {children}
            {/* Speech bubble */}
            <div className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-[9999] opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex flex-col items-center">
                {/* Box */}
                <div className="bg-gray-800 text-white text-[11px] font-medium px-2.5 py-1.5 rounded-md whitespace-nowrap shadow-lg">
                    {text}
                </div>
                {/* Downward arrow */}
                <div className="w-0 h-0" style={{
                    borderLeft: '5px solid transparent',
                    borderRight: '5px solid transparent',
                    borderTop: '5px solid #1f2937',
                }} />
            </div>
        </div>
    );
};

export default CustomTooltip;
