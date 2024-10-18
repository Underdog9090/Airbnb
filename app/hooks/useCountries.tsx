import countries from "world-countries";
import emojiFlags from "emoji-flags";

const formatedCountries = countries.map((country) => {
    const flagData = emojiFlags.countryCode(country.cca2); // Fetch flag using cca2
    return {
      label: country.name.common,
      value: country.cca2,
      flag: flagData ? flagData.emoji : "", // Use emoji flag if available
      latlng: country.latlng,
      region: country.region,
    };
  });

const useCountries = () => {
    const getAllCountries = () => {
        return formatedCountries;
    };

    const getByRegion = (region: string) => {
        return formatedCountries.filter((country) => country.region === region);
    };

    const getByCountryCode = (code: string) => {    
        return formatedCountries.find((country) =>  country.value === code);
    };

    const getByValue = (value: string) => {
        return formatedCountries.find((country) => country.value === value);
    };

    return { getAllCountries, getByRegion, getByCountryCode, getByValue };
};

export default useCountries;