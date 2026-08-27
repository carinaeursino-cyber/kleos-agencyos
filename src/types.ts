// ─────────────────────────────────────────────────────────────────
// KLEOS CONSULTORÍA — Tipos de contenido
// ─────────────────────────────────────────────────────────────────

export interface Symptom {
  id: string;
  text: string;
}

export interface Pillar {
  id: string;
  title: string;
  description: string;
}

export interface ConsultingService {
  id: string;
  title: string;
  intro: string;
  bullets: string[];
  result: string;
}

export interface AosLayer {
  id: string;
  title: string;
  description: string;
  items: string[];
}

export interface ControlDashboard {
  id: string;
  title: string;
  metrics: string[];
}

export interface OnboardingDay {
  id: string;
  day: string;
  title: string;
  items: string[];
}

export interface AutomationItem {
  id: string;
  text: string;
}

export interface FitItem {
  id: string;
  text: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}
