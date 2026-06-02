# WAM AI Studio — Presentación CEO: Diseño

**Fecha:** 2026-05-27  
**Autor:** Enric  
**Archivo de salida:** `index.html`

---

## Contexto

Presentación web horizontal para el CEO de WAM Global (Luis) proponiendo la creación del WAM AI Studio como nueva unidad de negocio. El formato web en sí mismo es parte del mensaje: demuestra el cambio de paradigma en la forma de trabajar.

El contenido está en `content.md` (15 slides). Los bloques "Por qué esta slide así" son notas editoriales internas — no se incluyen en la presentación.

---

## Arquitectura

- **Formato:** Un único archivo `index.html`, autocontenido, sin dependencias de servidor.
- **Motor de slides:** `position:absolute` + GSAP `xPercent` para transiciones horizontales.
- **Librerías:** GSAP 3 vía CDN (`cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js`).
- **Tipografía:** `@font-face` apuntando a `fonts/` (TiemposFine para títulos, Inter para cuerpo). Fallback: Georgia + system-ui.
- **Navegación:** Teclado (←→ / Espacio), clic (mitad izquierda/derecha de pantalla), swipe táctil.
- **Progress indicator:** Dots clicables en la parte inferior.
- **Total slides:** 16 (15 de contenido + 1 closing).

---

## Variables de diseño

```css
--bg:             #080808;
--text:           #ffffff;
--text-muted:     #555555;
--text-dim:       #333333;
--accent:         #FF7EFF;
--accent-glow:    rgba(255, 126, 255, 0.15);
--surface:        rgba(255, 255, 255, 0.03);
--surface-border: rgba(255, 255, 255, 0.07);
--font-title:     'TiemposFine', Georgia, serif;
--font-body:      'Inter', system-ui, sans-serif;
--slide-pad-x:    72px;
--slide-pad-y:    52px;
```

---

## Inventario de slides y layouts

| # | Título | Layout | Notas |
|---|---|---|---|
| 01 | Portada | Cover especial | Breathing en título y glow |
| 02 | La apertura | Texto + 3 líneas escalonadas | accent-line para las 3 frases |
| 03 | La amenaza | Two-col especial | Cifra 40-60% destacada en magenta inline |
| 04 | La oportunidad | cards-3 | Quote de cierre con accent-line |
| 05 | La respuesta | Texto + cards-3 | Cuerpo intro + tres pruebas |
| 06 | El Studio | cards-3 | Pie de slide destacado |
| 07 | Lo que ya existe | Two-col | Descripción + bullets de cambio + quote |
| 08 | El primer producto | cards-3 | Tres bloques: qué / para quién / por qué |
| 09 | Unit economics | Especial animado | Contadores, embudo, tabla por escenarios |
| 10 | El equipo | Two-col | Núcleo + Consejo + quote |
| 11 | GTM | Texto + cards-3 | Insight + posicionamiento + pruebas |
| 12 | Las fases | Timeline especial | Línea que se dibuja + 3 hitos |
| 13 | El presupuesto | cards-4 (2×2) | 4 partidas con % destacado + quote |
| 14 | Lo que pido hoy | setup-steps numerados | 3 decisiones + pie grande |
| 15 | Cierre | Closing especial | "Hablemos." centrado, glow inferior |

---

## Sistema de componentes (slides estándar)

### `cards-3` / `cards-4`
Grid de cards con fondo surface, borde surface-border, hover `translateY(-3px)` + borde magenta. Estructura: eyebrow (uppercase, magenta) + title + body.

### `two-col`
Grid 1fr 1fr. Cada columna es un `col-block` con título y lista de bullets con guión magenta.

### `accent-line`
Cita destacada. Font TiemposFine italic, color magenta, borde izquierdo magenta 2px.

### `setup-steps`
Pasos numerados. Número en TiemposFine italic 32px magenta. Título + cuerpo en Inter.

### `section-tag`
Kicker de slide. 10px, uppercase, letter-spacing 3px, magenta, con línea horizontal de 24px antes del texto.

---

## Diseño de los 4 slides especiales

### Slide 01 — Portada
- Título: `clamp(52px, 8vw, 96px)`, TiemposFine, `"ingresos"` en magenta italic.
- Glow radial: posicionado detrás del bloque de título (no en esquina), radio más amplio.
- Breathing: `scale 1→1.018` en título y glow, 3.2s yoyo loop.
- Kicker con línea acento. Meta pie con fecha y "Confidencial".

### Slide 03 — La amenaza
- Two-col estándar.
- En el bloque izquierdo, la cifra `40-60%` aparece como `<span>` con color magenta dentro del texto corrido (no como card separada).
- Quote de cierre a ancho completo en `accent-line`.

### Slide 09 — Unit economics
Tres filas reveladas con stagger al entrar:
1. **Métricas clave** (3 cards pequeñas): `15.000 €` / `~53% margen` / `~7.000 € coste`. Números animados con CountUp nativo (sin librería extra): `0 → valor` en 0.8s `power2.out`, se dispara cuando el slide entra.
2. **Embudo**: `Assessment (15K) → Proyecto derivado (~100K)` con flecha visual y tasas de conversión.
3. **Tabla de escenarios**: 2 columnas (Conservador / Objetivo), 4 filas (Facturación directa / Proyectos derivados / Total / Margen). Aparece columna a columna con stagger 0.15s. Fila "Total facturación" con texto en magenta.
4. Quote de cierre en `accent-line` a ancho completo.

### Slide 12 — Las fases
- Tres bloques `Mes 3` / `Mes 6` / `Mes 12` en horizontal.
- Línea horizontal que los conecta: se dibuja de izquierda a derecha al entrar (`scaleX 0→1`, 0.6s `power2.inOut`, `transformOrigin: left`).
- Cada bloque aparece después del segmento de línea que lo precede (stagger encadenado).
- Contenido de cada hito: título de mes + 3-4 bullets + label de tipo de decisión.

---

## Especificación de animaciones

| Tipo | Mecánica | Timing |
|---|---|---|
| Transición entre slides | `xPercent` horizontal | 0.5s `power2.inOut` |
| Entrada de elementos | Stagger `opacity 0→1` via `data-a` | 0.4s, stagger 0.1s por elemento |
| Hover en cards | `translateY(-3px)` + border magenta | 0.2s CSS |
| Portada breathing | `scale 1→1.018` en título y glow | 3.2s yoyo loop |
| Contadores (slide 09) | `0 → valor` al entrar el slide | 0.8s `power2.out` |
| Línea de fases (slide 12) | `scaleX 0→1` | 0.6s `power2.inOut` |
| Tabla escenarios (slide 09) | Stagger por columna | 0.15s por columna |

**Principio rector:** la animación confirma el contenido, no compite con él.

---

## Fuentes — nota de implementación

Los archivos de fuente no están en el proyecto. La presentación referenciará `fonts/TiemposFine-*.woff2` e `fonts/Inter-*.woff2` (misma estructura que la presentación de Connect). Mientras no estén, los títulos cargarán en Georgia y el cuerpo en system-ui.
