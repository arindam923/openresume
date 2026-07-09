"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { aiApi } from "@/lib/ai/api";
import { useResumeStore } from "@/lib/resume/store";
import { Github, Loader2 } from "lucide-react";

interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  topics: string[];
}

interface GitHubProfile {
  login: string;
  name: string | null;
  bio: string | null;
  blog: string | null;
  location: string | null;
  company: string | null;
  avatar_url: string;
}

export function GithubImport() {
  const { setContent, setTitle } = useResumeStore();
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImport = async () => {
    if (!username.trim()) return;
    setIsLoading(true);
    setError(null);

    try {
      // Fetch from GitHub public API
      const [profileRes, reposRes] = await Promise.all([
        fetch(`https://api.github.com/users/${username.trim()}`),
        fetch(`https://api.github.com/users/${username.trim()}/repos?sort=stars&per_page=10`),
      ]);

      if (!profileRes.ok) {
        throw new Error("GitHub user not found");
      }

      const profile: GitHubProfile = await profileRes.json();
      const repos: GitHubRepo[] = await reposRes.json();

      const repoSummary = repos
        .map(
          (repo) =>
            `${repo.name}: ${repo.description || "No description"} (${repo.stargazers_count} stars, language: ${repo.language || "unknown"})`
        )
        .join("\n");

      const input = `GitHub Profile: ${profile.login}
Name: ${profile.name || "N/A"}
Bio: ${profile.bio || "N/A"}
Location: ${profile.location || "N/A"}
Company: ${profile.company || "N/A"}
Blog: ${profile.blog || "N/A"}

Top Repositories:
${repoSummary}`;

      const response = await aiApi.generate(input, "github");
      setContent(response.content);
      setTitle(`${response.content.personal.fullName || profile.login}'s Resume`);
    } catch (error) {
      console.error("GitHub import failed", error);
      setError(error instanceof Error ? error.message : "Import failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <Github className="w-5 h-5 text-slate-700" />
        <h3 className="font-semibold">Import from GitHub</h3>
      </div>

      <div className="flex gap-2">
        <Input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="GitHub username"
        />
        <Button onClick={handleImport} disabled={isLoading || !username.trim()}>
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Import"}
        </Button>
      </div>

      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
      <p className="text-xs text-slate-500 mt-2">
        Fetches public profile and top repositories, then uses AI to build a developer resume.
      </p>
    </div>
  );
}
