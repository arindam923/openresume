"use client";

import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { lazy, Suspense, useEffect, useState } from "react";
import type { ResumeContent } from "@openresume/schema";

const DownloadPdfButton = lazy(() =>
  import("./download-pdf-button").then((mod) => ({ default: mod.DownloadPdfButton }))
);

interface DownloadPdfButtonWrapperProps {
  content: ResumeContent;
  fileName?: string;
}

export function DownloadPdfButtonWrapper({ content, fileName }: DownloadPdfButtonWrapperProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        size="sm"
        disabled
        className="h-8 text-[9px] font-mono font-bold uppercase rounded-none border border-[#1A1A1A] bg-[#1A1A1A] text-white px-2.5 opacity-80"
      >
        <Download className="w-3 h-3 mr-1" />
        Download PDF
      </Button>
    );
  }

  return (
    <Suspense
      fallback={
        <Button
          size="sm"
          disabled
          className="h-8 text-[9px] font-mono font-bold uppercase rounded-none border border-[#1A1A1A] bg-[#1A1A1A] text-white px-2.5"
        >
          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
          Loading...
        </Button>
      }
    >
      <DownloadPdfButton content={content} fileName={fileName} />
    </Suspense>
  );
}
