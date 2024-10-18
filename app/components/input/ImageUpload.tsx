"use client";

import {
  CldUploadWidget,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import { useCallback } from "react";
import { TbPhotoPlus } from "react-icons/tb";
import Image from "next/image";

declare global {
  var cloudinary: any;
}

interface ImageUploadProps {
  onChange: (value: string) => void;
  value: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onChange, value }) => {
  const handleUpload = useCallback(
    (results: CloudinaryUploadWidgetResults) => {
      console.log("sucess", results);
      if (
        results.event === "success" &&
        results.info &&
        typeof results.info !== "string"
      ) {
        onChange(results.info.secure_url);
      }
    },
    [onChange]
  );

  console.log(value);
  return (
    <CldUploadWidget
      // @ts-ignore
      onSuccess={handleUpload}
      uploadPreset="ah2vqa6l"
      options={{
        maxFiles: 1,
      }}
    >
      {({ open }) => {
        return (
          <div
            onClick={() => open?.()}
            className="
              relative
              cursor-pointer
              hover:opacity-70
              transition
              border-dashed
              border-2
              p-20
              border-neutral-300
              flex
              flex-col
              justify-center
              items-center
              gap-4
              text-neutral-600
            "
          >
            <TbPhotoPlus size={32} />
            <div
              className="text-center
              font-bold
              text-lg"
            >
              Upload Image
            </div>
            {value && (
              <div
                className="
                absolute
                inset-0
                w-full
                h-full
                "
              >
                import Image from 'next/image';
                <Image
                  alt="Uploaded Image"
                  src={value} 
                  layout="fill"
                  objectFit="cover" 
                  objectPosition="center" 
                  className="rounded-lg shadow-lg" // Optional: Add styles for better presentation
                  quality={90} // Optional: Adjust the quality of the image
                  priority // Optional: Prioritize loading for important images
                />
              </div>
            )}
          </div>
        );
      }}
    </CldUploadWidget>
  );
};

export default ImageUpload;
