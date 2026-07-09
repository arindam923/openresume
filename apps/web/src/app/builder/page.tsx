"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { LoginModal } from "@/components/auth/login-modal";
import { AtsPreview } from "@/components/resume/ats-preview";
import { AtsScore } from "@/components/resume/ats-score";
import { ChatResume } from "@/components/resume/chat-resume";
import { EducationEditor } from "@/components/resume/editors/education-editor";
import { ExperienceEditor } from "@/components/resume/editors/experience-editor";
import { PersonalEditor } from "@/components/resume/editors/personal-editor";
import { ProjectsEditor } from "@/components/resume/editors/projects-editor";
import { SimpleListEditor } from "@/components/resume/editors/simple-list-editor";
import { SkillsEditor } from "@/components/resume/editors/skills-editor";
import { ByokSettings } from "@/components/resume/byok-settings";
import { GithubImport } from "@/components/resume/github-import";
import { JobTailor } from "@/components/resume/job-tailor";
import { LayoutPanel } from "@/components/resume/layout-panel";
import { DownloadPdfButtonWrapper } from "@/components/resume/pdf/download-pdf-button-wrapper";
import { ResumePreview } from "@/components/resume/resume-preview";
import { TemplateSelector } from "@/components/resume/template-selector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { resumeApi, ResumeApiError } from "@/lib/resume/api";
import { sampleResume } from "@/lib/resume/sample";
import { useResumeStore } from "@/lib/resume/store";
import { cn } from "@/lib/utils";
import {
  Award,
  Bot,
  Brain,
  Briefcase,
  Check,
  Cloud,
  Code,
  Globe,
  GraduationCap,
  Import,
  Layout,
  Loader2,
  Redo2,
  Sliders,
  Sparkles,
  Trophy,
  Undo2,
  User
} from "lucide-react";
import Link from "next/link";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";

type PreviewMode = "visual" | "ats";
type Section =
  | "personal"
  | "experience"
  | "education"
  | "projects"
  | "skills"
  | "certifications"
  | "awards"
  | "languages"
  | "templates"
  | "ai"
  | "import"
  | "layout";

type SyncStatus = "idle" | "saving" | "saved" | "error";

const contentSections: { id: Section; label: string; icon: any }[] = [
  { id: "personal", label: "Personal Info", icon: User },
  { id: "experience", label: "Work Experience", icon: Briefcase },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "projects", label: "Projects", icon: Code },
  { id: "skills", label: "Skills Array", icon: Brain },
  { id: "certifications", label: "Certifications", icon: Award },
  { id: "awards", label: "Awards & Honors", icon: Trophy },
  { id: "languages", label: "Languages", icon: Globe },
];

const toolSections: { id: Section; label: string; icon: any }[] = [
  { id: "templates", label: "Template Library", icon: Layout },
  { id: "layout", label: "Layout & Sections", icon: Sliders },
  { id: "ai", label: "AI Copilot & ATS", icon: Bot },
  { id: "import", label: "GitHub Import", icon: Import },
];

// Crop corners for drafting design look
const CropCorners = () => (
  <>
    <span className="absolute top-1 left-1 text-[11px] text-zinc-300 font-mono select-none pointer-events-none leading-none">┌</span>
    <span className="absolute top-1 right-1 text-[11px] text-zinc-300 font-mono select-none pointer-events-none leading-none">┐</span>
    <span className="absolute bottom-1 left-1 text-[11px] text-zinc-300 font-mono select-none pointer-events-none leading-none">└</span>
    <span className="absolute bottom-1 right-1 text-[11px] text-zinc-300 font-mono select-none pointer-events-none leading-none">┘</span>
  </>
);

// Technical drafting ruler ticks (Subtle and clean without text labels)
const TechRuler = ({ orientation = "horizontal" }: { orientation?: "horizontal" | "vertical" }) => {
  if (orientation === "horizontal") {
    return (
      <div className="w-full h-3 border-b border-zinc-950/10 relative flex items-end select-none pointer-events-none bg-white">
        <div className="absolute inset-x-0 bottom-0 h-2 ruler-ticks-h opacity-25" />
        <div className="absolute inset-x-0 bottom-0 h-1 ruler-ticks-h-sub opacity-20" />
      </div>
    );
  } else {
    return (
      <div className="h-full w-3 border-r border-zinc-950/10 relative flex select-none pointer-events-none bg-white">
        <div className="absolute inset-y-0 right-0 w-2 ruler-ticks-v opacity-25" />
        <div className="absolute inset-y-0 right-0 w-1 ruler-ticks-v-sub opacity-20" />
      </div>
    );
  }
};

export default function BuilderPage() {
  const [activeSection, setActiveSection] = useState<Section>("personal");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("visual");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("idle");
  const [syncError, setSyncError] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(85);

  // Mouse coordinate state
  const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });

  const {
    resumeId,
    title,
    templateId,
    content,
    lastSyncedAt,
    setResumeId,
    setTitle,
    setTemplateId,
    setContent,
    updateContent,
    setLastSyncedAt,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useResumeStore();

  const { user, isAnonymous, isLoading: isAuthLoading } = useAuth();
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(false);

  // Profile completion calculations
  const getCompletionPercentage = () => {
    let totalFields = 0;
    let filledFields = 0;

    if (content.personal) {
      const personalKeys = ["fullName", "email", "phone", "location"];
      personalKeys.forEach((key) => {
        totalFields++;
        if (content.personal[key as keyof typeof content.personal]) {
          filledFields++;
        }
      });
    }

    totalFields += 4; // expects at least experience, education, projects, skills items
    if (content.experience && content.experience.length > 0) filledFields++;
    if (content.education && content.education.length > 0) filledFields++;
    if (content.projects && content.projects.length > 0) filledFields++;
    if (content.skills && content.skills.length > 0) filledFields++;

    return Math.min(100, Math.round((filledFields / totalFields) * 100));
  };

  const completionPercent = getCompletionPercentage();

  const isContentEmpty = (() => {
    const hasPersonal = Boolean(content.personal?.fullName?.trim() || content.personal?.email?.trim());
    const hasAnyItems =
      content.experience.length > 0 ||
      content.education.length > 0 ||
      content.projects.length > 0 ||
      content.skills.length > 0 ||
      content.certifications.length > 0 ||
      content.awards.length > 0 ||
      content.languages.length > 0 ||
      content.customSections.length > 0;
    return !hasPersonal && !hasAnyItems;
  })();

  const saveToCloud = useCallback(async () => {
    if (!user) return;

    setSyncStatus("saving");
    setSyncError(null);

    try {
      if (resumeId) {
        try {
          await resumeApi.update(resumeId, {
            title,
            templateId,
            content,
          });
        } catch (error) {
          // If the stored resume no longer exists (e.g. cleared DB, different
          // anonymous user), create a new one instead of failing forever.
          if (error instanceof ResumeApiError && error.status === 404) {
            console.warn("Stored resume not found, creating a new one", { resumeId });
            const result = await resumeApi.create({
              title,
              templateId,
              content,
            });
            if (result.resume?.id) {
              setResumeId(result.resume.id);
            }
          } else {
            throw error;
          }
        }
      } else {
        const result = await resumeApi.create({
          title,
          templateId,
          content,
        });
        if (result.resume?.id) {
          setResumeId(result.resume.id);
        }
      }
      setSyncStatus("saved");
      setLastSyncedAt(Date.now());
    } catch (error) {
      console.error("Failed to save resume", error);
      setSyncStatus("error");
      setSyncError(error instanceof Error ? error.message : "Save failed");
    }
  }, [user, resumeId, title, templateId, content, setResumeId, setLastSyncedAt]);

  // Auto-save when content changes
  useEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      return;
    }

    if (!user) return;

    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    setSyncStatus("idle");
    autoSaveTimeoutRef.current = setTimeout(() => {
      saveToCloud();
    }, 2000);

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [title, templateId, content, user, saveToCloud]);

  const loadSample = () => {
    setContent(sampleResume);
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
  };

  // Mouse coordinate tracker handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMouseCoords({
      x: Math.round(e.clientX - rect.left),
      y: Math.round(e.clientY - rect.top),
    });
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#FAF9F5] overflow-hidden">

      {/* Docked Technical Workbench Header */}
      <header className="h-14 border-b border-[#1A1A1A] bg-white flex items-center justify-between px-6 shrink-0 relative">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-1.5 group mr-1">
            <div className="w-5.5 h-5.5 border border-[#1A1A1A] bg-[#1A1A1A] text-white flex items-center justify-center font-mono font-bold text-[10px]">
              O
            </div>
            <span className="font-mono font-bold text-[#1A1A1A] text-[10.5px] uppercase tracking-wider hidden sm:inline-block">
              OpenResume
            </span>
          </Link>

          <div className="h-5 w-px bg-zinc-300" />

          <div className="flex items-center gap-2">
            <Input
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="h-8 w-36 sm:w-48 md:w-56 font-mono font-semibold border-[#1A1A1A] focus:border-[#E65100] bg-[#FAF9F5]/40 text-xs py-1"
            />

            {/* Undo / Redo controls */}
            <div className="flex items-center bg-[#FAF9F5] rounded-none p-0.5 border border-[#1A1A1A]">
              <Button
                variant="ghost"
                size="icon"
                className="h-6.5 w-6.5 rounded-none text-zinc-500 hover:text-[#1A1A1A] hover:bg-[#FAF9F5]"
                onClick={undo}
                disabled={!canUndo()}
              >
                <Undo2 className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6.5 w-6.5 rounded-none text-zinc-500 hover:text-[#1A1A1A] hover:bg-[#FAF9F5]"
                onClick={redo}
                disabled={!canRedo()}
              >
                <Redo2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>

        {/* Sync & Actions */}
        <div className="flex items-center gap-2">
          {user && (
            <div className="hidden md:flex items-center gap-1.5 text-[8.5px] text-zinc-450 bg-[#FAF9F5] px-2 py-1 border border-zinc-200 font-mono uppercase tracking-wider">
              {syncStatus === "saving" && <Loader2 className="w-3 h-3 animate-spin text-[#E65100]" />}
              {syncStatus === "saved" && <Check className="w-3 h-3 text-green-600" />}
              {syncStatus === "error" && <span className="text-red-500">Error</span>}
              {syncStatus === "idle" && <Cloud className="w-3 h-3 text-zinc-400" />}
              <span>
                {syncStatus === "saving" && "Saving"}
                {syncStatus === "saved" && "Synced"}
                {syncStatus === "error" && "Failed"}
                {syncStatus === "idle" && "Synced"}
              </span>
            </div>
          )}

          {isAnonymous && !isAuthLoading && (
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-[9px] font-mono font-bold uppercase rounded-none border border-[#1A1A1A] shadow-[1.5px_1.5px_0px_0px_#1A1A1A] hover:bg-zinc-50 px-2.5"
              onClick={() => setShowLoginModal(true)}
            >
              <Cloud className="w-3 h-3 mr-1 text-[#E65100]" />
              Save
            </Button>
          )}

          {isContentEmpty && (
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-[9px] font-mono font-bold uppercase rounded-none border border-[#1A1A1A] hover:bg-zinc-50 px-2.5"
              onClick={loadSample}
            >
              Demo Data
            </Button>
          )}

          <Suspense fallback={
            <div>Loading...</div>
          }>
            <DownloadPdfButtonWrapper
              content={content}
              fileName={`${content.personal.fullName || "resume"}.pdf`}
            />
          </Suspense>
        </div>
      </header>

      {/* Main Workspace Frame (Locked Viewport) */}
      <main className="flex-1 w-full p-4 overflow-hidden flex flex-col box-border">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 h-full overflow-hidden">

          {/* Left Panel: Unified Sidebar + Form Editor / Template Selection / AI tools */}
          <section className="lg:col-span-5 bg-white border border-[#1A1A1A] h-full overflow-hidden flex relative">
            <CropCorners />

            {/* Slim vertical tab icon sidebar */}
            <div className="w-12 border-r border-zinc-200 flex flex-col py-4 justify-between h-full bg-[#FAF9F5]/70 shrink-0">
              <div className="flex flex-col gap-3.5 w-full items-center">
                {/* Content Editor Tabs */}
                {contentSections.map((section, index) => (
                  <button
                    key={section.id}
                    title={section.label}
                    onClick={() => setActiveSection(section.id)}
                    className={cn(
                      "w-8.5 h-8.5 rounded-none border flex flex-col items-center justify-center transition-all relative group",
                      activeSection === section.id
                        ? "bg-[#1A1A1A] border-[#1A1A1A] text-white shadow-[1px_1px_0px_0px_#E65100]"
                        : "border-transparent text-zinc-500 hover:bg-[#FAF9F5] hover:text-[#1A1A1A] hover:border-zinc-300"
                    )}
                  >
                    <section.icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="text-[6px] font-mono opacity-80 mt-0.5 leading-none">0{index + 1}</span>
                    <span className="absolute left-12 bg-[#1A1A1A] text-white text-[8px] font-mono uppercase tracking-widest py-1 px-2 rounded-none opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow border border-zinc-700">
                      {section.label}
                    </span>
                  </button>
                ))}

                {/* Vertical Divider */}
                <div className="w-6 border-t border-dashed border-zinc-300 my-1" />

                {/* Workspace Tool Tabs (Templates / AI Assistant / Github Import) */}
                {toolSections.map((tool) => (
                  <button
                    key={tool.id}
                    title={tool.label}
                    onClick={() => setActiveSection(tool.id)}
                    className={cn(
                      "w-8.5 h-8.5 rounded-none border flex flex-col items-center justify-center transition-all relative group",
                      activeSection === tool.id
                        ? "bg-[#1A1A1A] border-[#1A1A1A] text-white shadow-[1px_1px_0px_0px_#E65100]"
                        : "border-transparent text-zinc-500 hover:bg-[#FAF9F5] hover:text-[#1A1A1A] hover:border-zinc-300"
                    )}
                  >
                    <tool.icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="text-[6px] font-mono opacity-80 mt-0.5 leading-none uppercase">
                      {tool.id.substring(0, 3)}
                    </span>
                    <span className="absolute left-12 bg-[#1A1A1A] text-white text-[8px] font-mono uppercase tracking-widest py-1 px-2 rounded-none opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow border border-zinc-700">
                      {tool.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Active Form & Tools Panel area (Scrolls internally) */}
            <div className="flex-1 p-5 overflow-y-auto custom-scrollbar flex flex-col h-full bg-white">

              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-dashed border-zinc-200 mb-4">
                <h2 className="text-[10px] font-mono font-bold text-[#1A1A1A] uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#E65100]" />
                  {activeSection === "templates" && "Layout Library Selector"}
                  {activeSection === "layout" && "Layout & Section Control"}
                  {activeSection === "ai" && "AI Copilot & Calibrator"}
                  {activeSection === "import" && "External Profile Importer"}
                  {!["templates", "layout", "ai", "import"].includes(activeSection) && `${contentSections.find((s) => s.id === activeSection)?.label} Information`}
                </h2>

                <div className="flex items-center gap-2">
                  <span className="text-[8px] font-mono text-zinc-400 uppercase">
                    {["templates", "layout", "ai", "import"].includes(activeSection) ? "SYS_TOOL" : "INPUT_FIELD"}
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </div>
              </div>

              {/* Render panel content based on selection */}
              <div className="flex-1">
                {/* 1. Editor inputs */}
                {activeSection === "personal" && (
                  <PersonalEditor content={content} updateContent={updateContent} />
                )}
                {activeSection === "experience" && (
                  <ExperienceEditor content={content} updateContent={updateContent} />
                )}
                {activeSection === "education" && (
                  <EducationEditor content={content} updateContent={updateContent} />
                )}
                {activeSection === "projects" && (
                  <ProjectsEditor content={content} updateContent={updateContent} />
                )}
                {activeSection === "skills" && (
                  <SkillsEditor content={content} updateContent={updateContent} />
                )}
                {activeSection === "certifications" && (
                  <SimpleListEditor
                    title="Certifications"
                    items={content.certifications}
                    onChange={(certifications) => updateContent((c) => ({ ...c, certifications }))}
                    fields={[
                      { key: "name", label: "Name", type: "text" },
                      { key: "issuer", label: "Issuer", type: "text" },
                      { key: "date", label: "Date", type: "text" },
                      { key: "url", label: "URL", type: "text" },
                    ]}
                  />
                )}
                {activeSection === "awards" && (
                  <SimpleListEditor
                    title="Awards"
                    items={content.awards}
                    onChange={(awards) => updateContent((c) => ({ ...c, awards }))}
                    fields={[
                      { key: "title", label: "Title", type: "text" },
                      { key: "issuer", label: "Issuer", type: "text" },
                      { key: "date", label: "Date", type: "text" },
                      { key: "description", label: "Description", type: "textarea" },
                    ]}
                  />
                )}
                {activeSection === "languages" && (
                  <SimpleListEditor
                    title="Languages"
                    items={content.languages}
                    onChange={(languages) => updateContent((c) => ({ ...c, languages }))}
                    fields={[
                      { key: "name", label: "Language", type: "text" },
                      {
                        key: "proficiency",
                        label: "Proficiency",
                        type: "select",
                        options: ["elementary", "limited", "professional", "fluent", "native"],
                      },
                    ]}
                  />
                )}

                {/* 2. Template Selector (Direct panel integration) */}
                {activeSection === "templates" && (
                  <div className="space-y-4">
                    <p className="text-[10px] font-mono text-zinc-550 leading-relaxed">
                      Select layout parameters below. The preview drawing sheet will update dimensions dynamically.
                    </p>
                    <TemplateSelector selectedId={templateId} onSelect={setTemplateId} />
                  </div>
                )}

                {/* 2b. Layout & Section Control */}
                {activeSection === "layout" && (
                  <div className="space-y-4">
                    <p className="text-[10px] font-mono text-zinc-550 leading-relaxed">
                      Visually structure your PDF: reorder top-level sections, toggle visibility, and tune the base font size. Changes apply to both the preview and the downloaded PDF.
                    </p>
                    <LayoutPanel content={content} updateContent={updateContent} />
                  </div>
                )}

                {/* 3. AI Assistant Tools (Unified panel) */}
                {activeSection === "ai" && (
                  <div className="space-y-6">
                    <ByokSettings />
                    <div className="border-t border-dashed border-zinc-200" />
                    <AtsScore content={content} className="border border-[#1A1A1A] bg-[#FAF9F5]/30 shadow-none p-4" />
                    <div className="border-t border-dashed border-zinc-200 my-4" />
                    <JobTailor />
                    <div className="border-t border-dashed border-zinc-200 my-4" />
                    <div className="p-4 border border-[#1A1A1A] bg-[#FAF9F5]/20">
                      <h4 className="text-[9.5px] font-mono font-bold uppercase text-[#1A1A1A] mb-2 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-[#E65100]" />
                        AI Copilot Chat
                      </h4>
                      <ChatResume />
                    </div>
                  </div>
                )}

                {/* 4. Import Hub panel */}
                {activeSection === "import" && (
                  <div className="space-y-6">
                    <p className="text-[10px] font-mono text-zinc-550 leading-relaxed">
                      Import structured JSON lists or sync directly from public profiles.
                    </p>
                    <GithubImport />
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Right Panel: Live Preview Canvas Workspace (Completely locked, scrolls canvas only) */}
          <section className="lg:col-span-7 flex flex-col h-full bg-white border border-[#1A1A1A] overflow-hidden relative">
            <CropCorners />

            {/* Canvas Toolbar Header */}
            <div className="bg-white border-b border-zinc-200 px-4 py-2.5 flex items-center justify-between shrink-0 select-none">

              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono text-zinc-400 uppercase">Canvas Preview</span>
                <span className="text-[8px] font-mono text-[#E65100] bg-orange-50 px-1 border border-orange-200">
                  {zoomLevel}% SCALE
                </span>
              </div>

              {/* View configs, zoom, and live cursor coordinate tracker */}
              <div className="flex items-center gap-3">
                <div className="hidden sm:inline-block text-[8px] font-mono text-zinc-400 uppercase">
                  X:<span className="text-[#1A1A1A] font-bold">{mouseCoords.x}px</span> Y:<span className="text-[#1A1A1A] font-bold">{mouseCoords.y}px</span>
                </div>

                <div className="flex items-center gap-0.5 bg-[#FAF9F5] rounded-none p-0.5 border border-[#1A1A1A]">
                  <button
                    onClick={() => setPreviewMode("visual")}
                    className={cn(
                      "text-[8.5px] font-mono px-2 py-0.5 rounded-none uppercase",
                      previewMode === "visual" ? "bg-[#1A1A1A] text-white" : "text-zinc-500 hover:text-[#1A1A1A]"
                    )}
                  >
                    Visual
                  </button>
                  <button
                    onClick={() => setPreviewMode("ats")}
                    className={cn(
                      "text-[8.5px] font-mono px-2 py-0.5 rounded-none uppercase",
                      previewMode === "ats" ? "bg-[#1A1A1A] text-white" : "text-zinc-500 hover:text-[#1A1A1A]"
                    )}
                  >
                    ATS Text
                  </button>
                </div>

                <div className="flex items-center gap-1 bg-[#FAF9F5] border border-[#1A1A1A] px-1.5 py-0.5">
                  <select
                    value={zoomLevel}
                    onChange={(e) => setZoomLevel(Number(e.target.value))}
                    className="bg-transparent border-0 text-[8.5px] font-mono text-[#1A1A1A] font-bold p-0 outline-none focus:ring-0 cursor-pointer min-w-[50px] !border-none"
                  >
                    <option value={70}>70%</option>
                    <option value={85}>85%</option>
                    <option value={100}>100%</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Drawing Board Canvas Area (This area scrolls if sheet exceeds size, locked viewport remains solid) */}
            <div
              className="flex-1 bg-[#FAF9F5]/40 bg-grid-drafting-fine overflow-auto p-8 flex items-start justify-center custom-scrollbar relative"
              onMouseMove={handleMouseMove}
            >

              {/* Subtle top ruler ticks */}
              <div className="absolute top-0 left-0 right-0 h-3">
                <TechRuler orientation="horizontal" />
              </div>

              {/* Subtle left ruler ticks */}
              <div className="absolute top-3 left-0 bottom-0 w-3">
                <TechRuler orientation="vertical" />
              </div>

              <div className="h-full flex flex-col pt-4">
                {previewMode === "visual" ? (
                  <div
                    className="origin-top transition-transform duration-200 ease-out max-w-[210mm] mx-auto shadow-[4px_4px_16px_rgba(26,26,26,0.06)] border border-[#1A1A1A] relative"
                    style={{ transform: `scale(${zoomLevel / 100})` }}
                  >
                    {/* Dotted margin boundaries */}
                    <div className="absolute inset-4 border border-dashed border-[#E65100]/10 pointer-events-none z-10" />

                    <ResumePreview
                      content={content}
                      templateId={templateId}
                      className="min-h-[297mm] select-text"
                    />
                  </div>
                ) : (
                  <div className="max-w-[210mm] mx-auto w-full pt-4">
                    <AtsPreview content={content} className="border-[#1A1A1A] bg-white text-[#1A1A1A] font-mono" />
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </div>
  );
}
