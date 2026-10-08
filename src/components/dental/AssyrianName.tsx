import { useEffect, useRef, useState } from "react";

const NAME = "ܕܳܟܬܾܘܪ ܣܠܝܡ ܐܰܢܕܪܰܐܘܳܣ";
const MIN_PX = 16;
const MAX_PX = 46;

// The doctor's name in Assyrian (Syriac script) beside the logo. It grows or shrinks to
// fill the free space in the header on every screen size. The direction and font are
// fixed, so it looks exactly the same in English, Arabic and Kurdish.
const AssyrianName = () => {
  const boxRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [size, setSize] = useState(22);

  useEffect(() => {
    const box = boxRef.current;
    const text = textRef.current;
    if (!box || !text) return;
    const fit = () => {
      // Measure the text at 100px, then scale to the box width.
      text.style.fontSize = "100px";
      const widthAt100 = text.scrollWidth || 1;
      const px = Math.max(MIN_PX, Math.min(MAX_PX, Math.floor((box.clientWidth / widthAt100) * 100 * 0.97)));
      text.style.fontSize = `${px}px`;
      setSize(px);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(box);
    document.fonts?.ready.then(fit).catch(() => {});
    return () => ro.disconnect();
  }, []);

  return (
    <span ref={boxRef} className="flex-1 min-w-0 flex items-center overflow-hidden">
      <span
        ref={textRef}
        dir="rtl"
        lang="syr"
        className="leading-tight text-[hsl(40_48%_72%)] whitespace-nowrap select-none"
        style={{
          fontSize: size,
          unicodeBidi: "isolate",
          fontFamily: "'Noto Sans Syriac Eastern', 'Noto Sans Syriac', serif",
          fontWeight: 700,
        }}
      >
        {NAME}
      </span>
    </span>
  );
};

export default AssyrianName;
