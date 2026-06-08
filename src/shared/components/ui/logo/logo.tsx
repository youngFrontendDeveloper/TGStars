import Image from "next/image";



export default function Logo({ className, src = "/assets/icons/logo.svg", alt = "Logo", width = 210, height = 38 }: { className?: string, src?: string, alt?: string, width?: number, height?: number }) {
  return (
      <Image 
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={className}
        />    
  );
}