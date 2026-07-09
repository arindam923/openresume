"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Award,
  BarChart3,
  Check,
  ChevronDown,
  Clock,
  Github,
  Loader2,
  Lock,
  RefreshCw,
  Sparkles,
  Star,
  Users,
  Wand2,
  Compass,
  Crosshair,
  Maximize2,
  Grid
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Crop corners for technical layout drawing look
const CropCorners = () => (
  <>
    <span className="absolute top-1 left-1 text-[11px] text-zinc-300 font-mono select-none pointer-events-none leading-none">┌</span>
    <span className="absolute top-1 right-1 text-[11px] text-zinc-300 font-mono select-none pointer-events-none leading-none">┐</span>
    <span className="absolute bottom-1 left-1 text-[11px] text-zinc-300 font-mono select-none pointer-events-none leading-none">└</span>
    <span className="absolute bottom-1 right-1 text-[11px] text-zinc-300 font-mono select-none pointer-events-none leading-none">┘</span>
  </>
);

// Technical drafting ruler lines (Clean and subtle without numbers or text clutter)
const TechRuler = ({ orientation = "horizontal" }: { orientation?: "horizontal" | "vertical" }) => {
  if (orientation === "horizontal") {
    return (
      <div className="w-full h-3 border-b border-zinc-950/10 relative flex items-end select-none pointer-events-none bg-white/20">
        <div className="absolute inset-x-0 bottom-0 h-2 ruler-ticks-h opacity-25" />
        <div className="absolute inset-x-0 bottom-0 h-1 ruler-ticks-h-sub opacity-20" />
      </div>
    );
  } else {
    return (
      <div className="h-full w-3 border-r border-zinc-950/10 relative flex select-none pointer-events-none bg-white/20">
        <div className="absolute inset-y-0 right-0 w-2 ruler-ticks-v opacity-25" />
        <div className="absolute inset-y-0 right-0 w-1 ruler-ticks-v-sub opacity-20" />
      </div>
    );
  }
};

export default function HomePage() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Playground states
  const [atsScore, setAtsScore] = useState(72);
  const [bulletText, setBulletText] = useState("I created a React page and fixed database issues.");
  const [skills, setSkills] = useState(["React", "SQL"]);
  const [template, setTemplate] = useState<"minimal" | "modern" | "compact">("minimal");
  const [isOptimized, setIsOptimized] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleOptimize = () => {
    if (isOptimized || isOptimizing) return;
    setIsOptimizing(true);
    const targetScore = 96;
    const targetText = "Architected a high-scale React dashboard & optimized query execution plans, reducing page load latencies by 42%.";
    const targetSkills = ["React", "SQL", "TypeScript", "Next.js", "Redis"];

    // Typewriter effect simulation
    let currentText = "";
    let i = 0;
    const interval = setInterval(() => {
      if (i < targetText.length) {
        currentText += targetText.substring(0, i + 2);
        setBulletText(currentText);
        i += 2;
      } else {
        clearInterval(interval);
        setBulletText(targetText);
        setSkills(targetSkills);
        setIsOptimized(true);
        setIsOptimizing(false);
      }
    }, 10);

    // Animate score count up
    let score = 72;
    const scoreInterval = setInterval(() => {
      if (score < targetScore) {
        score++;
        setAtsScore(score);
      } else {
        clearInterval(scoreInterval);
      }
    }, 20);
  };

  const handleReset = () => {
    setAtsScore(72);
    setBulletText("I created a React page and fixed database issues.");
    setSkills(["React", "SQL"]);
    setIsOptimized(false);
  };

  const faqs = [
    {
      q: "Is it really free to use OpenResume?",
      a: "Yes, our core resume builder, ATS analyzer, and standard templates are 100% free with no watermarks or hidden paywalls. The Premium plan is completely optional for users wanting advanced AI credits and custom tracking.",
    },
    {
      q: "How does the AI tailoring feature work?",
      a: "Simply paste the job description of your target role. Our Gemini-powered AI will analyze the requirements, scan your current resume, highlight missing skills, and suggest ATS-optimized bullet points.",
    },
    {
      q: "Will my resume pass Applicant Tracking Systems (ATS)?",
      a: "Absolutely. Every template is strictly tested against major ATS software parser engines to ensure your text is easily read and parsed correctly by automated screening tools.",
    },
    {
      q: "Can I import my data directly from GitHub?",
      a: "Yes, developers can input their GitHub username, and our system automatically imports your top repositories, descriptions, star counts, and tech stack to draft your Projects section.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-[#1A1A1A] selection:bg-[#E65100] selection:text-white bg-grid-drafting">
      
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 border-b border-[#1A1A1A] bg-white/95 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between relative">
          
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-6 h-6 border border-[#1A1A1A] bg-[#1A1A1A] text-white flex items-center justify-center font-mono text-xs font-bold shadow-[1px_1px_0px_0px_#E65100]">
                O
              </div>
              <span className="text-xs font-mono font-bold tracking-tight text-[#1A1A1A] group-hover:text-orange-600 transition-colors uppercase">
                OpenResume
              </span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-[10px] font-mono text-zinc-500 hover:text-[#1A1A1A] hover:underline transition-colors uppercase tracking-wider">
                Features
              </a>
              <a href="#pricing" className="text-[10px] font-mono text-zinc-500 hover:text-[#1A1A1A] hover:underline transition-colors uppercase tracking-wider">
                Pricing
              </a>
              <a href="#faqs" className="text-[10px] font-mono text-zinc-500 hover:text-[#1A1A1A] hover:underline transition-colors uppercase tracking-wider">
                FAQ
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/sign-in" className="text-[10px] font-mono text-zinc-500 hover:text-[#1A1A1A] transition-colors uppercase tracking-wider">
              Sign In
            </Link>
            <Button size="sm" asChild className="border border-[#1A1A1A] bg-[#1A1A1A] text-white hover:bg-zinc-800 rounded-none shadow-[2px_2px_0px_0px_#E65100] hover:translate-y-[-1px] transition-all">
              <Link href="/builder" className="flex items-center gap-1.5 text-[9.5px] font-mono uppercase tracking-wider font-bold">
                Start Building <ArrowRight className="w-3 h-3 text-[#E65100]" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1">

        {/* Hero Section */}
        <section className="py-16 md:py-20 max-w-5xl mx-auto px-4 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch mt-6">

            {/* Left Column: Spec Sheet Value Prop */}
            <div className="lg:col-span-5 flex flex-col justify-center relative border border-[#1A1A1A] bg-white p-6 md:p-8 shadow-[3px_3px_0px_0px_#1A1A1A]">
              <CropCorners />
              
              <div className="space-y-6">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 border border-[#1A1A1A] bg-[#FAF9F5] text-zinc-700 text-[8.5px] font-mono uppercase tracking-widest shadow-[1px_1px_0px_0px_#1A1A1A]">
                  <Sparkles className="w-3 h-3 text-[#E65100]" /> Free document builder
                </div>

                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1A1A1A] leading-tight font-sans">
                  Precision CV layout workspace.
                </h1>

                <p className="text-[11px] font-mono text-[#1A1A1A] leading-relaxed">
                  OpenResume is a layout-focused document workspace built to compile clean resume files. Calibrate your experience text, align margin elements, and export standard PDF templates formatted to recruiter standards. No watermarks.
                </p>

                <div className="flex items-center gap-4 pt-2">
                  <Button size="default" asChild className="border border-[#1A1A1A] bg-[#E65100] text-white hover:bg-orange-700 rounded-none shadow-[3px_3px_0px_0px_#1A1A1A] hover:translate-y-[-1px] transition-all">
                    <Link href="/builder" className="flex items-center gap-1.5 text-xs font-mono uppercase font-bold tracking-wider">
                      Open Workbench <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </Button>
                  <a href="#features" className="text-xs font-mono font-bold text-zinc-500 hover:text-[#1A1A1A] transition-colors border-b border-dashed border-zinc-300 hover:border-zinc-900 pb-0.5">
                    See Features
                  </a>
                </div>

                <div className="flex items-center gap-6 text-[8.5px] text-zinc-400 font-mono uppercase pt-6 border-t border-dashed border-zinc-200">
                  <div className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-[#1A1A1A]" />
                    <span>Profiles: 10,240</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-[#E65100] fill-[#E65100]" />
                    <span>Calibrations: 4.9/5</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Live Drafting Drawing Board */}
            <div className="lg:col-span-7 flex flex-col relative border border-[#1A1A1A] bg-white shadow-[4px_4px_0px_0px_#1A1A1A]">
              
              {/* Subtle top ruler ticks */}
              <TechRuler orientation="horizontal" />

              <div className="flex-1 flex min-h-[380px]">
                
                {/* Subtle left ruler ticks */}
                <div className="shrink-0 h-full">
                  <TechRuler orientation="vertical" />
                </div>

                {/* Drawing Surface */}
                <div className="flex-1 p-4 bg-zinc-50/60 bg-grid-drafting-fine flex flex-col gap-4 relative">
                  
                  {/* Top controller panel inside drafting board */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border border-[#1A1A1A] bg-white p-2.5 shadow-[1.5px_1.5px_0px_0px_#1A1A1A]">
                    <div className="flex items-center gap-1">
                      <span className="text-[8.5px] text-zinc-400 font-mono uppercase mr-1">Template:</span>
                      {(["minimal", "modern", "compact"] as const).map((t) => (
                        <button
                          key={t}
                          onClick={() => setTemplate(t)}
                          className={cn(
                            "px-2 py-0.5 text-[8.5px] font-mono uppercase border transition-all rounded-none",
                            template === t
                              ? "bg-[#1A1A1A] border-[#1A1A1A] text-white"
                              : "border-zinc-300 text-zinc-600 hover:bg-[#FAF9F5]"
                          )}
                        >
                          {t}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      {isOptimized ? (
                        <button
                          onClick={handleReset}
                          className="flex items-center gap-1 px-2.5 py-0.5 border border-[#1A1A1A] text-[8.5px] font-mono uppercase hover:bg-zinc-50 rounded-none shadow-[1px_1px_0px_0px_#1A1A1A]"
                        >
                          <RefreshCw className="w-2.5 h-2.5" /> Re-Draft
                        </button>
                      ) : (
                        <button
                          onClick={handleOptimize}
                          disabled={isOptimizing}
                          className="flex items-center gap-1 px-2.5 py-0.5 bg-[#E65100] text-white hover:bg-orange-700 disabled:opacity-50 border border-[#1A1A1A] text-[8.5px] font-mono uppercase rounded-none shadow-[1px_1px_0px_0px_#1a1a1a]"
                        >
                          {isOptimizing ? (
                            <Loader2 className="w-2.5 h-2.5 animate-spin" />
                          ) : (
                            <Wand2 className="w-2.5 h-2.5" />
                          )}
                          AI Optimize Bullet
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Drawing Area Split */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch flex-1">
                    
                    {/* Simulated Paper Draft Sheet */}
                    <div className="md:col-span-8 flex flex-col justify-center">
                      <div
                        className={cn(
                          "bg-white border border-[#1A1A1A] p-4 min-h-[260px] flex-grow flex flex-col justify-between relative shadow-sm select-none transition-all duration-300",
                          template === "modern" && "font-sans border-t-[3px] border-t-[#1A1A1A]",
                          template === "minimal" && "font-serif",
                          template === "compact" && "font-sans text-[9px] p-3 leading-tight"
                        )}
                      >
                        {/* Margin dashed alignment line overlays */}
                        <div className="absolute inset-2 border border-dashed border-[#E65100]/25 pointer-events-none" />

                        <div>
                          <div className="text-center border-b border-zinc-200 pb-1.5 mb-2 relative">
                            <div className="text-xs font-bold tracking-tight text-[#1A1A1A]">ALEX JOHNSON</div>
                            <div className="text-[8px] text-zinc-500 font-mono uppercase tracking-wider">Software Architect</div>
                          </div>

                          <div className="mb-2">
                            <div>
                              <div className="flex items-center justify-between text-[9px] font-bold">
                                <span>Tech Corp</span>
                                <span className="text-zinc-500 font-normal">San Francisco, CA</span>
                              </div>
                              <div className="flex items-center justify-between text-[8px] text-zinc-400 font-mono mb-1">
                                <span>Full Stack Developer</span>
                                <span>2022 - Present</span>
                              </div>
                              <p className={cn(
                                "text-[9px] text-[#1A1A1A] leading-relaxed pl-2 border-l border-zinc-300 transition-all duration-500",
                                isOptimized && "bg-[#FAF9F5] text-zinc-800 py-1 px-1.5 rounded-none border-l-2 border-l-[#E65100]"
                              )}>
                                &bull; {bulletText}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="flex flex-wrap gap-1">
                            {skills.map((s, idx) => (
                              <span
                                key={idx}
                                className={cn(
                                  "px-1.5 py-0.5 bg-[#FAF9F5] text-zinc-700 text-[8px] font-mono border border-zinc-300 transition-all",
                                  isOptimized && idx >= 2 && "bg-[#FAF9F5] text-orange-750 border-orange-600 font-bold"
                                )}
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Calibrated Circular Instrument Dial for ATS Score */}
                    <div className="md:col-span-4 flex flex-col items-center justify-center border border-[#1A1A1A] bg-white p-4 relative shadow-sm">
                      <CropCorners />
                      
                      <span className="text-[8px] text-zinc-450 font-mono uppercase mb-3 text-center">Score Analyzer</span>

                      {/* Schematic Meter Interface */}
                      <div className="relative w-28 h-28 flex items-center justify-center bg-[#FAF9F5] border border-zinc-300 rounded-full p-2">
                        
                        {/* Circular calibrations ticks */}
                        <div className="absolute inset-1 border border-dashed border-[#1A1A1A]/10 rounded-full" />
                        
                        {/* Radial pointer */}
                        <div 
                          className="absolute w-0.5 h-12 bg-[#E65100] origin-bottom bottom-[56px] transition-transform duration-1000 ease-out" 
                          style={{ transform: `rotate(${(atsScore / 100) * 360 - 180}deg)` }}
                        />
                        
                        {/* Hub cap */}
                        <div className="absolute w-2 h-2 bg-[#1A1A1A] rounded-full z-10" />

                        {/* Text value */}
                        <div className="absolute flex flex-col items-center justify-center bg-white/90 border border-[#1A1A1A] w-14 h-14 rounded-full shadow-xs">
                          <span className="text-xl font-mono font-bold text-[#1A1A1A] tracking-tighter">{atsScore}</span>
                          <span className="text-[7.5px] font-mono text-zinc-400 -mt-1.5">PTS</span>
                        </div>
                      </div>

                      <p className="text-[9px] font-mono text-zinc-500 text-center mt-3 leading-snug">
                        {isOptimized
                          ? "Compile Ready. Added metric parameters."
                          : "Calibrate achievement bullets to raise rating."}
                      </p>
                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 border-t border-[#1A1A1A] bg-white relative">
          
          <div className="absolute inset-0 bg-grid-drafting-fine opacity-20 pointer-events-none" />
          <div className="absolute left-1/2 top-0 bottom-0 w-px border-l border-dashed border-zinc-200 hidden md:block" />

          <div className="max-w-5xl mx-auto px-4 relative z-10">
            
            <div className="text-center max-w-2xl mx-auto mb-16 border border-[#1A1A1A] p-6 bg-[#FAF9F5] relative shadow-[3px_3px_0px_0px_#1A1A1A]">
              <CropCorners />
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1A1A]">
                Calibrated Document Engines
              </h2>
              <p className="mt-2 text-[11px] font-mono text-zinc-500">
                Engineered specifically for typesetting control and quick parsing compliance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Feature 1 */}
              <div className="drafting-card p-6 group">
                <CropCorners />
                <div className="w-8 h-8 border border-[#1A1A1A] bg-[#FAF9F5] flex items-center justify-center text-[#1A1A1A] mb-4">
                  <Sparkles className="w-4 h-4 text-[#E65100]" />
                </div>
                
                <h3 className="text-xs font-mono font-bold text-[#1A1A1A] uppercase tracking-wider mb-2">Gemini Optimizer</h3>
                <p className="text-[10px] font-mono text-zinc-500 leading-relaxed">
                  Calibrate your job copy. Tailor achievements and metrics parameters automatically to match industry targets.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="drafting-card p-6 group">
                <CropCorners />
                <div className="w-8 h-8 border border-[#1A1A1A] bg-[#FAF9F5] flex items-center justify-center text-[#1A1A1A] mb-4">
                  <BarChart3 className="w-4 h-4 text-sky-700" />
                </div>

                <h3 className="text-xs font-mono font-bold text-[#1A1A1A] uppercase tracking-wider mb-2">Keyword Analyser</h3>
                <p className="text-[10px] font-mono text-zinc-500 leading-relaxed">
                  Align content nodes. Compare resume strings against standard ATS screening keywords to map overlap.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="drafting-card p-6 group">
                <CropCorners />
                <div className="w-8 h-8 border border-[#1A1A1A] bg-[#FAF9F5] flex items-center justify-center text-[#1A1A1A] mb-4">
                  <Github className="w-4 h-4" />
                </div>

                <h3 className="text-xs font-mono font-bold text-[#1A1A1A] uppercase tracking-wider mb-2">GitHub Sync Hub</h3>
                <p className="text-[10px] font-mono text-zinc-500 leading-relaxed">
                  Import repository arrays. Load project descriptions, repositories, and technical tags in one drafting command.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="drafting-card p-6 group">
                <CropCorners />
                <div className="w-8 h-8 border border-[#1A1A1A] bg-[#FAF9F5] flex items-center justify-center text-[#1A1A1A] mb-4">
                  <Maximize2 className="w-4 h-4 text-emerald-600" />
                </div>

                <h3 className="text-xs font-mono font-bold text-[#1A1A1A] uppercase tracking-wider mb-2">Layout Canvas</h3>
                <p className="text-[10px] font-mono text-zinc-500 leading-relaxed">
                  Real-time preview scaling. Adjust margin grids, layout borders, and alignment systems directly on paper sheets.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="drafting-card p-6 group">
                <CropCorners />
                <div className="w-8 h-8 border border-[#1A1A1A] bg-[#FAF9F5] flex items-center justify-center text-[#1A1A1A] mb-4">
                  <Award className="w-4 h-4 text-orange-600" />
                </div>

                <h3 className="text-xs font-mono font-bold text-[#1A1A1A] uppercase tracking-wider mb-2">Validated Templates</h3>
                <p className="text-[10px] font-mono text-zinc-500 leading-relaxed">
                  ATS-compliant structures. Select layouts strictly tailored for margin safety zones and scanner engines.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="drafting-card p-6 group">
                <CropCorners />
                <div className="w-8 h-8 border border-[#1A1A1A] bg-[#FAF9F5] flex items-center justify-center text-[#1A1A1A] mb-4">
                  <Lock className="w-4 h-4 text-purple-700" />
                </div>

                <h3 className="text-xs font-mono font-bold text-[#1A1A1A] uppercase tracking-wider mb-2">Local Sandbox</h3>
                <p className="text-[10px] font-mono text-zinc-500 leading-relaxed">
                  Sandbox privacy container. Run data inputs locally inside browser IDB-keyval layers without database transmission.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Pricing Tiers Section */}
        <section id="pricing" className="py-20 border-t border-[#1A1A1A] bg-[#FAF9F5]">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center max-w-xl mx-auto mb-14">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1A1A]">
                Workspace Access Tiers
              </h2>
              <p className="mt-2 text-[11px] font-mono text-zinc-500">
                Select access limits matching your application scope.
              </p>

              {/* Billing Cycle Mechanical Toggle */}
              <div className="mt-6 inline-flex items-center gap-1.5 p-1 border border-[#1A1A1A] bg-white shadow-[1.5px_1.5px_0px_0px_#1A1A1A]">
                <button
                  onClick={() => setBillingPeriod("monthly")}
                  className={`px-3 py-1 text-[9px] font-mono uppercase tracking-wider transition-all rounded-none ${
                    billingPeriod === "monthly"
                      ? "bg-[#1A1A1A] text-white"
                      : "text-zinc-500 hover:text-zinc-800"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingPeriod("yearly")}
                  className={`px-3 py-1 text-[9px] font-mono uppercase tracking-wider transition-all rounded-none ${
                    billingPeriod === "yearly"
                      ? "bg-[#1A1A1A] text-white"
                      : "text-zinc-500 hover:text-zinc-800"
                  }`}
                >
                  Yearly <span className="text-orange-500 font-bold ml-0.5">(-33%)</span>
                </button>
              </div>
            </div>

            {/* Pricing Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              
              {/* Plan 1: Free */}
              <div className="drafting-card p-6 flex flex-col justify-between bg-white">
                <CropCorners />
                <div>
                  <h3 className="text-sm font-mono font-bold text-[#1A1A1A] uppercase tracking-wider mt-1">Free Sandbox</h3>
                  <p className="mt-1 text-[10px] font-mono text-zinc-500 leading-snug">Compile & print basic single resume sheets.</p>
                  
                  <div className="mt-4 flex items-baseline border-b border-dashed border-zinc-200 pb-4">
                    <span className="text-3xl font-mono font-bold text-[#1A1A1A]">$0</span>
                  </div>

                  <ul className="mt-6 space-y-3 text-[10px] font-mono text-zinc-650">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#E65100] shrink-0" />
                      <span>All standard templates</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#E65100] shrink-0" />
                      <span>Unlimited PDF drafts print</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#E65100] shrink-0" />
                      <span>Local storage buffer</span>
                    </li>
                  </ul>
                </div>
                <Button variant="outline" size="sm" className="mt-8 w-full rounded-none border border-[#1A1A1A] hover:bg-zinc-50 text-[10px] font-mono uppercase font-bold tracking-wider shadow-[2px_2px_0px_0px_#1A1A1A]" asChild>
                  <Link href="/builder">Initialize Sandbox</Link>
                </Button>
              </div>

              {/* Plan 2: Pro */}
              <div className="drafting-card-active p-6 flex flex-col justify-between bg-white relative">
                <CropCorners />
                
                <div className="absolute top-[-10px] right-4 bg-[#E65100] text-white text-[7.5px] font-mono uppercase tracking-widest px-2 py-0.5 border border-[#1A1A1A] shadow-[1px_1px_0px_0px_#1A1A1A]">
                  RECOMMENDED
                </div>

                <div>
                  <h3 className="text-sm font-mono font-bold text-[#1A1A1A] uppercase tracking-wider mt-1">Professional Pro</h3>
                  <p className="mt-1 text-[10px] font-mono text-zinc-500 leading-snug">Designed for active engineers running scaled applications.</p>
                  
                  <div className="mt-4 flex items-baseline border-b border-dashed border-zinc-200 pb-4">
                    <span className="text-3xl font-mono font-bold text-[#1A1A1A]">
                      {billingPeriod === "monthly" ? "$12" : "$8"}
                    </span>
                    <span className="text-zinc-400 text-[10px] font-mono ml-1 uppercase">/ month</span>
                  </div>

                  <ul className="mt-6 space-y-3 text-[10px] font-mono text-zinc-700">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#E65100] shrink-0" />
                      <span>Unlimited AI layout calibration</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#E65100] shrink-0" />
                      <span>Deep keyword tracking matrix</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#E65100] shrink-0" />
                      <span>Automated GitHub pipelines sync</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#E65100] shrink-0" />
                      <span>Cloud workspace synchronization</span>
                    </li>
                  </ul>
                </div>
                <Button size="sm" className="mt-8 w-full rounded-none border border-[#1A1A1A] bg-[#1A1A1A] text-white hover:bg-zinc-800 text-[10px] font-mono uppercase font-bold tracking-wider shadow-[2px_2px_0px_0px_#E65100]" asChild>
                  <Link href="/builder">Activate License</Link>
                </Button>
              </div>

              {/* Plan 3: Custom */}
              <div className="drafting-card p-6 flex flex-col justify-between bg-white">
                <CropCorners />
                <div>
                  <h3 className="text-sm font-mono font-bold text-[#1A1A1A] uppercase tracking-wider mt-1">Enterprise Team</h3>
                  <p className="mt-1 text-[10px] font-mono text-zinc-500 leading-snug">Calibrated for university cohorts, bootcamps and groups.</p>
                  
                  <div className="mt-4 flex items-baseline border-b border-dashed border-zinc-200 pb-4">
                    <span className="text-2xl font-mono font-bold text-[#1A1A1A]">Custom</span>
                  </div>

                  <ul className="mt-6 space-y-3 text-[10px] font-mono text-zinc-650">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#E65100] shrink-0" />
                      <span>Custom workspace guidelines</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#E65100] shrink-0" />
                      <span>HR parsing gateway API</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#E65100] shrink-0" />
                      <span>Cohort stats & admin board</span>
                    </li>
                  </ul>
                </div>
                <Button variant="outline" size="sm" className="mt-8 w-full rounded-none border border-[#1A1A1A] hover:bg-zinc-50 text-[10px] font-mono uppercase font-bold tracking-wider shadow-[2px_2px_0px_0px_#1A1A1A]" asChild>
                  <Link href="/builder">Contact Sales</Link>
                </Button>
              </div>

            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faqs" className="py-20 border-t border-[#1A1A1A] bg-white relative">
          <div className="absolute inset-0 bg-grid-drafting-fine opacity-25 pointer-events-none" />
          
          <div className="max-w-3xl mx-auto px-4 relative z-10">
            
            <div className="flex flex-col items-center mb-12">
              <h2 className="text-xl font-bold font-mono uppercase tracking-wider text-center text-[#1A1A1A] mt-1">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="border border-[#1A1A1A] bg-white overflow-hidden shadow-[2px_2px_0px_0px_#1A1A1A] relative"
                >
                  <CropCorners />
                  
                  <button
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-4 text-left text-[#1A1A1A] font-mono text-[10.5px] uppercase tracking-wider hover:bg-[#FAF9F5] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-250 ${
                        activeFaq === idx ? "rotate-180 text-orange-500" : ""
                      }`}
                    />
                  </button>

                  <div
                    className={cn(
                      "transition-all duration-300 ease-in-out",
                      activeFaq === idx 
                        ? "max-h-[300px] border-t border-dashed border-zinc-200 p-4 text-[10.5px] font-mono text-zinc-550 leading-relaxed bg-[#FAF9F5]/40" 
                        : "max-h-0 opacity-0 overflow-hidden"
                    )}
                  >
                    {faq.a}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1A1A1A] py-12 px-4 bg-white relative">
        <div className="absolute inset-x-0 top-0 h-4 border-b border-dashed border-zinc-200 pointer-events-none" />
        
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 text-[10px] font-mono text-zinc-550">
          
          <div>
            <div className="flex items-center gap-2 font-bold text-[#1A1A1A] mb-3">
              <div className="w-5 h-5 border border-[#1A1A1A] bg-[#1A1A1A] text-white flex items-center justify-center text-[9px] shadow-[1px_1px_0px_0px_#E65100]">
                O
              </div>
              <span>OpenResume</span>
            </div>
            <p className="leading-relaxed max-w-[200px]">
              Engineered document alignment layout system. Optimize parsing buffers for recruiters.
            </p>
          </div>

          <div>
            <h4 className="text-[#1A1A1A] font-bold mb-3 uppercase tracking-widest text-[9px]">Directory</h4>
            <ul className="space-y-1.5">
              <li>
                <Link href="/builder" className="hover:text-orange-600 hover:underline">
                  Builder Workspace
                </Link>
              </li>
              <li>
                <Link href="/builder" className="hover:text-orange-600 hover:underline">
                  ATS Score Analysis
                </Link>
              </li>
              <li>
                <Link href="/builder" className="hover:text-orange-600 hover:underline">
                  GitHub Import
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[#1A1A1A] font-bold mb-3 uppercase tracking-widest text-[9px]">Resources</h4>
            <ul className="space-y-1.5">
              <li>
                <a href="#" className="hover:text-orange-600 hover:underline">
                  Layout Templates
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-600 hover:underline">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="max-w-5xl mx-auto border-t border-[#1A1A1A] pt-6 flex flex-col sm:flex-row items-center justify-between text-[8.5px] font-mono text-zinc-400">
          <div>
            &copy; {new Date().getFullYear()} OPENRESUME. ALL SPECIFICATIONS REGISTERED.
          </div>
          <div className="flex gap-4 mt-3 sm:mt-0">
            <a href="#" className="hover:text-[#1A1A1A] hover:underline">
              [PRIVACY_POLICY]
            </a>
            <a href="#" className="hover:text-[#1A1A1A] hover:underline">
              [LICENSE_TERMS]
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
