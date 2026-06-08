import Image from "next/image";
import Link from "next/link";

export default function Logo({
	className,
	src = "/assets/icons/logo.svg",
	alt = "Логотип",
	width = 162.77,
	height = 30,
}: {
	className?: string;
	src?: string;
	alt?: string;
	width?: number;
	height?: number;
}) {
	return (
		<Link href={"/"} className={className}>
			<Image
				src={src}
				alt={alt}
				width={width}
				height={height}
				// className={className}
			/>
		</Link>
	);
}
