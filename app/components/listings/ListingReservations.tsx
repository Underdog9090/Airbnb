"use client";

import { Range as DateRangeType } from "react-date-range";
import Calender from "@/app/components/input/Calender";
import { useMemo } from "react";

interface ListingReservationsProps {
  price: number;
  dateRange: DateRangeType[];
  totalPrice: number;
  onChangeDate: (value: DateRangeType) => void;
  onSubmit: () => void;
  disabledDates: Date[];
  disabled: boolean;
}

const ListingReservations: React.FC<ListingReservationsProps> = ({
  price,
  dateRange,
  totalPrice,
  onChangeDate,
  onSubmit,
  disabledDates,
  disabled,
}) => {
  // Calculate number of nights
  const nights = useMemo(
    () => (dateRange[0]?.endDate && dateRange[0]?.startDate
      ? Math.floor((dateRange[0].endDate.getTime() - dateRange[0].startDate.getTime()) / (1000 * 3600 * 24))
      : 0),
    [dateRange]
  );

  return (
    <div className="bg-white rounded-xl border-[1px] border-neutral-200 overflow-hidden shadow-md">
      {/* Price and Info */}
      <div className="p-4 border-b-[1px] border-neutral-200">
        <div className="flex flex-row items-center justify-between">
          <div className="text-2xl font-semibold">${price} <span className="text-base font-normal">per night</span></div>
          <div className="text-sm text-neutral-500">{nights} nights</div>
        </div>
      </div>

      {/* Calendar Component */}
      <div className="p-4">
        <Calender
          value={dateRange}
          disabledDates={disabledDates}
          onChange={(ranges) => onChangeDate(ranges.selection)}
        />
      </div>

      {/* Total Price and Reserve Button */}
      <div className="p-4 border-t-[1px] border-neutral-200 flex flex-row items-center justify-between">
        <div className="text-lg font-semibold">Total: ${totalPrice}</div>
        <button
          onClick={onSubmit}
          disabled={disabled}
          className={`${
            disabled ? 'bg-gray-300' : 'bg-blue-600 hover:bg-blue-700'
          } text-white font-semibold py-2 px-4 rounded-md`}
        >
          Reserve
        </button>
      </div>
    </div>
  );
};

export default ListingReservations;
