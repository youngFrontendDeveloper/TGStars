import Image from "next/image";
import Link from "next/link";

export default function Logo({
	className,
	src = "/assets/icons/logo.svg",
	alt = "Логотип",	
	width = 163,
	height = 'auto',	
}: {
	className?: string;
	src?: string;
	alt?: string;
	width?: number;
	height?: number | string;
}) {
	return (
		<Link href={"/"} className={className}>
			<Image
				src={src}
				alt={alt}			
				width={0}
				height={0}
				sizes="100vw"
				style={{ width: width, height: height }}
			/>
		</Link>
	);
}
