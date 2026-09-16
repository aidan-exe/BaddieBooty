import type { ProductArt } from "@/lib/products";

const artClass = "h-full w-full";

export function ProductArt({
  art,
  className = "",
}: {
  art: ProductArt;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {art === "ab-board" && <AbBoardArt />}
      {art === "bra" && <BraArt />}
      {art === "pillow" && <PillowArt />}
      {art === "faja" && <FajaArt />}
      {art === "board" && <BoardArt />}
      {art === "bodysuit" && <BodysuitArt />}
      {art === "levanta" && <LevantaArt />}
      {art === "trainer" && <TrainerArt />}
    </div>
  );
}

function AbBoardArt() {
  return (
    <svg viewBox="0 0 320 400" className={artClass} role="presentation">
      <defs>
        <linearGradient id="ab-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#EAD9C8" />
          <stop offset="100%" stopColor="#C4A484" />
        </linearGradient>
      </defs>
      <rect width="320" height="400" fill="url(#ab-bg)" />
      <rect x="70" y="72" width="180" height="256" rx="18" fill="#F8F1EA" opacity="0.92" />
      <rect x="88" y="92" width="144" height="18" rx="9" fill="#D4B896" />
      <rect x="88" y="128" width="144" height="160" rx="12" fill="#E8C4B8" />
      <rect x="108" y="152" width="104" height="10" rx="5" fill="#7A2E3A" opacity="0.35" />
      <rect x="108" y="176" width="104" height="10" rx="5" fill="#7A2E3A" opacity="0.25" />
      <rect x="108" y="200" width="104" height="10" rx="5" fill="#7A2E3A" opacity="0.18" />
      <circle cx="160" cy="248" r="16" fill="#7A2E3A" opacity="0.2" />
    </svg>
  );
}

function BraArt() {
  return (
    <svg viewBox="0 0 320 400" className={artClass} role="presentation">
      <defs>
        <linearGradient id="bra-bg" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#E8B4B8" />
          <stop offset="100%" stopColor="#7A2E3A" />
        </linearGradient>
      </defs>
      <rect width="320" height="400" fill="url(#bra-bg)" />
      <path
        d="M70 210c0-48 34-78 70-78 18 0 30 10 20 28 12-22 28-28 46-28 38 0 64 32 64 78 0 46-42 78-90 78s-110-32-110-78z"
        fill="#FFF8F2"
        opacity="0.94"
      />
      <path
        d="M96 168c18-8 38-6 50 12"
        fill="none"
        stroke="#7A2E3A"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M174 180c14-16 34-20 52-10"
        fill="none"
        stroke="#7A2E3A"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M110 118c8-28 28-44 50-44"
        fill="none"
        stroke="#F8F1EA"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d="M210 118c-8-28-28-44-50-44"
        fill="none"
        stroke="#F8F1EA"
        strokeWidth="7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PillowArt() {
  return (
    <svg viewBox="0 0 320 400" className={artClass} role="presentation">
      <defs>
        <linearGradient id="pillow-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F3E1C8" />
          <stop offset="100%" stopColor="#B54A5A" />
        </linearGradient>
      </defs>
      <rect width="320" height="400" fill="url(#pillow-bg)" />
      <ellipse cx="160" cy="208" rx="118" ry="78" fill="#FFF8F2" opacity="0.95" />
      <ellipse cx="160" cy="200" rx="86" ry="46" fill="#E8B4B8" />
      <ellipse cx="160" cy="196" rx="42" ry="22" fill="#7A2E3A" opacity="0.22" />
      <path
        d="M70 208c20 28 54 44 90 44s70-16 90-44"
        fill="none"
        stroke="#5C3D32"
        strokeWidth="5"
        opacity="0.35"
      />
    </svg>
  );
}

function FajaArt() {
  return (
    <svg viewBox="0 0 320 400" className={artClass} role="presentation">
      <defs>
        <linearGradient id="faja-bg" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9A3B4A" />
          <stop offset="100%" stopColor="#2C1810" />
        </linearGradient>
      </defs>
      <rect width="320" height="400" fill="url(#faja-bg)" />
      <path
        d="M118 56h84l18 56c28 22 40 58 32 104l-22 128H90L68 216c-8-46 4-82 32-104z"
        fill="#F8F1EA"
        opacity="0.95"
      />
      <path
        d="M132 128c18 10 38 10 56 0"
        fill="none"
        stroke="#7A2E3A"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M124 176c24 14 48 14 72 0"
        fill="none"
        stroke="#C45C6A"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M116 224c28 16 60 16 88 0"
        fill="none"
        stroke="#7A2E3A"
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  );
}

function BoardArt() {
  return (
    <svg viewBox="0 0 320 400" className={artClass} role="presentation">
      <defs>
        <linearGradient id="board-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#5C3D32" />
          <stop offset="100%" stopColor="#D4B896" />
        </linearGradient>
      </defs>
      <rect width="320" height="400" fill="url(#board-bg)" />
      <rect x="64" y="80" width="192" height="240" rx="20" fill="#FFF8F2" />
      <rect x="88" y="108" width="144" height="184" rx="12" fill="#EAD9C8" />
      <path d="M88 200h144" stroke="#7A2E3A" strokeWidth="4" opacity="0.35" />
      <path d="M88 236h144" stroke="#7A2E3A" strokeWidth="4" opacity="0.2" />
      <circle cx="160" cy="156" r="18" fill="#B54A5A" opacity="0.45" />
    </svg>
  );
}

function BodysuitArt() {
  return (
    <svg viewBox="0 0 320 400" className={artClass} role="presentation">
      <defs>
        <linearGradient id="body-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#C45C6A" />
          <stop offset="100%" stopColor="#3A1C22" />
        </linearGradient>
      </defs>
      <rect width="320" height="400" fill="url(#body-bg)" />
      <path
        d="M128 48h64v36l28 20-10 48c22 18 30 52 22 96l-18 96H106l-18-96c-8-44 0-78 22-96l-10-48 28-20z"
        fill="#FFF8F2"
        opacity="0.94"
      />
      <path
        d="M132 168c18-28 38-28 56 0"
        fill="none"
        stroke="#7A2E3A"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M118 248c28 20 56 20 84 0"
        fill="none"
        stroke="#B54A5A"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LevantaArt() {
  return (
    <svg viewBox="0 0 320 400" className={artClass} role="presentation">
      <defs>
        <linearGradient id="lev-bg" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#8B3A4A" />
          <stop offset="100%" stopColor="#E8B4B8" />
        </linearGradient>
      </defs>
      <rect width="320" height="400" fill="url(#lev-bg)" />
      <path
        d="M112 64h96l16 72c24 16 36 48 28 92l-8 108H76l-8-108c-8-44 4-76 28-92z"
        fill="#FFF8F2"
        opacity="0.95"
      />
      <ellipse cx="132" cy="268" rx="28" ry="36" fill="#C45C6A" opacity="0.55" />
      <ellipse cx="188" cy="268" rx="28" ry="36" fill="#C45C6A" opacity="0.55" />
      <path
        d="M120 176c26 18 54 18 80 0"
        fill="none"
        stroke="#7A2E3A"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TrainerArt() {
  return (
    <svg viewBox="0 0 320 400" className={artClass} role="presentation">
      <defs>
        <linearGradient id="train-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D4B896" />
          <stop offset="100%" stopColor="#7A2E3A" />
        </linearGradient>
      </defs>
      <rect width="320" height="400" fill="url(#train-bg)" />
      <path
        d="M86 96h148l-18 56c-8 28-28 48-56 48s-48-20-56-48z"
        fill="#FFF8F2"
      />
      <path
        d="M96 200h128l-12 96H108z"
        fill="#F8F1EA"
        opacity="0.92"
      />
      <path d="M112 140h96" stroke="#7A2E3A" strokeWidth="4" />
      <path d="M120 168h80" stroke="#B54A5A" strokeWidth="4" />
      <path d="M128 228h64" stroke="#7A2E3A" strokeWidth="4" opacity="0.5" />
      <circle cx="160" cy="252" r="10" fill="#D4B896" />
    </svg>
  );
}
