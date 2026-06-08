"use client";

import Image from "next/image";
import Link from "next/link";

import bonusGif from "@/public/assets/gifs/bonus.gif";
import { useUser } from "@/shared/layouts/auth-provider/auth-provider";

export const Bonus = () => {
  const { isAuthenticated } = useUser();
  const profileHref = isAuthenticated ? "/profile" : "/auth";

  return (
    // Реферальная программа   
			
    <section className="bg-gradient-to-b from-[#262C55] from-[16.45%] to-[#46386E] to-[82.49%] shadow-[0px_8px_10px_-6px_#0000000D] h-auto rounded-[16px] md:p-10 p-[24px] flex gap-[40px] md:gap-0 flex-col-reverse md:h-[278px] md:flex-row items-center justify-between box-border">
      <h2 className="sr-only">Реферальная программа в TGStars</h2>
    <div className="">
      <div className="w-full max-w-[280px]">
        <p className="font-mts-wide font-bold text-[32px] leading-[30px] text-white">Реферальная программа</p>
        <p className="font-mts-text leading-[22px] mt-[14px] text-white md:text-[16px] text-[14px]">Получайте 5% Звёзд от покупок друзей на ваш баланс</p>
        </div>
        <Link href={profileHref} className="mt-[33px] w-full text-center md:w-fit font-mts-text font-medium inline-block rounded-full px-[25px] py-[10px] box-border text-white border border-[#EAEEF0] border-2">
          Присоединиться
        </Link>
      </div>
      <div className="">
        <Image
          src={bonusGif}
          alt="Бонус"
          width={280}
          height={280}
          className="h-[280px] w-[280px] object-contain rounded-[25px] md:h-[200px] md:w-[200px] rounded-[32px]"
        />
      </div>

    </section>   
  )
}
