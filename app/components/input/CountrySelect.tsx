"use client";

import Select from "react-select";
import useCountries from "../../hooks/useCountries";

export type CountrySelectValue = {
  flag: string;
  label: string;
  latlng: number[];
  region: string;
  value: string;
};

interface CountrySelectProps {
  value: CountrySelectValue | null;
  onChange: (value: CountrySelectValue | null) => void;
}

const CountrySelect: React.FC<CountrySelectProps> = ({ value, onChange }) => {
  const getAll = useCountries();

  return (
    <div>
      <Select
        placeholder="Select a country"
        isClearable
        options={getAll.getAllCountries()}
        value={value}
        onChange={(value) => onChange(value as CountrySelectValue)}
        formatOptionLabel={(option: any) => (
          <div className="flex flex-row items-center gap-3">
            <div>{option.flag}</div>
            <div>
              {option.label}
              <span className="text-neutral-800 ml-1">({option.region})</span>
            </div>
          </div>
        )}
        classNamePrefix="custom-select" // Added for custom CSS styling
      />
    </div>
  );
};

export default CountrySelect;
