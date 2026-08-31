import {
  Stat,
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

// ── La franja de credibilidad (StatsSection) ──
// Entra en la pagina entre los sintomas y la solucion. El numero que se anima
// vive en `from`/`to`; el prefijo y el sufijo son texto fijo, asi que la raya EN
// de "5–" y los "+" nunca los toca el conteo.
// `to` es ademas lo que se pinta antes de que la franja entre en viewport: sin JS
// o con "prefers-reduced-motion" la banda se lee completa.
export const stats: Stat[] = [
  { id: "01", prefix: "", from: 0, to: 7, suffix: "+", label: "Agencias operadas desde adentro." },
  { id: "02", prefix: "", from: 0, to: 70, suffix: "+", label: "Flujos operativos mapeados." },
  { id: "03", prefix: "", from: 0, to: 400, suffix: "+", label: "Patrones de ejecución analizados." },
  { id: "04", prefix: "5–", from: 5, to: 50, suffix: "", label: "Personas por equipo. El mismo patrón operativo en todas." },
];

// ── El problema: síntomas que un Founder reconoce ──
// Son 6. Estaban estas dos y se sacaron a pedido (2026-08-29), por si vuelven:
//   "El equipo pregunta qué hacer porque las prioridades no están claras."
//   "Tu equipo trabaja, pero tú no tienes visibilidad real de la operación."
// El id se renumeró a 01-06 para que quede contiguo: solo es la key de React, en
// la tarjeta se pinta un casillero vacío, no el numero.
export const symptoms: Symptom[] = [
  { id: "01", text: "Las tareas se asignan por chat y nadie sabe quién es responsable." },
  { id: "02", text: "Todo pasa por ti: decisiones, aprobaciones, destrabes." },
  { id: "03", text: "La información está repartida entre WhatsApp, mails y documentos." },
  { id: "04", text: "Las piezas se rehacen dos o tres veces por briefs incompletos o revisiones sin límite." },
  { id: "05", text: "Cada cliente nuevo arranca de cero, sin un proceso definido." },
  { id: "06", text: "Cada cliente o persona nueva que sumas multiplica el caos en vez de repartir el trabajo." },
];

// ── La solución: las 3 tarjetas de ValueSection ──
// Titulos reescalados a afirmacion (2026-08-29): "Mas X" comparaba, ahora se
// afirma. Las descripciones no se tocaron: son la parte creible del bloque.
// (El label que corona la seccion vive en ValueSection.tsx, no aca.)
export const pillars: Pillar[] = [
  {
    id: "01",
    title: "Claridad total",
    description: "Cada persona sabe qué hacer, cuándo y con qué prioridad.",
  },
  {
    id: "02",
    title: "Control real",
    description: "Ves el estado de todo sin perseguir a tu equipo.",
  },
  {
    id: "03",
    title: "Cero dependencia",
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
    title: "Centro de Mando",
    description:
      "Donde se toman las decisiones estratégicas. Visión, métricas y objetivos en un solo lugar.",
    items: [
      "Fundamentos y objetivos.",
      "Roles y responsabilidades.",
      "SOPs y conocimiento.",
      "Reportes y performance.",
    ],
  },
  {
    id: "02",
    title: "Motor Operativo",
    description:
      "Donde tu equipo ejecuta sin perseguir. Tareas, procesos y responsabilidades claras.",
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
    title: "Gestión de Clientes",
    description:
      "Donde el cliente vive sin caos. Onboarding, entregas y comunicación centralizada.",
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
    // 4 filas, igual que la tarjeta operativa: asi las dos listas cierran al
    // mismo alto (antes eran 5 y 4 y el borde inferior no coincidía).
    metrics: [
      "Estado real de los proyectos (sin tener que preguntar).",
      "Carga de trabajo y saturación por rol.",
      "Entregables críticos en riesgo.",
      "Proyectos frenados antes de que exploten.",
    ],
  },
  {
    id: "02",
    title: "Dashboard operativo",
    metrics: [
      "Tareas bloqueadas y urgencias del día.",
      "Capacidad real del equipo (sin adivinar).",
      "Avance de producción en tiempo real.",
      "Cero tareas huérfanas (todo tiene dueño).",
    ],
  },
];

// ── El onboarding de tus clientes ──
export const onboardingDays: OnboardingDay[] = [
  {
    id: "01",
    day: "Día 1",
    title: "Accesos e información base",
    description:
      "Recopilamos todo lo necesario sin perseguir al cliente: credenciales, contactos clave y documentación inicial. Todo centralizado desde el minuto uno.",
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
    description:
      "Definimos el scope exacto, los entregables y el perfil del cliente final. Sin ambigüedades. Sin suposiciones.",
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
    description:
      "Establecemos los flujos de trabajo, las reglas de comunicación y el kickoff con el equipo. El cliente sabe exactamente qué va a pasar y cuándo.",
    items: [
      "Historia y autoridad.",
      "Marca y tono.",
      "Equipo y objetivos.",
    ],
  },
];

// ── Automatización y control ──
export const automations: AutomationItem[] = [
  { id: "01", text: "Tareas que se asignan solas según el rol." },
  { id: "02", text: "Plazos y dependencias que se calculan automáticamente." },
  { id: "03", text: "Alertas instantáneas cuando una aprobación se frena." },
  { id: "04", text: "Lo urgente salta a la vista de inmediato." },
  { id: "05", text: "Procesos recurrentes que se disparan sin que nadie lo pida." },
  { id: "06", text: "Notificaciones que avisan lo importante, sin saturar el chat." },
];

// ── Cómo trabajamos ──
// ── Para quién es / no es ──
export const fitYes: FitItem[] = [
  { id: "01", text: "Tienen clientes activos y un equipo, interno o externo." },
  { id: "02", text: "Crecieron rápido y la operación quedó atrás." },
  { id: "03", text: "Concentran demasiadas decisiones en una sola persona." },
  { id: "04", text: "Buscan dejar de apagar incendios y empezar a prevenirlos." },
  { id: "05", text: "Quieren implementar un sistema, no solo recibir consejos." },
  { id: "06", text: "Necesitan que el equipo sepa qué hacer sin que nadie se lo diga." },
];

export const fitNo: FitItem[] = [
  { id: "01", text: "Buscan una plantilla genérica sin adaptar a su operación." },
  { id: "02", text: "No quieren documentar su forma de trabajar." },
  { id: "03", text: "Creen que el caos es parte de la creatividad." },
  { id: "04", text: "Todavía no tienen un servicio definido." },
];

// ── Sobre Carina ──
// Son 6 a proposito: AboutSection los pinta en grid-cols-1 sm:grid-cols-2,
// asi que con 5 el ultimo chip quedaba solo y hueco en la tercera fila.
// El nombre del array sigue siendo `aboutFocus` (lo importa AboutSection por
// ese nombre) pero el contenido ya no son habilidades: son los 6 beneficios
// que pinta debajo de la etiqueta "Lo que obtienes al trabajar conmigo:".
export const aboutFocus: string[] = [
  "Procesos que se ejecutan sin que tengas que recordarlos.",
  "Un sistema que escala contigo, no contra ti.",
  "Equipos que saben qué hacer sin que se lo digas.",
  "Visibilidad real de tu operación, no suposiciones.",
  "Menos tiempo apagando incendios, más tiempo creciendo.",
  "Una operación que funciona incluso cuando tú no estás.",
];

// ── Diferenciador ──
// ── FAQ: reducción de objeciones ──
export const faqItems: FaqItem[] = [
  {
    id: "01",
    question: "¿Esto es solo una configuración de ClickUp?",
    answer:
      "No. ClickUp es la herramienta. Agency OS es la arquitectura operativa que se construye sobre ella. La diferencia es la misma que hay entre comprar un Ferrari y saber conducir en una Fórmula 1. El motor es el mismo, pero el sistema, la estrategia y la forma de usarlo son lo que realmente transforma tu operación. Nosotros no te entregamos un tablero bonito: te entregamos un sistema que tu equipo puede ejecutar sin que tú tengas que recordárselo.",
  },
  {
    id: "02",
    question: "¿Van a adaptar el sistema a nuestra agencia?",
    answer:
      "Sí. 100%. No existe una plantilla genérica que funcione para todas las agencias. Antes de tocar una sola herramienta, hacemos un diagnóstico operativo profundo de cómo trabaja tu equipo hoy: cómo entran los clientes, cómo se asignan las tareas, dónde se pierde tiempo y dónde se rompen los procesos. Sobre ese mapa real construimos tu Agency OS. Por eso no vendemos plantillas: vendemos arquitectura a medida.",
  },
  {
    id: "03",
    question: "¿Esto reemplaza a un Project Manager?",
    answer:
      "No. Lo potencia. Agency OS no sustituye a las personas. Elimina las tareas repetitivas, las asignaciones manuales y el seguimiento constante que consumen el tiempo de tu PM. Así, tu Project Manager deja de ser un 'perseguidor de tareas' y se convierte en lo que debería ser: un gestor estratégico que asegura que los proyectos se entreguen bien y a tiempo. Menos ruido operativo, más criterio humano.",
  },
  {
    id: "04",
    question: "¿Cuánto tiempo lleva implementar Agency OS?",
    answer:
      "Entre 4 y 6 semanas, dependiendo de la complejidad de tu operación y el tamaño de tu equipo. No es un proyecto de meses que paraliza tu agencia. Es un proceso estructurado en 4 fases (diagnóstico, diseño, implementación y adopción) donde tu equipo sigue operando mientras construimos el sistema. Al final de ese periodo, tu agencia tiene una forma de trabajar clara, documentada y funcionando.",
  },
  {
    id: "05",
    question: "¿Qué ocurre después de la implementación?",
    answer:
      "Te dejamos operando, no abandonados. La implementación incluye capacitación completa para tu equipo, guías de uso y un acompañamiento inicial para asegurar la adopción real del sistema. Una vez que el sistema está rodando, tú tienes el control total: puedes escalar, ajustar y crecer sin depender de nosotros. Si en el futuro necesitas ajustar algo por crecimiento o cambios en tu operación, podemos seguir acompañándote, pero el objetivo es que el sistema sea tuyo y funcione con o sin nosotros.",
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