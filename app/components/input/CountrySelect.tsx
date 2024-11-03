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
  const { getAllCountries } = useCountries();

  return (
    <Select
      placeholder="Select a country"
      isClearable
      options={getAllCountries()}
      value={value}
      onChange={(option) => onChange(option as CountrySelectValue)}
      formatOptionLabel={(option: CountrySelectValue) => (
        <div className="flex items-center gap-3">
          <span>{option.flag}</span>
          <span>{option.label}</span>
          <span className="text-neutral-600 ml-1">({option.region})</span>
        </div>
      )}
      classNamePrefix="custom-select"
    />
  );
};

export default CountrySelect;
