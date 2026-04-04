const OpacitySlider = ({ value, onChange, disabled = false }) => {
  return (
    <div className={`mb-3 pt-3 ${disabled ? "opacity-40 pointer-events-none" : ""}`}>
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-semibold text-gray-500">Opacity</span>
        <span className="text-xs text-gray-600">{Math.round(value * 100)}%</span>
      </div>
      <input
        type="range"
        min="0.01"
        max="1"
        step="0.01"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        className="w-full"
      />
    </div>
  );
};

export default OpacitySlider;
