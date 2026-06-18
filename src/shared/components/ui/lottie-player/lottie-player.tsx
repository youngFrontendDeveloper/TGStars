"use client";

import Lottie from "lottie-react";

type Props = {
  animationData: object;
  className?: string;
};

export function LottiePlayer({ animationData, className }: Props) {
  return (
    <Lottie
      animationData={animationData}
      loop
      autoplay
      className={className}
    />
  );
}