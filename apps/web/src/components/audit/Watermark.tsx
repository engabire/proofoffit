"use client";

interface WatermarkProps {
  text: string;
}

export function Watermark({ text }: WatermarkProps) {
  return (
    <div
      aria-hidden
      className="fixed inset-0 pointer-events-none select-none opacity-10"
    >
      <div className="w-full h-full rotate-[-30deg] grid place-items-center gap-40">
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} className="text-4xl font-mono text-gray-400">
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}




