// ─────────────────────────────────────────────────────────────────
// El destino de conversión del sitio: la agenda de Carina en Cal.com.
//
// Vive aca una sola vez porque lo consumen dos lugares que no pueden
// desincronizarse nunca:
//   - el CTA del header fixed (src/components/KleosMenu.tsx)
//   - los tres botones de la landing /vsl (src/pages/VslPage.tsx)
// Cambiar la URL aca alcanza para los dos.
//
// Ojo con la coherencia copy/enlace: el evento publicado se llama
// "Diagnóstico Operativo" y dura 30 min (verificado el 2026-08-28 en la
// propia pagina de Cal.com). Cualquier etiqueta que diga "Auditoría" o
// "15 min" esta prometiendo otra cosa que lo que se agenda.
// ─────────────────────────────────────────────────────────────────
export const BOOKING_URL =
  "https://cal.com/carina-ursino/sesion-diagnostico";