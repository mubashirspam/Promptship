/**
 * Shared dark canvas (ambient pink/purple/indigo blobs + grid) used behind
 * every marketing section from the template showcase downward, so the page
 * reads as one continuous dark surface instead of isolated dark sections.
 */
export function DarkBackdrop({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden bg-[#0a0a0a]">
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-[5%] left-[-10%] h-[40%] w-[40%] rounded-full bg-pink-500/10 mix-blend-screen blur-[120px]" />
        <div className="absolute top-[35%] right-[-10%] h-[50%] w-[50%] rounded-full bg-purple-600/10 mix-blend-screen blur-[150px]" />
        <div className="absolute bottom-[10%] left-[20%] h-[60%] w-[60%] rounded-full bg-indigo-500/10 mix-blend-screen blur-[150px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>
      <div className="relative z-10 font-sans text-slate-200 selection:bg-purple-500/30">
        {children}
      </div>
    </div>
  );
}
