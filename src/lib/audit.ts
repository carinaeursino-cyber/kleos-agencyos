// ─────────────────────────────────────────────────────────────────
// KIP-004 · Operaciones — el motor de la auditoria del sitio de agencia.
// Es el protocolo KIP-004 del catalogo de KLEOS INSIGHT (engine.js: KIP-001
// Percepcion, KIP-002 Conversion, KIP-003 Oferta, KIP-004 Operaciones,
// KIP-005 Escalabilidad). Aca esta definido, no comprado: no hay gate, no hay
// nombre, no hay email, no hay pago. La lectura se muestra entera.
//
// Capa pura: preguntas, ramas, puntajes y lectura. No importa React ni
// toca el DOM, asi que se puede probar en Node (npm run test:audit).
// Todo corre en el navegador del visitante: no se envia ningun dato.
// ─────────────────────────────────────────────────────────────────

export const AUDIT_ROUTE = "/auditoria";
export const AUDIT_PROTOCOL = "KIP-004";
export const AUDIT_NAME = "Operaciones";
export const AUDIT_VERSION = "1.0";
// Mismo prefijo de claves que el KV de KLEOS INSIGHT (kleos:kip001:..., que se
// ve en capture.js), con el codigo del protocolo en el nombre. Es sessionStorage
// del navegador, pero asi el habito de nombres coincide si algun dia comparten
// almacen.
export const AUDIT_STORAGE_KEY = `kleos:${AUDIT_PROTOCOL.toLowerCase()}:${AUDIT_VERSION}`;

/** Las cinco dimensiones que mide el protocolo. En las opciones se acumula
 *  friccion; en la lectura se publica SALUD por dimension (0-20), o sea que el
 *  numero sube cuando la operacion esta mas goberada. */
export type Axis = "dependencia" | "procesos" | "visibilidad" | "consistencia" | "capacidad";

/** Cada dimension vale 0-20 y el indice es la suma (0-100), igual que en
 *  KIP-001 (engine.js:513). Mas alto = mejor gobernado. Las etiquetas estan
 *  escritas como virtud porque el numero es salud, no friccion: 16/20 tiene
 *  que leerse bien. */
export const AXIS_MAX = 20;

export const AXES: { id: Axis; label: string; short: string }[] = [
  { id: "dependencia", label: "Autonomía del equipo", short: "DEP" },
  { id: "procesos", label: "Procesos definidos", short: "PRO" },
  { id: "visibilidad", label: "Visibilidad en tiempo real", short: "VIS" },
  { id: "consistencia", label: "Consistencia de entrega", short: "CON" },
  { id: "capacidad", label: "Capacidad disponible", short: "CAP" },
];

export const TOTAL_STEPS = 5;

export interface AuditOption {
  id: string;
  label: string;
  hint?: string;
  /** friccion 0-4 por eje; solo se listan los ejes que la respuesta toca */
  scores: Partial<Record<Axis, number>>;
  /** la frase que el motor mete en la lectura cuando se elige esta opcion */
  finding: string;
  /** proxima pregunta; si falta, sigue el orden natural del paso */
  next?: string;
}

export interface AuditQuestion {
  id: string;
  step: number;
  phase: string;
  title: string;
  context?: string;
  options: AuditOption[];
}

export const FIRST_QUESTION = "q1";

const ORDER = ["q1", "q2_solo", "q2_equipo", "q3", "q4", "q5"];

export const QUESTIONS: Record<string, AuditQuestion> = {
  q1: {
    id: "q1",
    step: 1,
    phase: "Contexto",
    title: "¿De cuántas personas depende hoy que la operación funcione?",
    context: "No cuántos facturan: cuántos sostienen.",
    options: [
      {
        id: "q1a",
        label: "Solo yo.",
        hint: "Todo pasa por mí antes de avanzar.",
        scores: { dependencia: 4, capacidad: 2 },
        finding:
          "Toda la operación depende de una sola cabeza. Eso no es liderazgo cercano: es un punto único de falla que además fija el techo de crecimiento de la agencia.",
        next: "q2_solo",
      },
      {
        id: "q1b",
        label: "Entre 2 y 4.",
        hint: "Dos o tres personas sostienen el grueso.",
        scores: { dependencia: 3, capacidad: 1 },
        finding:
          "La dependencia está repartida en muy pocas manos: lo que hoy funciona por criterio compartido se rompe en cuanto una de esas personas falta o se va.",
        next: "q2_equipo",
      },
      {
        id: "q1c",
        label: "Entre 5 y 15.",
        hint: "Hay equipo, pero se sostiene con voluntad.",
        scores: { capacidad: 2, procesos: 2 },
        finding:
          "Con este tamaño el criterio personal deja de escalar: cada persona reinterpreta el proceso y la calidad empieza a variar según quién tomó el cliente.",
        next: "q2_equipo",
      },
      {
        id: "q1d",
        label: "Más de 15.",
        hint: "El volumen ya superó al ordenador.",
        scores: { capacidad: 3, procesos: 3, visibilidad: 1 },
        finding:
          "El volumen ya superó al sistema: a esta escala la operación no se sostiene con contexto en la cabeza de nadie, sino con arquitectura documentada.",
        next: "q2_equipo",
      },
    ],
  },

  q2_solo: {
    id: "q2_solo",
    step: 2,
    phase: "Operación",
    title: "Si te ausentas un día entero, ¿qué es lo primero que se frena?",
    context: "Ese es el diagnóstico, no tu agenda.",
    options: [
      {
        id: "q2sa",
        label: "Las decisiones.",
        hint: "Nadie aprueba ni cierra nada sin mí.",
        scores: { dependencia: 4, procesos: 3 },
        finding:
          "El cuello de botella es decisorio: no hay umbrales definidos de qué puede resolverse sin ti, así que el equipo espera en vez de avanzar.",
      },
      {
        id: "q2sb",
        label: "El contexto.",
        hint: "Nadie sabe en qué quedó cada cliente.",
        scores: { dependencia: 3, visibilidad: 4 },
        finding:
          "El contexto vive en tu memoria, no en el sistema. Mientras eso sea así, tu ausencia cuesta días y tu presencia se vuelve obligatoria.",
      },
      {
        id: "q2sc",
        label: "La calidad.",
        hint: "Lo que entregan no se parece a lo que entregaría yo.",
        scores: { consistencia: 4, procesos: 2 },
        finding:
          "Lo que hoy garantiza la calidad es tu revisión personal. Falta convertirla en estándar: checklist, definiciones de 'terminado' y ejemplos de referencia dentro del sistema.",
      },
      {
        id: "q2sd",
        label: "Nada grave, pero se enfría el ritmo.",
        hint: "Avanza lento hasta que vuelvo.",
        scores: { dependencia: 2, capacidad: 1 },
        finding:
          "La operación no se detiene, pero pierde velocidad sin ti: es un sistema que funciona por inercia, no por diseño, y la inercia se agota cuando el equipo crece.",
      },
    ],
  },

  q2_equipo: {
    id: "q2_equipo",
    step: 2,
    phase: "Operación",
    title: "Cuando un cliente pide un cambio, ¿qué pasa en tu equipo?",
    context: "El pedido es la muestra; la respuesta es el sistema.",
    options: [
      {
        id: "q2ea",
        label: "Cada uno lo resuelve como puede.",
        hint: "Cuatro personas, cuatro procedimientos.",
        scores: { consistencia: 4, procesos: 3 },
        finding:
          "No hay un camino único para el cambio de un cliente: cada persona improvisa el suyo y el resultado depende de quién tomó el pedido, no de tu estándar.",
      },
      {
        id: "q2eb",
        label: "Me lo derivan a mí para decidir.",
        hint: "Soy el aprobador por defecto.",
        scores: { dependencia: 4, procesos: 2 },
        finding:
          "Las decisiones que no requieren a un fundador terminan en tu bandeja: falta un umbral explícito de qué puede cerrarse sin ti.",
      },
      {
        id: "q2ec",
        label: "Se pierde tiempo hasta encontrar en qué quedó eso.",
        hint: "El historial está repartido en chats.",
        scores: { visibilidad: 4, procesos: 1 },
        finding:
          "Buena parte del costo operativo es arqueología: buscar el estado real de un pedido en lugar de trabajar sobre él.",
      },
      {
        id: "q2ed",
        label: "Hay un camino definido y se respeta.",
        hint: "Está documentado y nadie lo saltea.",
        scores: { procesos: 0, consistencia: 0 },
        finding:
          "Ese camino ya existe y funciona; el trabajo no es crearlo sino dejar de depender de que las personas lo recuerden.",
      },
    ],
  },

  q3: {
    id: "q3",
    step: 3,
    phase: "Herramientas",
    title: "¿Dónde vive hoy la verdad de tus proyectos?",
    context: "La fuente de verdad, no la que se usa de adorno.",
    // Agnostico de herramienta: ninguna opcion nombra un software. Las 4 estan
    // en escalera (01 lo peor -> 04 lo mejor) y los scores bajan en ese mismo
    // orden: 9, 8, 7, 0 de friccion.
    options: [
      {
        id: "q3a",
        label: "En la herramienta, a medias.",
        hint: "Mucho sigue en chats, mails y planillas sueltas.",
        scores: { visibilidad: 4, procesos: 3, capacidad: 2 },
        finding:
          "La herramienta está instalada pero no es la fuente de verdad: el estado real de cada cliente sigue repartido entre chats, mails y planillas, así que nadie puede responder «¿en qué quedó esto?» sin preguntar.",
      },
      {
        id: "q3b",
        label: "Fragmentado en varias herramientas.",
        hint: "Cada área usa la suya. No hay una fuente única.",
        scores: { visibilidad: 4, consistencia: 2, capacidad: 2 },
        finding:
          "No tienes un sistema: tienes varias herramientas sin frontera clara, y el costo aparece cada vez que alguien necesita el cuadro completo de la operación.",
      },
      {
        id: "q3c",
        label: "En una sola herramienta, pero sin reglas claras.",
        hint: "Mismo tool, cinco convenciones distintas. Cada equipo lo usa a su manera.",
        scores: { consistencia: 3, visibilidad: 2, procesos: 2 },
        finding:
          "La herramienta es común pero el uso no: cuando cada equipo nombra, estructura y cierra a su manera, los tableros dejan de ser comparables y los reportes mienten.",
      },
      {
        id: "q3d",
        label: "En una herramienta, con un sistema que el equipo respeta.",
        hint: "Está cargado, está actualizado y es confiable.",
        scores: { visibilidad: 0, consistencia: 0 },
        finding:
          "La base ya está: hay fuente de verdad y el equipo la sostiene. Lo que falta arriba de eso es gobernarla con métricas, no construirla.",
      },
    ],
  },

  q4: {
    id: "q4",
    step: 4,
    phase: "Adopción",
    title: "¿Qué pasó la última vez que intentaste ordenar esto?",
    context: "Acá se define si el problema era el sistema o la adopción.",
    options: [
      {
        id: "q4a",
        label: "Lo implementamos y a las semanas volvió el desorden.",
        hint: "El sistema se vació solo.",
        scores: { consistencia: 4, capacidad: 2 },
        finding:
          "El sistema se murió de abandono, no de diseño: no había dueños, ni revisión periódica, ni consecuencia cuando alguien dejaba de cargar. Un proceso sin gobernanza vuelve al caos.",
      },
      {
        id: "q4b",
        label: "Nunca llegué a implementarlo.",
        hint: "No tuve tiempo, otra vez.",
        scores: { capacidad: 4, dependencia: 2 },
        finding:
          "El plan nunca arrancó porque su dueño eres tú y tu agenda está llena de lo urgente: mientras la implementación dependa de tu tiempo libre, no va a ocurrir.",
      },
      {
        id: "q4c",
        label: "El equipo lo abandonó en cuanto dejé de insistir.",
        hint: "Funcionaba mientras yo empujaba.",
        scores: { consistencia: 3, capacidad: 2, dependencia: 1 },
        finding:
          "La adopción dependía de tu presión personal, no de que el sistema fuera el camino más fácil. Cuando el orden se sostiene con seguimiento, el orden se acaba.",
      },
      {
        id: "q4d",
        label: "Funcionó, pero solo para una parte del equipo.",
        hint: "Dos equipos, dos realidades.",
        scores: { consistencia: 2, visibilidad: 2 },
        finding:
          "La implementación fue parcial: convives con dos operaciones, una ordenada y otra no, y todo lo que depende de ambas se rompe en la costura.",
      },
    ],
  },

  q5: {
    id: "q5",
    step: 5,
    phase: "Prioridad",
    title: "¿Qué tendría que pasar para que esto valga la pena?",
    context: "Define por dónde se empieza, no qué se compra.",
    options: [
      {
        id: "q5a",
        label: "Que mi equipo pueda decidir sin preguntarme.",
        scores: { dependencia: 1 },
        finding:
          "Tu prioridad es la delegación real: sin umbrales de decisión escritos, el equipo no puede avanzar sin ti ni aunque quiera.",
      },
      {
        id: "q5b",
        label: "Saber qué está en riesgo antes de que explote.",
        scores: { visibilidad: 1 },
        finding:
          "Tu prioridad es la anticipación: necesitas una lectura del estado de la operación que no dependa de que alguien te avise.",
      },
      {
        id: "q5c",
        label: "Que cada cliente reciba lo mismo, sin importar quién lo lleve.",
        scores: { consistencia: 1 },
        finding:
          "Tu prioridad es la consistencia de entrega: el estándar todavía vive en las personas correctas, no en el sistema que las guía.",
      },
      {
        id: "q5d",
        label: "Dejar de apagar incendios y poder empujar el crecimiento.",
        scores: { procesos: 1, capacidad: 1 },
        finding:
          "Tu prioridad es recuperar tracción: hoy el tiempo directivo se gasta en sostener el presente en vez de construir el siguiente.",
      },
    ],
  },
};

// La respuesta de q5 define el cierre de la lectura. Se resuelve aca aparte
// para que AuditOption no crezca con un campo que usa una sola pregunta.
export const Q5_FOCUS: Record<string, string> = {
  q5a: "delegacion",
  q5b: "visibilidad",
  q5c: "consistencia",
  q5d: "capacidad",
};

export type Answers = Record<string, string>; // questionId -> optionId

export function optionOf(questionId: string, optionId: string): AuditOption | undefined {
  return QUESTIONS[questionId]?.options.find((o) => o.id === optionId);
}

/** Motor de ramas: la respuesta elige la proxima pregunta del mismo paso. */
export function nextQuestionId(currentId: string, option: AuditOption): string | null {
  if (option.next) return option.next;
  const i = ORDER.indexOf(currentId);
  // despues de q1 (sin next) no deberia llegar nunca: ambas opciones fijan rama
  for (let k = i + 1; k < ORDER.length; k++) {
    if (QUESTIONS[ORDER[k]].step > QUESTIONS[currentId].step) return ORDER[k];
  }
  return null;
}

export function isLastQuestion(id: string): boolean {
  return QUESTIONS[id]?.step >= TOTAL_STEPS;
}

export type ScoredAnswers = { questionId: string; optionId: string; option: AuditOption }[];

export function collect(answers: Answers): ScoredAnswers {
  const out: ScoredAnswers = [];
  for (const [questionId, optionId] of Object.entries(answers)) {
    const option = optionOf(questionId, optionId);
    if (option) out.push({ questionId, optionId, option });
  }
  return out;
}

/**
 * Presion que anula una dimension. Con 5 preguntas y scores 0-4, un perfil
 * muy castigado suma ~10 en un eje; 8 es el punto donde la salud se agota.
 * Se calibra aca y en un solo lugar para que el 0-20 sea comparable entre
 * protocolos (KIP-001 usa la misma escala).
 */
const RAW_FOR_ZERO = 8;

/** Cada dimension 0-20, en SALUD: 20 = gobernado, 0 = no existe. */
export function scoreAxes(answers: Answers): Record<Axis, number> {
  const acc: Record<Axis, number> = {
    dependencia: 0,
    procesos: 0,
    visibilidad: 0,
    consistencia: 0,
    capacidad: 0,
  };
  for (const { option } of collect(answers)) {
    for (const [axis, value] of Object.entries(option.scores)) {
      acc[axis as Axis] += value ?? 0;
    }
  }
  const out = {} as Record<Axis, number>;
  for (const axis of AXES) {
    const pressure = Math.min(1, acc[axis.id] / RAW_FOR_ZERO);
    out[axis.id] = Math.round((1 - pressure) * AXIS_MAX);
  }
  return out;
}

/** Indice Kleos: la suma de las cinco dimensiones (0-100). engine.js:513. */
export function kleosIndexOf(axes: Record<Axis, number>): number {
  const sum = AXES.reduce((total, axis) => total + axes[axis.id], 0);
  return Math.max(0, Math.min(100, sum));
}

/**
 * Los cuatro niveles, con la misma forma que los de KIP-001 (engine.js:38-41):
 * NIVEL I abajo, NIVEL IV arriba, y el numero sube cuando la cosa mejora.
 */
export const LEVELS: { min: number; max: number; code: string; name: string }[] = [
  { min: 0, max: 34, code: "NIVEL I", name: "OPERACIÓN NO GOBERNADA" },
  { min: 35, max: 54, code: "NIVEL II", name: "OPERACIÓN SOSTENIDA A MANO" },
  { min: 55, max: 74, code: "NIVEL III", name: "OPERACIÓN EN PROCESO" },
  { min: 75, max: 100, code: "NIVEL IV", name: "OPERACIÓN CONSOLIDADA" },
];

export function levelOf(index: number) {
  return LEVELS.find((l) => index >= l.min && index <= l.max) ?? LEVELS[1];
}

export function dimensionsOf(axes: Record<Axis, number>): Dimension[] {
  return AXES.map((axis) => ({ key: axis.id, name: axis.label, score: axes[axis.id] }));
}

const HEADLINES: Record<Axis, string> = {
  dependencia: "Tu agencia sigue teniendo un solo cerebro: el tuyo.",
  procesos: "No te faltan personas: te sobran caminos distintos para hacer lo mismo.",
  visibilidad: "Hoy no puedes responder «¿en qué quedó esto?» sin preguntarle a alguien.",
  consistencia: "La calidad de lo que entregas depende de quién tome el cliente.",
  capacidad: "El equipo llegó al límite de su tolerancia al desorden, no de trabajo.",
};

// En el nivel mas alto el titular no alarma: confirma y cambia de tema.
const CALM_HEADLINE =
  "Tu operación tiene base. Lo que falta no es orden: es sostenerlo cuando el volumen suba.";

const CLOSES: Record<string, string> = {
  delegacion:
    "Empieza por lo estructural: definir qué puede decidirse sin ti y dejarlo escrito donde el equipo lo vea. Sin eso, ningún tablero te va a devolver las horas que estás perdiendo.",
  visibilidad:
    "Empieza por un solo lugar de verdad para el estado de cada cliente. No más herramientas: menos, y obedecidas.",
  consistencia:
    "Empieza por convertir tu criterio en estándar: definiciones de «terminado», plantillas y ejemplos de referencia dentro del sistema.",
  capacidad:
    "Empieza por sacarte del camino crítico. El plan de implementación necesita un dueño que no seas tú y una fecha, o vuelve a ser una intención.",
  base: "Empieza por gobernar lo que ya funciona con métricas, para que el crecimiento no lo rompa.",
};

export interface Dimension {
  key: Axis;
  name: string;
  score: number;
}

export interface Reading {
  headline: string;
  findings: { axis: Axis; label: string; text: string; score: number }[];
  dimensions: Dimension[];
  index: number;
  level: { code: string; name: string };
  close: string;
}

const axisLabel = (id: Axis) => AXES.find((a) => a.id === id)!.label;

/** Presion total de una opcion: sirve para ordenar que hallazgos se muestran. */
const weight = (o: AuditOption) => Object.values(o.scores).reduce((sum, v) => sum + (v ?? 0), 0);

export function buildReading(answers: Answers): Reading {
  const axes = scoreAxes(answers);
  const dimensions = dimensionsOf(axes);
  const index = kleosIndexOf(axes);
  const level = levelOf(index);

  // El titular sale de la dimension MAS DEBIL, igual que buildWeakestFinding()
  // en KIP-001; en NIVEL IV la lectura no acusa, acompaña.
  const weakest = dimensions.reduce((low, d) => (d.score < low.score ? d : low), dimensions[0]);
  const headline = level.code === "NIVEL IV" ? CALM_HEADLINE : HEADLINES[weakest.key];

  // Hallazgos: las 3 respuestas que mas presion sumaron, en su orden real.
  const findings = collect(answers)
    .slice()
    .sort((a, b) => weight(b.option) - weight(a.option))
    .slice(0, 3)
    .filter((f) => weight(f.option) > 0)
    .map((f) => {
      const axis =
        (Object.entries(f.option.scores).sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0))[0]?.[0] as Axis) ??
        "procesos";
      return { axis, label: axisLabel(axis), text: f.option.finding, score: axes[axis] };
    });

  const focus = Q5_FOCUS[answers.q5] ?? "base";
  return { headline, findings, dimensions, index, level, close: CLOSES[focus] ?? CLOSES.base };
}

// ── Costura con el backend ──────────────────────────────────────
// El payload ya esta armado y es lo que se mandaria a /api/audit. Mientras
// AUDIT_ENDPOINT sea null no sale nada del navegador: la lectura se calcula
// aca y los únicos datos que existen son clicks, sin nombre ni mail.
export const AUDIT_ENDPOINT: string | null = null;

/**
 * Los campos estan nombrados como los de capture.js (respuestas, dimensions
 * con score 0-20, kleosIndex, mainDiagnosis, priorityNumberOne,
 * insightDetected) para que el dia de manana el sitio pueda escribir en tu
 * KV sin traducir nada. Hoy no se envia: AUDIT_ENDPOINT es null.
 */
export interface AuditPayload {
  protocol: string;
  version: string;
  startedAt: number;
  durationMs: number;
  respuestas: Answers;
  entradas: { question: string; option: string; scores: Partial<Record<Axis, number>> }[];
  /** la forma exacta que valida capture.js: { name, score 0-20 } */
  dimensions: { name: string; score: number }[];
  kleosIndex: number;
  level: string;
  mainDiagnosis: string;
  priorityNumberOne: string;
  insightDetected: string;
}

export function buildPayload(answers: Answers, startedAt: number): AuditPayload {
  const axes = scoreAxes(answers);
  const index = kleosIndexOf(axes);
  const reading = buildReading(answers);
  return {
    protocol: AUDIT_PROTOCOL,
    version: AUDIT_VERSION,
    startedAt,
    durationMs: Date.now() - startedAt,
    respuestas: answers,
    entradas: collect(answers).map((a) => ({
      question: a.questionId,
      option: a.optionId,
      scores: a.option.scores,
    })),
    dimensions: dimensionsOf(axes).map((d) => ({ name: d.name, score: d.score })),
    kleosIndex: index,
    level: `${reading.level.code} — ${reading.level.name}`,
    mainDiagnosis: reading.headline,
    priorityNumberOne: reading.close,
    insightDetected: reading.findings[0]?.text ?? "",
  };
}

export async function submitAudit(payload: AuditPayload): Promise<{ sent: boolean }> {
  if (!AUDIT_ENDPOINT) return { sent: false };
  const res = await fetch(AUDIT_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return { sent: res.ok };
}