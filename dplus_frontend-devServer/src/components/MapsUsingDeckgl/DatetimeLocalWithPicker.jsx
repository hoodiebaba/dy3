import React, { useRef } from "react";
import { Calendar } from "lucide-react";

function openNativePicker(input) {
  if (!input) return;
  try {
    if (typeof input.showPicker === "function") {
      input.showPicker();
      return;
    }
  } catch {
    /* Some browsers only allow showPicker() from a user gesture; fall through */
  }
  input.click();
}

/** Hide native picker glyph; custom icon handles open (WebKit + Firefox). */
const hideNativePickerGlyph =
  "[&::-webkit-calendar-picker-indicator]:pointer-events-none [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-y-0 [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:z-[1] [&::-webkit-calendar-picker-indicator]:w-8 [&::-webkit-calendar-picker-indicator]:opacity-0 " +
  "[&::-moz-calendar-picker-indicator]:pointer-events-none [&::-moz-calendar-picker-indicator]:opacity-0";

/** Centre the value inside Chromium’s datetime edit wrapper. */
const centerDatetimeValue =
  "[&::-webkit-datetime-edit-fields-wrapper]:flex [&::-webkit-datetime-edit-fields-wrapper]:justify-center";

/**
 * datetime-local with calendar control inside the field (right). Value centred; opens native picker on icon click.
 */
const DatetimeLocalWithPicker = ({
  value,
  onChange,
  id,
  "aria-label": ariaLabel,
  className = "",
  inputClassName = "",
  iconButtonClassName,
  variant = "light",
}) => {
  const inputRef = useRef(null);
  const defaultIconBtn =
    variant === "dark"
      ? "absolute right-1.5 top-1/2 z-20 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded border-0 bg-transparent p-0 text-white transition-colors hover:text-[#F26522] active:text-[#F26522] focus:outline-none focus-visible:text-[#F26522] focus-visible:ring-2 focus-visible:ring-[#F26522]/50"
      : "absolute right-1.5 top-1/2 z-20 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded border-0 bg-transparent p-0 text-gray-600 transition-colors hover:text-[#F26522] active:text-[#F26522] focus:outline-none focus-visible:text-[#F26522] focus-visible:ring-2 focus-visible:ring-[#F26522]/50";

  return (
    <div className={`relative w-full min-w-0 ${className}`}>
      <input
        ref={inputRef}
        id={id}
        type="datetime-local"
        value={value}
        onChange={onChange}
        className={`${inputClassName} min-w-0 w-full !pr-10 !text-center ${hideNativePickerGlyph} ${centerDatetimeValue}`}
        aria-label={ariaLabel}
      />
      <button
        type="button"
        className={iconButtonClassName ?? defaultIconBtn}
        onClick={() => openNativePicker(inputRef.current)}
        title="Select date and time"
        aria-label="Open date and time picker"
      >
        <Calendar className="h-4 w-4 shrink-0 pointer-events-none" strokeWidth={2} aria-hidden />
      </button>
    </div>
  );
};

export default DatetimeLocalWithPicker;
