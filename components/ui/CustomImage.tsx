"use client";
import { useState } from "react";
import Image, { ImageProps } from "next/image";
import { cn } from "@/lib/utils";

interface CustomImageProps extends Omit<ImageProps, "onLoadingComplete"> {
  className?: string;
  priority?: boolean;
  title?: string;
}

const CustomImage = ({ className, priority = false, alt, title, ...props }: CustomImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  return (
    <Image
      {...props}
      alt={alt}
      title={title}
      priority={priority}
      onLoad={() => setIsLoading(false)}
      className={cn(
        "object-contain transition duration-300 w-auto h-auto",
        isLoading ? "blur-md scale-105" : "blur-0 scale-100",
        className
      )}
    />
  );
};


export default CustomImage;