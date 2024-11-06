// Calender.tsx
"use client";

import { Range as DateRangeType, DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

interface CalenderProps {
  value: DateRangeType[];
  onChange: (value: any) => void;
  disabledDates?: Date[];
}

const Calender: React.FC<CalenderProps> = ({ value, onChange, disabledDates }) => {
  return (
    <div className="calendar-container">
      <DateRange
        rangeColors={["#2563EB"]} // Custom blue color for date selection
        ranges={value}
        onChange={onChange}
        direction="vertical"
        showDateDisplay={false}
        minDate={new Date()}
        disabledDates={disabledDates}
        className="custom-calendar" // Additional styling class
      />
    </div>
  );
};

export default Calender;
