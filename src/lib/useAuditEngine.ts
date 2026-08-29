import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import { useReducedMotion } from "motion/react";
import {
  AUDIT_STORAGE_KEY,
  FIRST_QUESTION,
  QUESTIONS,
  TOTAL_STEPS,
  buildPayload,
  buildReading,
  isLastQuestion,
  nextQuestionId,
  type Answers,
  type AuditOption,
  submitAudit,
} from "./audit";

// ─────────────────────────────────────────────────────────────────
// useAuditEngine — la maquina de estados del protocolo.
//
// El estado es UNA sola cosa: la pila de respuestas (`history`). El paso
// actual no se guarda: se recalcula contra el motor de ramas (replay).
// Por que asi: si el usuario vuelve atras y cambia una respuesta, la rama
// del paso 2 cambia sola y el flujo sigue siendo coherente. Guardar
// "paso actual" y "respuestas" por separado es la forma clasica de que un
// wizard se desincronice.
//
// La eleccion vive aparte (`pending`) hasta que pasa el beat de
// "procesando". Eso da el estado activo en la tarjeta antes de cambiar de
// pregunta, y evita el bug de saltear a la siguiente antes de que se vea
// lo que se toco.
// ─────────────────────────────────────────────────────────────────

export interface HistoryEntry {
  questionId: string;
  optionId: string;
}

interface State {
  history: HistoryEntry[];
  pending: HistoryEntry | null;
  /** "processing" es el unico estado que se declara: los otros se derivan */
  busy: boolean;
  startedAt: number;
  doneAt: number | null;
}

type Action =
  | { type: "restore"; history: HistoryEntry[]; startedAt: number; doneAt: number | null }
  | { type: "pick"; questionId: string; option: AuditOption }
  | { type: "commit" }
  | { type: "back" }
  | { type: "restart" };

const empty: State = {
  history: [],
  pending: null,
  busy: false,
  startedAt: Date.now(),
  doneAt: null,
};

/** Repone las respuestas contra el motor y devuelve donde hay que estar. */
export function replay(history: HistoryEntry[]) {
  const map = new Map(history.map((h) => [h.questionId, h.optionId]));
  let id: string | null = FIRST_QUESTION;
  let guard = 0;
  while (id) {
    // Red de seguridad: una rama mal escrita en audit.ts seria un loop
    // infinito en el navegador. Con TOTAL_STEPS de tope no puede pasar.
    if (guard++ > TOTAL_STEPS * 2) break;
    const question = QUESTIONS[id];
    if (!question) return { currentId: FIRST_QUESTION, answered: guard, done: false };
    const optionId = map.get(id);
    if (!optionId) return { currentId: id, answered: guard - 1, done: false };
    const option = question.options.find((o) => o.id === optionId);
    if (!option) return { currentId: id, answered: guard - 1, done: false };
    if (isLastQuestion(id)) return { currentId: id, answered: guard, done: true };
    id = nextQuestionId(id, option);
  }
  return { currentId: FIRST_QUESTION, answered: 0, done: false };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "restore":
      return {
        history: action.history,
        pending: null,
        busy: false,
        startedAt: action.startedAt,
        doneAt: action.doneAt,
      };

    case "pick": {
      // un clic por paso: mientras se procesa, el resto esta bloqueado
      if (state.busy || action.questionId !== replay(state.history).currentId) return state;
      return { ...state, pending: { questionId: action.questionId, optionId: action.option.id }, busy: true };
    }

    case "commit": {
      if (!state.pending) return state;
      const picked = state.pending;
      const history = [...state.history.filter((h) => h.questionId !== picked.questionId), picked];
      const next = replay(history);
      return {
        ...state,
        history,
        pending: null,
        busy: false,
        doneAt: next.done ? Date.now() : null,
      };
    }

    case "back": {
      if (!state.history.length) return state;
      return { ...state, history: state.history.slice(0, -1), pending: null, busy: false, doneAt: null };
    }

    case "restart":
      return { ...empty, startedAt: Date.now() };

    default:
      return state;
  }
}

// La clave la define el protocolo (kleos:kip-004:1.0), no la pagina.
const STORAGE_KEY = AUDIT_STORAGE_KEY;

export type AuditPhase = "question" | "processing" | "reading";

export function useAuditEngine() {
  const [state, dispatch] = useReducer(reducer, empty);
  const reduceMotion = useReducedMotion();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hydrated = useRef(false);

  // ── Continuidad: una recarga a mitad del protocolo no borra el avance ──
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as { history?: HistoryEntry[]; startedAt?: number; doneAt?: number | null };
        if (Array.isArray(saved.history) && saved.history.length) {
          dispatch({
            type: "restore",
            history: saved.history,
            startedAt: saved.startedAt || Date.now(),
            doneAt: saved.doneAt ?? null,
          });
        }
      }
    } catch {
      /* sessionStorage bloqueado (modo privado): se sigue, sin guardar */
    }
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* idem */
    }
  }, [state]);

  const { currentId, answered, done } = useMemo(() => replay(state.history), [state.history]);
  const question = QUESTIONS[currentId];
  const phase: AuditPhase = state.busy ? "processing" : done ? "reading" : "question";

  const pickedId =
    state.pending?.questionId === currentId
      ? state.pending.optionId
      : state.history.find((h) => h.questionId === currentId)?.optionId;

  // ── El beat de "procesando" ──
  useEffect(() => {
    if (!state.busy) return;
    timer.current = setTimeout(() => dispatch({ type: "commit" }), reduceMotion ? 0 : 460);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [state.busy, reduceMotion]);

  const answers: Answers = useMemo(() => {
    const out: Answers = {};
    for (const h of state.history) out[h.questionId] = h.optionId;
    return out;
  }, [state.history]);

  const reading = useMemo(() => (done ? buildReading(answers) : null), [done, answers]);

  // El payload se arma al cerrar. Con AUDIT_ENDPOINT en null no sale nada del
  // navegador: submitAudit() devuelve { sent: false } sin tocar la red.
  const payload = useMemo(() => (done ? buildPayload(answers, state.startedAt) : null), [done, answers, state.startedAt]);
  useEffect(() => {
    if (!payload) return;
    if (import.meta.env.DEV) console.debug("[KIP] payload listo para el backend:", payload);
    void submitAudit(payload);
  }, [payload]);

  const pick = useCallback(
    (option: AuditOption) => dispatch({ type: "pick", questionId: currentId, option }),
    [currentId]
  );

  const trace = useMemo(() => {
    if (!state.pending) return [];
    const option = QUESTIONS[state.pending.questionId]?.options.find((o) => o.id === state.pending!.optionId);
    const delta = Object.entries(option?.scores ?? {})
      .map(([axis, v]) => `${axis.toUpperCase()} +${v}`)
      .join("  ·  ");
    return [
      `SEÑAL REGISTRADA · ${state.pending.questionId.toUpperCase()}`,
      delta || "SIN PRESION NUEVA · SE CONFIRMA EL PATRON PREVIO",
      done ? "COMPONENDO LECTURA…" : "PROYECTANDO SIGUIENTE PUNTO DE PRESION…",
    ];
  }, [state.pending, done]);

  return {
    phase,
    question,
    step: question.step,
    total: TOTAL_STEPS,
    answered,
    pickedId,
    trace,
    reading,
    payload,
    canGoBack: state.history.length > 0 && !state.busy,
    pick,
    back: () => dispatch({ type: "back" }),
    restart: () => dispatch({ type: "restart" }),
  };
}