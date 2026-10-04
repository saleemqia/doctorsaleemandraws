import { motion } from "framer-motion";

// Simple, original cross-section drawings of a tooth, animated step by step.
// viewBox is 0 0 240 280 for every scene. `step` is the current step (0-based).

type L = "en" | "ar" | "ku";
export interface SceneProps { step: number; lang: L }

const C = {
  bg: "#eef8ff",
  bone: "#f1dfbd",
  boneDot: "#e2c99c",
  gum: "#f3a3ae",
  gumDark: "#e2808e",
  dentin: "#fbf5e6",
  enamel: "#ffffff",
  outline: "#b9a888",
  pulp: "#e5484d",
  pulpClean: "#fde8e8",
  gutta: "#f59e0b",
  decay: "#5b3a1e",
  sky: "#0ea5e9",
  skyDark: "#0369a1",
  titanium: "#9aa8b6",
  titaniumDark: "#5f6d7b",
};

// Tooth outline (molar with two roots), crown enamel, pulp (chamber + 2 canals), access cavity.
const T_OUT = "M80 40 C80 22 100 18 120 26 C140 18 160 22 160 40 L158 110 C156 130 152 150 150 170 L146 238 C145 250 132 252 131 240 L126 180 C124 172 116 172 114 180 L109 240 C108 252 95 250 94 238 L90 170 C88 150 84 130 82 110 Z";
const T_ENAMEL = "M80 40 C80 22 100 18 120 26 C140 18 160 22 160 40 L158 108 Q120 116 82 108 Z";
const T_PULP = "M104 66 Q120 58 136 66 L136 100 L140 230 Q138 236 135 230 L129 112 Q120 106 111 112 L105 230 Q102 236 100 230 L104 100 Z";
const T_ACCESS = "M108 30 Q120 26 132 30 L134 70 Q120 64 106 70 Z";
const T_CROWN_CAP = "M76 46 C76 18 100 12 120 22 C140 12 164 18 164 46 L162 112 Q120 122 78 112 Z";
const T_STUMP = "M94 62 Q94 46 120 44 Q146 46 146 62 L150 112 Q120 118 90 112 Z";

const fade = (on: boolean, delay = 0) => ({
  initial: false as const,
  animate: { opacity: on ? 1 : 0 },
  transition: { duration: 0.6, delay: on ? delay : 0 },
});

const Defs = () => (
  <defs>
    <pattern id="boneDots" width="14" height="14" patternUnits="userSpaceOnUse">
      <circle cx="3" cy="3" r="1.6" fill={C.boneDot} />
      <circle cx="10" cy="9" r="1.2" fill={C.boneDot} />
    </pattern>
    <linearGradient id="titan" x1="0" x2="1">
      <stop offset="0" stopColor="#c7d1da" />
      <stop offset="0.5" stopColor={C.titanium} />
      <stop offset="1" stopColor={C.titaniumDark} />
    </linearGradient>
    <linearGradient id="ceramic" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#ffffff" />
      <stop offset="1" stopColor="#f3f7fb" />
    </linearGradient>
    <clipPath id="pulpClip"><path d={T_PULP} /></clipPath>
    <clipPath id="stumpClip"><path d={T_STUMP} /></clipPath>
    <clipPath id="rootClip"><rect x="0" y="121" width="240" height="159" /></clipPath>
    <clipPath id="neckClip"><rect x="0" y="108" width="240" height="172" /></clipPath>
  </defs>
);

const Jaw = ({ gap = false }: { gap?: boolean }) => (
  <>
    <rect width="240" height="280" fill={C.bg} />
    <rect y="140" width="240" height="140" fill={C.bone} />
    <rect y="140" width="240" height="140" fill="url(#boneDots)" />
    <path
      d={gap ? "M0 168 L0 124 Q60 118 88 122 Q120 136 152 122 Q180 118 240 124 L240 168 Z" : "M0 168 L0 124 Q60 118 120 120 Q180 118 240 124 L240 168 Z"}
      fill={C.gum}
    />
  </>
);

const Tooth = ({ pulpColor = C.pulp, enamel = true }: { pulpColor?: string; enamel?: boolean }) => (
  <>
    <path d={T_OUT} fill={C.dentin} stroke={C.outline} strokeWidth="2" />
    {enamel && <path d={T_ENAMEL} fill={C.enamel} opacity="0.9" />}
    <motion.path d={T_PULP} initial={false} animate={{ fill: pulpColor }} transition={{ duration: 0.8 }} />
  </>
);

const Syringe = ({ on }: { on: boolean }) => (
  <motion.g initial={false} animate={{ opacity: on ? 1 : 0, x: on ? 0 : -30, y: on ? 0 : -30 }} transition={{ duration: 0.7 }}>
    <g transform="rotate(-35 40 120)">
      <rect x="-40" y="112" width="58" height="16" rx="4" fill="#ffffff" stroke="#94a3b8" strokeWidth="2" />
      <rect x="-52" y="116" width="14" height="8" rx="2" fill="#94a3b8" />
      <rect x="-8" y="114" width="20" height="12" fill="#bae6fd" />
      <line x1="18" y1="120" x2="62" y2="120" stroke="#64748b" strokeWidth="2" />
    </g>
  </motion.g>
);

const Pain = ({ on }: { on: boolean }) => (
  <motion.g {...fade(on)}>
    {[0, 1, 2].map((i) => (
      <motion.path
        key={i}
        d={`M${168 + i * 6} ${30 + i * 12} q12 -6 18 4`}
        stroke="#ef4444"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        animate={on ? { opacity: [0.2, 1, 0.2] } : {}}
        transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
      />
    ))}
  </motion.g>
);

const Label = ({ on, x, y, children }: { on: boolean; x: number; y: number; children: string }) => (
  <motion.g {...fade(on, 0.3)}>
    <rect x={x - Math.max(44, children.length * 3.6 + 12)} y={y - 14} width={Math.max(88, children.length * 7.2 + 24)} height="22" rx="11" fill={C.skyDark} />
    <text x={x} y={y + 2} textAnchor="middle" fontSize="11" fontWeight="700" fill="#ffffff" fontFamily="system-ui, sans-serif">
      {children}
    </text>
  </motion.g>
);

// ---------- Root canal treatment: 5 steps ----------
export const RootCanalScene = ({ step }: SceneProps) => (
  <>
    <Defs />
    <Jaw />
    <Tooth pulpColor={step >= 2 ? C.pulpClean : C.pulp} />
    {/* inflamed pulp glow */}
    <motion.path
      d={T_PULP}
      fill="none"
      stroke="#f87171"
      strokeWidth="5"
      initial={false}
      animate={step < 2 ? { opacity: [0.2, 0.9, 0.2] } : { opacity: 0 }}
      transition={step < 2 ? { duration: 1.4, repeat: Infinity } : { duration: 0.4 }}
    />
    {/* decay */}
    <motion.ellipse cx="146" cy="40" rx="11" ry="9" fill={C.decay} {...fade(step === 0)} />
    {/* abscess at root tip */}
    <motion.circle
      cx="140" cy="248" r="11" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2"
      style={{ transformBox: "fill-box", transformOrigin: "center" }}
      initial={false}
      animate={step < 4 ? { opacity: 1, scale: step === 0 ? [1, 1.15, 1] : 0.9 } : { opacity: 0, scale: 0.3 }}
      transition={step === 0 ? { duration: 1.4, repeat: Infinity } : { duration: 0.8 }}
    />
    <Pain on={step === 0} />
    <Syringe on={step === 1} />
    {/* opening in the crown */}
    <motion.path d={T_ACCESS} fill="#3b2a20" {...fade(step >= 1 && step < 4, 0.5)} />
    {/* file cleaning the canal */}
    <motion.g
      initial={false}
      animate={step === 2 ? { opacity: 1, y: [0, 26, 0] } : { opacity: 0 }}
      transition={step === 2 ? { duration: 1, repeat: Infinity } : { duration: 0.3 }}
    >
      <rect x="128" y="-6" width="12" height="22" rx="3" fill={C.sky} />
      <line x1="134" y1="16" x2="138" y2="196" stroke="#64748b" strokeWidth="2.5" strokeDasharray="3 2" />
    </motion.g>
    {/* canals filled from the tips upward */}
    <g clipPath="url(#pulpClip)">
      <motion.rect
        x="90" width="60" fill={C.gutta}
        initial={false}
        animate={step >= 3 ? { y: 56, height: 186 } : { y: 242, height: 0 }}
        transition={{ duration: 1.6, ease: "easeInOut" }}
      />
    </g>
    {/* sealed opening */}
    <motion.path d={T_ACCESS} fill="#e8e1d2" stroke={C.outline} {...fade(step === 3, 1.2)} />
    {/* crown */}
    <motion.path
      d={T_CROWN_CAP} fill="url(#ceramic)" stroke={C.sky} strokeWidth="2.5"
      initial={false}
      animate={step >= 4 ? { opacity: 1, y: 0 } : { opacity: 0, y: -70 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
    />
  </>
);

// ---------- Dental implant: 5 steps ----------
const Neighbors = () => (
  <>
    <path d="M-10 40 Q20 22 52 30 L54 108 Q50 150 46 240 Q40 250 30 240 L20 150 Q5 120 -10 110Z" fill={C.dentin} stroke={C.outline} strokeWidth="2" />
    <path d="M-10 40 Q20 22 52 30 L54 106 Q20 112 -10 106 Z" fill={C.enamel} opacity="0.9" />
    <path d="M250 40 Q220 22 188 30 L186 108 Q190 150 194 240 Q200 250 210 240 L220 150 Q235 120 250 110Z" fill={C.dentin} stroke={C.outline} strokeWidth="2" />
    <path d="M250 40 Q220 22 188 30 L186 106 Q220 112 250 106 Z" fill={C.enamel} opacity="0.9" />
  </>
);

const ImplantBody = () => (
  <>
    <path d="M109 150 L131 150 L130 230 Q120 248 110 230 Z" fill="url(#titan)" stroke={C.titaniumDark} strokeWidth="1.5" />
    {Array.from({ length: 9 }, (_, i) => (
      <line key={i} x1="109" y1={158 + i * 8} x2="131" y2={162 + i * 8} stroke={C.titaniumDark} strokeWidth="1.6" />
    ))}
    <rect x="107" y="145" width="26" height="6" rx="1.5" fill={C.titaniumDark} />
  </>
);

export const ImplantScene = ({ step, lang }: SceneProps) => (
  <>
    <Defs />
    <Jaw gap />
    <Neighbors />
    {/* planning lines, scan and surgical guide */}
    <motion.g {...fade(step === 1)}>
      <line x1="120" y1="40" x2="120" y2="256" stroke={C.sky} strokeWidth="2" strokeDasharray="6 4" />
      <path d="M109 150 L131 150 L130 230 Q120 248 110 230 Z" fill="none" stroke={C.sky} strokeWidth="2" strokeDasharray="4 3" />
      <rect x="0" y="24" width="240" height="26" rx="10" fill="rgba(56,189,248,0.35)" stroke={C.sky} strokeWidth="2" />
      <rect x="109" y="18" width="22" height="38" rx="3" fill="none" stroke={C.skyDark} strokeWidth="3" />
    </motion.g>
    <Label on={step === 1} x={120} y={88}>{lang === "en" ? "3D plan" : lang === "ar" ? "خطة 3D" : "پلانا 3D"}</Label>
    {/* implant goes in */}
    <motion.g
      initial={false}
      animate={step >= 2 ? { y: 0, opacity: 1 } : { y: -130, opacity: 0 }}
      transition={{ duration: 1.4, ease: "easeOut" }}
    >
      <ImplantBody />
    </motion.g>
    {/* healing: bone grows around the implant */}
    <motion.g {...fade(step === 3)}>
      {[[100, 170], [140, 182], [98, 205], [142, 214], [104, 236], [136, 240], [120, 252]].map(([x, y], i) => (
        <motion.circle
          key={i} cx={x} cy={y} r="4" fill="#84cc16"
          animate={step === 3 ? { opacity: [0.2, 1, 0.2] } : {}}
          transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </motion.g>
    <Label on={step === 3} x={120} y={88}>{lang === "en" ? "≈ 3 months" : lang === "ar" ? "≈ ٣ أشهر" : "≈ ٣ هەیڤ"}</Label>
    {/* abutment and crown */}
    <motion.path d="M112 146 L128 146 L126 116 L114 116 Z" fill="#cbd5df" stroke={C.titaniumDark} {...fade(step >= 4)} />
    <motion.path
      d="M84 50 C84 30 102 24 120 30 C138 24 156 30 156 50 L154 112 Q120 124 86 112 Z"
      fill="url(#ceramic)" stroke={C.sky} strokeWidth="2.5"
      initial={false}
      animate={step >= 4 ? { opacity: 1, y: 0 } : { opacity: 0, y: -70 }}
      transition={{ duration: 0.9, delay: step >= 4 ? 0.5 : 0, ease: "easeOut" }}
    />
  </>
);

// ---------- Crown with 3D scanner: 4 steps ----------
export const CrownScene = ({ step, lang }: SceneProps) => (
  <>
    <Defs />
    <Jaw />
    {/* broken tooth */}
    <motion.g {...fade(step === 0)}>
      <Tooth pulpColor={C.pulpClean} />
      <polygon points="128,14 170,14 170,72 152,60 146,46 136,40" fill={C.bg} />
      <path d="M128 18 L136 40 L146 46 L152 60 L162 70" fill="none" stroke={C.outline} strokeWidth="2" />
    </motion.g>
    {/* prepared tooth */}
    <motion.g {...fade(step >= 1)}>
      <g clipPath="url(#neckClip)">
        <path d={T_OUT} fill={C.dentin} stroke={C.outline} strokeWidth="2" />
        <path d={T_PULP} fill={C.pulpClean} />
      </g>
      <path d={T_STUMP} fill={C.dentin} stroke={C.outline} strokeWidth="2" />
    </motion.g>
    {/* 3D scan: mesh on the stump and a moving scanner */}
    <motion.g clipPath="url(#stumpClip)" {...fade(step === 2, 0.4)}>
      {Array.from({ length: 8 }, (_, i) => (
        <line key={`h${i}`} x1="86" x2="154" y1={48 + i * 9} y2={48 + i * 9} stroke={C.sky} strokeWidth="1" />
      ))}
      {Array.from({ length: 8 }, (_, i) => (
        <line key={`v${i}`} y1="40" y2="120" x1={92 + i * 9} x2={92 + i * 9} stroke={C.sky} strokeWidth="1" />
      ))}
    </motion.g>
    <motion.g
      initial={false}
      animate={step === 2 ? { opacity: 1, x: [-40, 40, -40] } : { opacity: 0 }}
      transition={step === 2 ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3 }}
    >
      <polygon points="112,22 128,22 142,46 98,46" fill="rgba(14,165,233,0.35)" />
      <rect x="96" y="2" width="48" height="20" rx="8" fill="#ffffff" stroke={C.skyDark} strokeWidth="2" />
      <rect x="140" y="6" width="60" height="12" rx="6" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
    </motion.g>
    <Label on={step === 2} x={120} y={150}>{lang === "en" ? "3D scan" : lang === "ar" ? "مسح 3D" : "سکانا 3D"}</Label>
    {/* new crown */}
    <motion.path
      d={T_CROWN_CAP} fill="url(#ceramic)" stroke={C.sky} strokeWidth="2.5"
      initial={false}
      animate={step >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: -70 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
    />
    <motion.g {...fade(step >= 3, 0.9)}>
      <path d="M96 40 q4 -10 14 -12" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" fill="none" />
    </motion.g>
  </>
);

// ---------- Tooth extraction: 4 steps ----------
export const ExtractionScene = ({ step, lang }: SceneProps) => (
  <>
    <Defs />
    <Jaw />
    {/* socket left after removal, then healing */}
    <g clipPath="url(#rootClip)">
      <motion.path
        d={T_OUT}
        initial={false}
        animate={{ fill: step >= 3 ? "#e9d2a6" : "#7f1d1d", opacity: step >= 2 ? 1 : 0 }}
        transition={{ duration: 1.2, delay: step >= 3 ? 0.2 : 0.6 }}
      />
    </g>
    {/* healing: new bone fills the socket and the gum closes over it */}
    <motion.g {...fade(step >= 3, 0.8)}>
      <path d="M0 168 L0 124 Q60 118 120 122 Q180 118 240 124 L240 168 Z" fill={C.gum} />
      {[[104, 190], [136, 200], [102, 222], [138, 226], [120, 176]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3.5" fill="#84cc16" opacity="0.8" />
      ))}
    </motion.g>
    <motion.g
      initial={false}
      animate={step >= 2 ? { y: -150, opacity: 0, rotate: -8 } : { y: 0, opacity: 1, rotate: 0 }}
      transition={{ duration: 1.3, ease: "easeIn" }}
    >
      <Tooth pulpColor={C.pulp} />
      <ellipse cx="134" cy="44" rx="20" ry="14" fill={C.decay} />
      <path d="M100 30 L110 70 L104 100" stroke="#7c5c3c" strokeWidth="2" fill="none" />
    </motion.g>
    <Pain on={step === 0} />
    <Syringe on={step === 1} />
    <Label on={step === 3} x={120} y={88}>{lang === "en" ? "Healing" : lang === "ar" ? "التئام" : "ساخبوون"}</Label>
  </>
);

// ---------- How decay progresses: 5 steps ----------
export const DecayScene = ({ step, lang }: SceneProps) => (
  <>
    <Defs />
    <Jaw />
    <Tooth pulpColor={step >= 3 ? C.pulp : "#f6c9c9"} />
    {/* 1. white chalky spot on the enamel */}
    <motion.ellipse cx="144" cy="36" rx="9" ry="6" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" {...fade(step === 0)} />
    {/* 2-5. the brown cavity grows deeper */}
    <motion.path
      fill={C.decay}
      initial={false}
      animate={{
        opacity: step >= 1 ? 1 : 0,
        d:
          step <= 1
            ? "M136 30 Q146 26 154 32 Q150 42 142 42 Q136 38 136 30 Z"
            : step === 2
              ? "M130 28 Q148 22 158 32 Q154 62 140 70 Q128 58 130 28 Z"
              : "M128 28 Q150 20 160 32 Q154 70 136 82 Q122 64 128 28 Z",
      }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
    />
    {/* sensitivity arrows when decay reaches the dentin */}
    <motion.g {...fade(step === 2, 0.4)}>
      {[0, 1].map((i) => (
        <motion.path key={i} d={`M${168 + i * 8} 48 l10 -6 m-10 6 l10 6`} stroke={C.sky} strokeWidth="2.5" fill="none" strokeLinecap="round"
          animate={step === 2 ? { x: [0, 4, 0] } : {}} transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }} />
      ))}
    </motion.g>
    <motion.path d={T_PULP} fill="none" stroke="#f87171" strokeWidth="5" initial={false}
      animate={step >= 3 ? { opacity: [0.2, 0.9, 0.2] } : { opacity: 0 }}
      transition={step >= 3 ? { duration: 1.4, repeat: Infinity } : { duration: 0.3 }} />
    <Pain on={step >= 3} />
    <motion.circle cx="140" cy="248" r="11" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2"
      style={{ transformBox: "fill-box", transformOrigin: "center" }}
      initial={false}
      animate={step >= 4 ? { opacity: 1, scale: [1, 1.15, 1] } : { opacity: 0, scale: 0.3 }}
      transition={step >= 4 ? { duration: 1.4, repeat: Infinity } : { duration: 0.4 }} />
    <Label on={step === 0} x={120} y={268}>{lang === "en" ? "Enamel" : lang === "ar" ? "المينا" : "مینا"}</Label>
    <Label on={step === 2} x={120} y={268}>{lang === "en" ? "Dentin" : lang === "ar" ? "العاج" : "عاج"}</Label>
    <Label on={step === 3} x={120} y={268}>{lang === "en" ? "Nerve" : lang === "ar" ? "العصب" : "دەمار"}</Label>
  </>
);

// ---------- What happens when a lost tooth is not replaced: 4 steps ----------
export const MissingToothScene = ({ step, lang }: SceneProps) => {
  const NEIGHBOR_L = "M10 40 Q40 22 72 30 L74 108 Q70 150 66 240 Q60 250 50 240 L40 150 Q25 120 10 110Z";
  const NEIGHBOR_R = "M230 40 Q200 22 168 30 L166 108 Q170 150 174 240 Q180 250 190 240 L200 150 Q215 120 230 110Z";
  return (
    <>
      <Defs />
      <rect width="240" height="280" fill={C.bg} />
      {/* opposing upper tooth grows down into the gap */}
      <motion.g initial={false} animate={{ y: step >= 2 ? 46 : 0 }} transition={{ duration: 1.4, ease: "easeInOut" }}>
        <path d="M98 -40 L142 -40 L144 16 Q120 28 96 16 Z" fill={C.dentin} stroke={C.outline} strokeWidth="2" />
        <path d="M96 0 Q120 12 144 0 L144 16 Q120 28 96 16 Z" fill={C.enamel} />
      </motion.g>
      <rect y="140" width="240" height="140" fill={C.bone} />
      <rect y="140" width="240" height="140" fill="url(#boneDots)" />
      {/* bone shrinks where the tooth is missing */}
      <motion.path
        fill={C.bg}
        initial={false}
        animate={{ d: step >= 3 ? "M74 139 Q120 190 166 139 Z" : "M74 139 Q120 140 166 139 Z" }}
        transition={{ duration: 1.4 }}
      />
      <motion.path
        fill={C.gum}
        initial={false}
        animate={{ d: step >= 3 ? "M0 168 L0 124 Q40 118 72 122 Q120 182 168 122 Q200 118 240 124 L240 168 Q120 214 0 168 Z" : "M0 168 L0 124 Q40 118 72 122 Q120 138 168 122 Q200 118 240 124 L240 168 Z" }}
        transition={{ duration: 1.4 }}
      />
      {/* neighbours tilt into the gap */}
      <motion.g style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }} initial={false} animate={{ rotate: step >= 1 ? 9 : 0 }} transition={{ duration: 1.3 }}>
        <path d={NEIGHBOR_L} fill={C.dentin} stroke={C.outline} strokeWidth="2" />
        <path d="M10 40 Q40 22 72 30 L74 106 Q40 112 10 106 Z" fill={C.enamel} opacity="0.9" />
      </motion.g>
      <motion.g style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }} initial={false} animate={{ rotate: step >= 1 ? -9 : 0 }} transition={{ duration: 1.3 }}>
        <path d={NEIGHBOR_R} fill={C.dentin} stroke={C.outline} strokeWidth="2" />
        <path d="M230 40 Q200 22 168 30 L166 106 Q200 112 230 106 Z" fill={C.enamel} opacity="0.9" />
      </motion.g>
      <Label on={step === 1} x={120} y={110}>{lang === "en" ? "Teeth tilt" : lang === "ar" ? "ميلان الأسنان" : "لاربوونا ددانا"}</Label>
      <Label on={step === 2} x={120} y={110}>{lang === "en" ? "Over-eruption" : lang === "ar" ? "نزول السن المقابل" : "دابەزینا ددانێ بەرامبەر"}</Label>
      <Label on={step === 3} x={120} y={110}>{lang === "en" ? "Bone loss" : lang === "ar" ? "ذوبان العظم" : "کێمبوونا هەستی"}</Label>
    </>
  );
};
