// Thin reading-progress bar above the header. A CSS scroll timeline drives it (see .scroll-progress
// in globals.css), so it ships no JavaScript; browsers without scroll timelines leave it hidden.
export function ScrollProgressBar() {
  return (
    <div
      aria-hidden="true"
      className="scroll-progress pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] bg-gradient-energy"
    />
  );
}
