"use client";

import { Button } from "@/components/ui/button";
import type { ResumeContent } from "@openresume/schema";
import { Download, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { pdf } from "@react-pdf/renderer";
import { ResumeDocument } from "./resume-document";

interface DownloadPdfButtonProps {
  content: ResumeContent;
  fileName?: string;
}

export function DownloadPdfButton({ content, fileName = "resume.pdf" }: DownloadPdfButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleDownload = () => {
    if (isPending) return;
    setError(null);
    startTransition(async () => {
      try {
        const doc = <ResumeDocument content={content} />;
        const blob = await pdf(doc).toBlob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      } catch (err) {
        console.error("Failed to generate PDF", err);
        setError(err instanceof Error ? err.message : "Failed to generate PDF");
      }
    });
  };

  return (
    <Button
      size="sm"
      onClick={handleDownload}
      disabled={isPending}
      title={error ?? undefined}
      className="h-8 text-[9px] font-mono font-bold uppercase rounded-none border border-[#1A1A1A] bg-[#1A1A1A] text-white hover:bg-[#E65100] hover:border-[#E65100] px-2.5"
    >
      {isPending ? (
        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
      ) : (
        <Download className="w-3 h-3 mr-1" />
      )}
      {isPending ? "Building..." : "Download PDF"}
    </Button>
  );
}
