"use client";

import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { ResumeContent } from "@openresume/schema";
import {
  getEffectiveFontSize,
  getEffectiveSectionOrder,
  getEffectiveSectionVisibility,
  type ResumeSectionId,
} from "@openresume/renderer";
import { Fragment } from "react";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    lineHeight: 1.4,
    color: "#1e293b",
  },
  header: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    paddingBottom: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 4,
    color: "#0f172a",
  },
  contact: {
    fontSize: 9,
    color: "#64748b",
    marginBottom: 2,
  },
  summary: {
    marginTop: 8,
    lineHeight: 1.5,
    color: "#334155",
  },
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "#64748b",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    paddingBottom: 4,
    marginBottom: 8,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  itemTitle: {
    fontWeight: 700,
    fontSize: 10,
    color: "#0f172a",
  },
  itemSubtitle: {
    fontSize: 9,
    color: "#475569",
    fontStyle: "italic",
  },
  itemDate: {
    fontSize: 9,
    color: "#64748b",
  },
  bullet: {
    fontSize: 9,
    marginLeft: 10,
    marginTop: 2,
    color: "#334155",
  },
  skills: {
    fontSize: 9,
    color: "#334155",
  },
});

interface ResumeDocumentProps {
  content: ResumeContent;
}

const PersonalSection = ({ content }: { content: ResumeContent }) => {
  const { personal } = content;
  return (
    <View style={styles.header}>
      <Text style={styles.name}>{personal.fullName}</Text>
      <Text style={styles.contact}>
        {[
          personal.email,
          personal.phone,
          personal.location,
          personal.linkedin && `linkedin.com/in/${personal.linkedin}`,
          personal.github && `github.com/${personal.github}`,
          personal.website,
        ]
          .filter(Boolean)
          .join(" · ")}
      </Text>
      {personal.summary && <Text style={styles.summary}>{personal.summary}</Text>}
    </View>
  );
};

const ExperienceSection = ({ content }: { content: ResumeContent }) => {
  if (content.experience.length === 0) return null;
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Experience</Text>
      {content.experience.map((job) => (
        <View key={job.id} style={{ marginBottom: 10 }}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemTitle}>{job.role}</Text>
            <Text style={styles.itemDate}>
              {job.startDate} – {job.current ? "Present" : job.endDate}
            </Text>
          </View>
          <Text style={styles.itemSubtitle}>
            {job.company}{job.location ? `, ${job.location}` : ""}
          </Text>
          {job.highlights.map((highlight, i) => (
            <Text key={i} style={styles.bullet}>• {highlight}</Text>
          ))}
        </View>
      ))}
    </View>
  );
};

const EducationSection = ({ content }: { content: ResumeContent }) => {
  if (content.education.length === 0) return null;
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Education</Text>
      {content.education.map((edu) => (
        <View key={edu.id} style={{ marginBottom: 8 }}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemTitle}>{edu.institution}</Text>
            <Text style={styles.itemDate}>
              {edu.startDate} – {edu.current ? "Present" : edu.endDate}
            </Text>
          </View>
          <Text style={styles.itemSubtitle}>
            {edu.degree}{edu.field ? `, ${edu.field}` : ""}
          </Text>
        </View>
      ))}
    </View>
  );
};

const ProjectsSection = ({ content }: { content: ResumeContent }) => {
  if (content.projects.length === 0) return null;
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Projects</Text>
      {content.projects.map((project) => (
        <View key={project.id} style={{ marginBottom: 8 }}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemTitle}>{project.name}</Text>
            {project.url && <Text style={styles.itemDate}>{project.url}</Text>}
          </View>
          {project.description && <Text style={styles.itemSubtitle}>{project.description}</Text>}
        </View>
      ))}
    </View>
  );
};

const SkillsSection = ({ content }: { content: ResumeContent }) => {
  if (content.skills.length === 0) return null;
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Skills</Text>
      <Text style={styles.skills}>{content.skills.map((s) => s.name).join(" · ")}</Text>
    </View>
  );
};

const CertificationsSection = ({ content }: { content: ResumeContent }) => {
  if (content.certifications.length === 0) return null;
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Certifications</Text>
      {content.certifications.map((cert) => (
        <Text key={cert.id} style={styles.bullet}>
          {cert.name}{cert.issuer ? ` — ${cert.issuer}` : ""}{cert.date ? ` (${cert.date})` : ""}
        </Text>
      ))}
    </View>
  );
};

const AwardsSection = ({ content }: { content: ResumeContent }) => {
  if (content.awards.length === 0) return null;
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Awards</Text>
      {content.awards.map((award) => (
        <Text key={award.id} style={styles.bullet}>
          {award.title}{award.issuer ? ` — ${award.issuer}` : ""}{award.date ? ` (${award.date})` : ""}
        </Text>
      ))}
    </View>
  );
};

const LanguagesSection = ({ content }: { content: ResumeContent }) => {
  if (content.languages.length === 0) return null;
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Languages</Text>
      <Text style={styles.skills}>
        {content.languages.map((l) => `${l.name}${l.proficiency ? ` (${l.proficiency})` : ""}`).join(" · ")}
      </Text>
    </View>
  );
};

const SECTION_RENDERERS: Record<ResumeSectionId, (props: { content: ResumeContent }) => React.ReactElement | null> = {
  personal: PersonalSection,
  experience: ExperienceSection,
  education: EducationSection,
  projects: ProjectsSection,
  skills: SkillsSection,
  certifications: CertificationsSection,
  awards: AwardsSection,
  languages: LanguagesSection,
};

export function ResumeDocument({ content }: ResumeDocumentProps) {
  const order = getEffectiveSectionOrder(content);
  const visibility = getEffectiveSectionVisibility(content);
  const fontSize = getEffectiveFontSize(content);

  const dynamicStyles = StyleSheet.create({
    page: { ...styles.page, fontSize },
  });

  return (
    <Document>
      <Page size="A4" style={dynamicStyles.page}>
        {order.map((id) => {
          if (!visibility[id]) return null;
          const Renderer = SECTION_RENDERERS[id];
          if (!Renderer) return null;
          return (
            <Fragment key={id}>
              <Renderer content={content} />
            </Fragment>
          );
        })}
      </Page>
    </Document>
  );
}
