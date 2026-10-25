"use client";
export default function PrintResume() {
  return (
    <button className="button-primary" onClick={() => window.print()}>
      Print / Save as PDF
    </button>
  );
}
