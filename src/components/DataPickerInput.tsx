import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './datepicker-tailwind.css'; // We'll create this next

type DateSelection = {
    onSelectDate: (date: Date) => void;
}

const DatePickerInput: React.FC<DateSelection> = ({onSelectDate}) => {
  const [selectedDate, setSelectedDate] = useState(new Date()); // default to today

  useEffect(() => {
    onSelectDate(selectedDate);
  }, [selectedDate]);
  
  return (
    <div className="flex flex-col items-start">
      <label className="mb-1 text-sm font-medium text-gray-700">Select Date</label>
      <DatePicker
        dateFormat="dd MMM, YYYY"
        selected={selectedDate}
        onChange={(date: Date | null) => {
            if (date) setSelectedDate(date);
        }}
      />
    </div>
  );
};

export default DatePickerInput;
