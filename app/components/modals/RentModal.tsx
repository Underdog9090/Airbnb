"use client";
import Modal from "./Modal";
import { useState, useCallback, useMemo } from "react";
import useRentModal from "../../hooks/useRentModal";
import Heading from "../Heading";
import { categories } from "../navbar/Categories";
import CategoryInput from "../../components/input/CategoryInput";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import CountrySelect, { CountrySelectValue } from "../input/CountrySelect";
import dynamic from "next/dynamic";
import Counter from "../Counter";
import ImageUpload from "../input/ImageUpload";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import L from "leaflet";

enum STEPS {
  CATEGORY = 0,
  LOCATION = 1,
  DETAILS = 2,
  PHOTOS = 3,
  DESCRIPTION = 4,
  PRICE = 5,
}

const RentModal = () => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const rentModal = useRentModal();
  const [step, setStep] = useState(STEPS.CATEGORY);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [center, setCenter] = useState<CountrySelectValue | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      category: "",
      address: "",
      guestCount: 1,
      roomCount: 1,
      bathroomCount: 1,
      image: "",
      price: 1,
      title: "",
      description: "",
    },
  });

  const location = watch("address");
  const router = useRouter();
  const category = watch("category");
  const guestCount = watch("guestCount");
  const roomCount = watch("roomCount");
  const bathroomCount = watch("bathroomCount");
  const imageSrc = watch("image");

  const Map = useMemo(() => dynamic(() => import("../Map"), { ssr: false }), [location]);

  const setCustomValue = useCallback(
    (name: string, value: any) => {
      setValue(name, value, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    },
    [setValue]
  );

  // Handle category selection
  const handleCategorySelect = useCallback(
    (categoryLabel: string) => {
      setCustomValue("category", categoryLabel); // Set category in the form
      setSelectedCategory(categoryLabel); // Update local state for UI
    },
    [setCustomValue]
  );

  const onBack = () => {
    if (step === STEPS.CATEGORY) {
      rentModal.onClose();
    } else {
      setStep((prev) => prev - 1);
    }
  };

  const onNext = () => {
    if (step !== STEPS.PRICE) {
      setStep((prev) => prev + 1);
    } else {
      rentModal.onClose();
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (!session) {
      toast.error("You need to be logged in to post a listing.");
      return;
    }

    if (step !== STEPS.PRICE) {
      return onNext();
    }

    setIsLoading(true);

    axios
      .post("/api/listings", data)
      .then(() => {
        toast.success("Property published successfully!");
        router.refresh();
        reset();
        setStep(STEPS.CATEGORY);
        rentModal.onClose();
      })
      .catch(() => {
        toast.error("An error occurred. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const actionLabel = step === STEPS.PRICE ? "Publish" : "Next";
  const secondaryLabel = step === STEPS.CATEGORY ? "Cancel" : "Back";

  let bodyContent: React.ReactNode = (
    <div className="flex flex-col gap-8">
      <Heading title="Choose to your satisfaction" subtitle="Select the category that best fits your property" />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[50vh] overflow-y-auto">
        {categories.map((category) => (
          <div key={category.label} className="col-span-1">
            <CategoryInput
              onClick={() => handleCategorySelect(category.label)}
              label={category.label}
              selected={selectedCategory === category.label}
              icon={category.icon}
            />
          </div>
        ))}
      </div>
    </div>
  );

  if (step === STEPS.LOCATION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading title="Where is your property located?" subtitle="Enter the address of your property" />
        <CountrySelect
          value={center}
          onChange={(value) => {
            setCenter(value);
            setCustomValue("address", value);
          }}
        />
        <Map
          center={center?.latlng as L.LatLngExpression || [51.505, -0.09]}
          position={location?.latlng as L.LatLngExpression}
          setPosition={(position) => {
            const _address = watch("address");
            if (_address) {
              _address.latlng = position;
              setCustomValue("address", _address);
            }
          }}
        />
      </div>
    );
  }

  if (step === STEPS.DETAILS) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading title="Details" subtitle="Enter the number of guests, rooms, and bathrooms" />
        <Counter
          title="Guests"
          subtitle="How many guests can your property accommodate?"
          value={guestCount}
          onChange={(value) => setCustomValue("guestCount", value)}
        />
        <hr />
        <Counter title="Rooms" subtitle="How many rooms are available?" value={roomCount} onChange={(value) => setCustomValue("roomCount", value)} />
        <hr />
        <Counter title="Bathrooms" subtitle="How many bathrooms are available?" value={bathroomCount} onChange={(value) => setCustomValue("bathroomCount", value)} />
      </div>
    );
  }

  if (step === STEPS.PHOTOS) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading title="Photos" subtitle="Upload photos of your property" />
        <ImageUpload value={imageSrc} onChange={(value) => setCustomValue("image", value)} />
      </div>
    );
  }

  if (step === STEPS.DESCRIPTION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading title="Description" subtitle="Enter a title and description for your property" />
        <input
          id="title"
          type="text"
          placeholder="Title"
          disabled={isLoading}
          className="input"
          {...register("title", { required: "Title is required" })}
        />
        <hr />
        <textarea
          placeholder="Description"
          className="input"
          {...register("description", { required: "Description is required" })}
        />
        {errors.title?.message && <p className="error-message">{String(errors.title.message)}</p>}
        {errors.description?.message && <p className="error-message">{String(errors.description.message)}</p>}
      </div>
    );
  }

  if (step === STEPS.PRICE) {

    const currencies = [
      { label: "SEK", value: "SEK" },
      { label: "USD", value: "USD" },
      { label: "EUR", value: "EUR" },
      // Add more currencies as needed
    ];
    

    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading title="Price" subtitle="Set the price for your property" />
        
        {/* Currency Selector */}
        <select
          {...register("currency", { required: "Currency is required" })}
          disabled={isLoading}
          className="input"
        >
          {currencies.map((currency) => (
            <option key={currency.value} value={currency.value}>
              {currency.label}
            </option>
          ))}
        </select>
        
        <div className="flex items-center gap-2">
          <input
            id="price"
            type="number"
            placeholder="Price"
            {...register("price", { required: "Price is required" })}
            disabled={isLoading}
            className="input"
          />
          {/* Display currency symbol next to price input */}
          <span className="currency-symbol">{watch("currency")}</span>
        </div>
        
        {errors.price?.message && <p className="error-message">{String(errors.price.message)}</p>}
        {errors.currency?.message && <p className="error-message">{String(errors.currency.message)}</p>}
      </div>
    );
  }
  

  return (
    <Modal
      isOpen={rentModal.isOpen}
      onClose={rentModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      actionLabel={actionLabel}
      secondaryActionLabel={secondaryLabel}
      secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
      title="Airbnb your home"
      body={bodyContent}
      footer
    />
  );
};

export default RentModal;
