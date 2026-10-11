import { weather } from '@/lib/mobile-data'

/** 天气卡（参考图 y 161~272，横向蓝色渐变，逐像素采样自参考图） */
export function WeatherCard() {
  return (
    <section className="relative h-[111px] overflow-hidden rounded-[16px] bg-[linear-gradient(90deg,#3F57AF_0%,#6A85D0_100%)] text-white">
      {/* 云 */}
      <svg
        viewBox="0 0 48 38"
        className="absolute top-[19px] left-[19px] h-[38px] w-[48px]"
        aria-hidden
      >
        <defs>
          <linearGradient id="cloudBody" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="62%" stopColor="#F3F1FB" />
            <stop offset="100%" stopColor="#D8D3F0" />
          </linearGradient>
        </defs>
        {/* 后面被遮住的云团 */}
        <path
          d="M20 12a10 10 0 0 1 19 3 7 7 0 0 1-1 14H21a7 7 0 0 1-2-13.7A9 9 0 0 1 20 12Z"
          fill="#FFFFFF"
          opacity="0.55"
        />
        <path
          d="M12 16a9 9 0 0 1 17 2 7 7 0 0 1-1 13H12a8 8 0 0 1-1.7-15.8A9 9 0 0 1 12 16Z"
          fill="url(#cloudBody)"
        />
        <path d="M6 26h30a7 7 0 0 1 0 4H6Z" fill="#FFFFFF" opacity="0.25" />
      </svg>

      {/* 天气现象 */}
      <span className="absolute top-[24px] left-[83px] text-[17px] leading-none">
        {weather.condition}
      </span>

      {/* 温度 */}
      <span className="absolute top-[18px] right-[20px] text-[34px] leading-none font-medium">
        {weather.temp}°
      </span>

      {/* 风向 */}
      <span className="absolute bottom-[19px] left-[20px] text-[15px] leading-none">
        {weather.wind}
      </span>

      {/* 城市 */}
      <span className="absolute right-[20px] bottom-[19px] flex items-center gap-[5px] text-[15px] leading-none">
        {weather.city}
        <svg viewBox="0 0 10 6" className="h-[6px] w-[10px]" aria-hidden>
          <path d="M0 0h10L5 6Z" fill="#FFFFFF" />
        </svg>
      </span>
    </section>
  )
}
