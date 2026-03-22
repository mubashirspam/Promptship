import { Rocket, Sparkles, Zap, Code } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Left panel - branding */}
      <div className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 lg:flex lg:flex-col lg:justify-between lg:p-12">
        {/* Background decorative elements */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/4 left-1/3 h-[400px] w-[400px] rounded-full bg-purple-500/10 blur-[128px]" />
          <div className="absolute right-0 bottom-1/4 h-[300px] w-[300px] rounded-full bg-cyan-500/10 blur-[100px]" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 p-2">
              <Rocket className="size-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">PromptShip</span>
          </div>
        </div>

        {/* Main tagline */}
        <div className="relative z-10 -mt-8">
          <h2 className="text-4xl font-bold leading-tight text-white">
            Ship Beautiful UIs
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              with AI
            </span>
          </h2>
          <p className="mt-4 max-w-md text-lg text-white/60">
            100+ curated prompts, one-click code generation, and comprehensive
            learning for React, Flutter, HTML & Vue.
          </p>

          {/* Feature highlights */}
          <div className="mt-10 grid grid-cols-2 gap-4">
            {[
              { icon: Sparkles, text: 'AI-Powered Generation' },
              { icon: Code, text: '4 Frameworks Supported' },
              { icon: Zap, text: 'Production-Ready Code' },
              { icon: Rocket, text: '10+ Premium Templates' },
            ].map((item) => (
              <div
                key={item.text}
                className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/5 px-4 py-3 backdrop-blur-sm"
              >
                <item.icon className="size-4 shrink-0 text-purple-400" />
                <span className="text-sm text-white/70">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom quote */}
        <div className="relative z-10">
          <blockquote className="border-l-2 border-purple-400/50 pl-4">
            <p className="text-sm italic text-white/50">
              &ldquo;PromptShip completely changed how I build UIs. What used to
              take hours now takes minutes.&rdquo;
            </p>
            <footer className="mt-2 text-xs text-white/30">
              &mdash; Sarah Chen, Frontend Engineer
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
        {children}
      </div>
    </div>
  );
}
