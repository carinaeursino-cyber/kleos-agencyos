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
  /** Parrafo corto bajo el titulo. Es lo unico que se pinta de la tarjeta:
   *  `items` queda como dato sin render (ver el comentario en OnboardingSection). */
  description: string;
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