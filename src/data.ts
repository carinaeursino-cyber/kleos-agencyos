import {
  Symptom,
  Pillar,
  ConsultingService,
  AosLayer,
  ControlDashboard,
  OnboardingDay,
  AutomationItem,
  FitItem,
  FaqItem,
} from "./types";

// ─────────────────────────────────────────────────────────────────
// KLEOS AGENCY OS — Copy optimizado
// Regla: dolor del cliente → consecuencia → resultado → solución.
// Vender el resultado antes que el método.
// ─────────────────────────────────────────────────────────────────

// ── El problema: síntomas que un Founder reconoce ──
export const symptoms: Symptom[] = [
  { id: "01", text: "Las tareas se asignan por chat y nadie sabe quién es responsable." },
  { id: "02", text: "Todo pasa por ti: decisiones, aprobaciones, destrabes." },
  { id: "03", text: "El equipo pregunta qué hacer porque las prioridades no están claras." },
  { id: "04", text: "La información está repartida entre WhatsApp, mails y documentos." },
  { id: "05", text: "Las piezas se rehacen dos o tres veces por briefs incompletos o revisiones sin límite." },
  { id: "06", text: "Cada cliente nuevo arranca de cero, sin un proceso definido." },
  { id: "07", text: "Tu equipo trabaja, pero tú no tienes visibilidad real de la operación." },
];

// ── Las cuatro brechas ──
// ── La solución: lo que cambia en el día a día ──
export const pillars: Pillar[] = [
  {
    id: "01",
    title: "Más claridad",
    description: "Cada persona sabe qué hacer, cuándo y con qué prioridad.",
  },
  {
    id: "02",
    title: "Más control",
    description: "Ves el estado de todo sin perseguir a tu equipo.",
  },
  {
    id: "03",
    title: "Menos dependencia",
    description: "Los procesos no viven en la cabeza de una sola persona.",
  },
];

// ── Implementación: cuatro frentes ──
export const consultingServices: ConsultingService[] = [
  {
    id: "01",
    title: "Diagnóstico operativo",
    intro: "Entendemos cómo trabaja hoy tu agencia:",
    bullets: [
      "Cómo entran los clientes.",
      "Cómo se asignan las tareas.",
      "Dónde se traban los proyectos.",
      "Qué decisiones siguen dependiendo de ti.",
    ],
    result: "Un mapa claro de tus fricciones y por dónde empezar.",
  },
  {
    id: "02",
    title: "Diseño del sistema",
    intro: "Diseñamos el sistema alrededor de tu operación:",
    bullets: [
      "Roles y responsables.",
      "Flujos de trabajo.",
      "Procesos documentados.",
      "Indicadores que importan.",
    ],
    result: "Una forma de trabajar clara y compartida por todo el equipo.",
  },
  {
    id: "03",
    title: "Implementación en ClickUp",
    intro: "Lo armamos en ClickUp, listo para usar:",
    bullets: [
      "Espacios y plantillas de proyectos.",
      "Tareas, checklists y dependencias.",
      "Vistas por rol.",
      "Dashboards para ti y tu equipo.",
      "Automatizaciones.",
    ],
    result: "ClickUp es la herramienta. El sistema operativo es el activo.",
  },
  {
    id: "04",
    title: "Adopción del equipo",
    intro: "Tu equipo queda entrenado y operando:",
    bullets: [
      "Guías de uso.",
      "Capacitación.",
      "Reglas operativas.",
      "Acompañamiento inicial.",
    ],
    result: "No entregamos un tablero y desaparecemos. Te dejamos operando.",
  },
];

// ── Agency Operating System ──
export const aosLayers: AosLayer[] = [
  {
    id: "01",
    title: "Company HQ",
    description: "La dirección del negocio.",
    items: [
      "Fundamentos y objetivos.",
      "Roles y responsabilidades.",
      "SOPs y conocimiento.",
      "Reportes y performance.",
    ],
  },
  {
    id: "02",
    title: "Internal Operations",
    description: "La gestión interna.",
    items: [
      "Planificación y prioridades.",
      "Gestión de proyectos.",
      "Coordinación del equipo.",
      "Calidad e incidencias.",
      "Capacidad y reportes.",
    ],
  },
  {
    id: "03",
    title: "Client Operations",
    description: "La operación con clientes.",
    items: [
      "Venta y alta de clientes.",
      "Estrategia y producción.",
      "Lanzamiento de campañas.",
      "Gestión y cierre.",
    ],
  },
];

export const controlDashboards: ControlDashboard[] = [
  {
    id: "01",
    title: "Dashboard ejecutivo",
    metrics: [
      "Salud de proyectos.",
      "Carga de trabajo por rol.",
      "Entregables críticos.",
      "Tareas atrasadas.",
      "Proyectos frenados.",
    ],
  },
  {
    id: "02",
    title: "Dashboard operativo",
    metrics: [
      "Tareas sin asignar.",
      "Bloqueos y urgencias.",
      "Capacidad del equipo.",
      "Avance de producción.",
    ],
  },
];

// ── El onboarding de tus clientes ──
export const onboardingDays: OnboardingDay[] = [
  {
    id: "01",
    day: "Día 1",
    title: "Accesos e información base",
    items: [
      "Datos del cliente y accesos.",
      "Herramientas y canales.",
      "Materiales del negocio.",
    ],
  },
  {
    id: "02",
    day: "Día 2",
    title: "Oferta y cliente ideal",
    items: [
      "Oferta y precios.",
      "Promesas y garantías.",
      "Cliente ideal y objeciones.",
    ],
  },
  {
    id: "03",
    day: "Día 3",
    title: "Marca y operación",
    items: [
      "Historia y autoridad.",
      "Marca y tono.",
      "Equipo y objetivos.",
    ],
  },
];

// ── Automatización y control ──
export const automations: AutomationItem[] = [
  { id: "01", text: "Asignación de tareas según rol." },
  { id: "02", text: "Fechas límite aplicadas solas." },
  { id: "03", text: "Alertas por aprobaciones pendientes." },
  { id: "04", text: "Priorización de tareas urgentes." },
  { id: "05", text: "Tareas recurrentes." },
  { id: "06", text: "Notificaciones internas." },
];

// ── Cómo trabajamos ──
// ── Para quién es / no es ──
export const fitYes: FitItem[] = [
  { id: "01", text: "Tienes clientes activos y un equipo, interno o externo." },
  { id: "02", text: "Tu agencia creció y la operación quedó atrás." },
  { id: "03", text: "Tú concentras demasiadas decisiones." },
  { id: "04", text: "Quieres trabajar con más previsibilidad." },
  { id: "05", text: "Buscas implementar, no solo recibir consejos." },
  { id: "06", text: "Quieres que tu equipo deje de depender de instrucciones constantes." },
];

export const fitNo: FitItem[] = [
  { id: "01", text: "Buscas una plantilla sin adaptar a tu agencia." },
  { id: "02", text: "No quieres documentar tu forma de trabajar." },
  { id: "03", text: "Tu equipo no está dispuesto a usar un sistema común." },
  { id: "04", text: "Todavía no tienes un servicio definido." },
];

// ── Sobre Carina ──
export const aboutFocus: string[] = [
  "Gestión de proyectos.",
  "Diseño de procesos.",
  "Coordinación de equipos.",
  "Transformación digital.",
  "Mejora continua.",
];

// ── Diferenciador ──
// ── FAQ: reducción de objeciones ──
export const faqItems: FaqItem[] = [
  {
    id: "01",
    question: "¿Esto es solo una configuración de ClickUp?",
    answer:
      "No. Agency OS es un sistema operativo diseñado alrededor de tu agencia: procesos, roles y responsabilidades. ClickUp es la herramienta donde se implementa.",
  },
  {
    id: "02",
    question: "¿Van a adaptar el sistema a nuestra agencia?",
    answer:
      "Sí. No entregamos plantillas genéricas. El sistema se diseña sobre tus procesos, tu equipo y tus servicios.",
  },
  {
    id: "03",
    question: "¿Esto reemplaza a un Project Manager?",
    answer:
      "No. Agency OS estructura la operación y reduce el caos, pero no sustituye el criterio y el liderazgo de una persona. Es ideal si tu agencia todavía no está lista para contratar un PM full-time, o si quieres ordenar tu operación antes de hacerlo.",
  },
  {
    id: "04",
    question: "¿Cuánto tiempo lleva implementar Agency OS?",
    answer:
      "Depende del tamaño de tu agencia y la complejidad de tus servicios. Después del diagnóstico definimos juntos un alcance y un cronograma realista.",
  },
  {
    id: "05",
    question: "¿Qué ocurre después de la implementación?",
    answer:
      "Te dejamos el sistema operando, con tu equipo capacitado y guías de uso. Si quieres gestión continua o PMO externa, se cotiza por separado.",
  },
];

// ── CTA final: lo que necesitas saber ──
export const ctaFinalItems: string[] = [
  "Qué está pasando.",
  "Quién es responsable.",
  "Qué está bloqueado.",
  "Qué debe ocurrir después.",
  "Qué necesita tu intervención.",
  "Qué puede resolver el sistema sin ti.",
];
