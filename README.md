<div align="center">

# KLEOS — AGENCY OS

**Agency OS: el sistema operativo que instala orden en tu agencia. Procesos, responsabilidades y prioridades claras.**

Landing premium con la misma base visual de KLEOS Digital Studio (estética oscuro + dorado, animaciones cinematográficas con GSAP, scroll suave con Lenis, menú morphing y cursor personalizado).

</div>

---

## 🧭 El sitio

| Sección | Contenido |
|---|---|
| **Hero** | Intro cinematográfica (espiral dorada → lambda láser) + titular y CTA principal |
| **El problema** | Tesis + 8 síntomas de una operación que quedó atrás del crecimiento |
| **Las cuatro brechas** | Tarjetas apiladas con pin de scroll: conversaciones, onboarding, avance, fundador |
| **Propuesta de valor** | Claridad · Control · Continuidad |
| **Qué hacemos** | Diagnóstico → Diseño del sistema → Implementación en ClickUp → Adopción |
| **Agency Operating System** | Company HQ, Internal & Client Operations, dashboards, onboarding centralizado |
| **Onboarding de clientes** | Flujo de los primeros 3 días |
| **Automatización y control** | 9 automatizaciones posibles |
| **Cómo trabajamos** | 5 fases: Diagnóstico → Diseño → Configuración → Capacitación → Ajuste |
| **Para quién es / no es** | Criterios claros de fit |
| **Sobre Carina** | Bio profesional de Carina Ursino (con foto: ver abajo) |
| **Diferenciador** | "Primero la operación. Después la herramienta." |
| **CTA + FAQ + Contacto** | Conversión con 2 banners de CTA y formulario vía Formspree |

## 🛠 Tecnología

- **React 19 + TypeScript + Vite 6 + Tailwind CSS 4**
- **Animaciones:** GSAP + ScrollTrigger, Motion (framer), Lenis (smooth scroll)
- **Servidor:** Express (dev + producción), SPA routing
- **Formulario:** Formspree → los mensajes llegan a `carina@carinaursino.com`

## 🚀 Correr localmente

**Requisitos:** Node.js

```bash
npm install
npm run dev
```

Abrí `http://localhost:3000`.

### Build de producción

```bash
npm run build
npm start
```

## ☁️ Deploy en Vercel (igual que KLEOS Studio)

El proyecto ya incluye `vercel.json` listo para desplegar:

1. Entrá a [vercel.com](https://vercel.com) → **Add New → Project**
2. Importá el repositorio de GitHub (`kleos-consultoria`)
3. Vercel detecta el framework automáticamente — no hace falta tocar nada
4. **Deploy** → en ~1 minuto tenés la URL pública

Para actualizar el sitio después: solo `git push` y Vercel redeploya solo.

## 📁 Estructura

```
src/
├── App.tsx                  # Composición de la página + rails + menú
├── data.ts                  # TODO el copy del sitio (fuente única de contenido)
├── types.ts                 # Tipos de contenido
├── components/
│   ├── hero/                # ConsultingHero + GoldenSpiral (intro cinematográfica)
│   ├── ProblemSection.tsx   # El problema
│   ├── BreachesSection.tsx  # Las cuatro brechas
│   ├── ValueSection.tsx     # Propuesta de valor
│   ├── ServicesSection.tsx  # Qué hacemos
│   ├── AosSection.tsx       # Agency Operating System
│   ├── OnboardingSection.tsx# Onboarding de clientes
│   ├── AutomationSection.tsx# Automatización y control
│   ├── ProcessSection.tsx   # Cómo trabajamos
│   ├── FitSection.tsx       # Para quién es / no es
│   ├── AboutSection.tsx     # Sobre Carina
│   ├── DifferentiatorSection.tsx
│   ├── CtaBanner.tsx        # CTAs reutilizables
│   └── FaqSection.tsx       # FAQ acordeón
└── pages/ContactPage.tsx    # Formulario de contacto
```

## 📷 Foto de Carina

La sección **Sobre Carina** detecta automáticamente la foto `src/assets/images/foto_carina_hero.png` (o `.jpg`).
Con el archivo presente muestra la foto en recorte circular; sin él, muestra el monograma "C".
Basta con soltar la imagen en esa carpeta y re-buildear.

## ✏️ Editar el contenido

Todo el copy vive en **`src/data.ts`**. Para cambiar textos de cualquier sección, editas ese archivo y listo — no hace falta tocar los componentes.

---

© 2026 KLEOS Agency OS · Sistema operativo para agencias
