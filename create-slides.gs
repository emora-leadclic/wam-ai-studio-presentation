/**
 * WAM Studio de Innovación — Google Slides Generator
 *
 * Instrucciones:
 *   1. Ve a script.google.com y crea un nuevo proyecto en blanco
 *   2. Reemplaza todo el contenido con este script
 *   3. Ejecuta la función createPresentation()
 *   4. Autoriza los permisos que solicite Google
 *   5. La presentación aparecerá en tu Google Drive
 *
 * Notas:
 *   - El logo WAM (SVG) se sustituye por texto "WAM" en las portadas.
 *   - Las animaciones no se migran (por diseño).
 *   - Los tooltips de Slide 07 se integran como texto en el cuerpo de la tarjeta.
 */

function createPresentation() {

  // ── Paleta de color ─────────────────────────────────────────────────────────
  var BG          = '#080808';
  var WHITE       = '#FFFFFF';
  var ACCENT      = '#FF7EFF';
  var MUTED       = '#888888';
  var DIM         = '#505050';
  var CARD_BG     = '#111111';
  var CARD_BORDER = '#222222';

  // ── Geometría (puntos, slide 16:9) ──────────────────────────────────────────
  var W        = 720;
  var H        = 405;
  var PX       = 48;
  var PY       = 34;
  var CW       = W - PX * 2;          // 624 pt
  var FOOTER_Y = H - PY - 10;         // 361 pt

  // ── Crear presentación ──────────────────────────────────────────────────────
  var deck = SlidesApp.create('WAM Studio de Innovación — Propuesta');

  // ── Helpers ─────────────────────────────────────────────────────────────────

  function bgFill(slide) {
    slide.getBackground().setSolidFill(BG);
  }

  function newSlide() {
    return deck.appendSlide(SlidesApp.PredefinedLayout.BLANK);
  }

  /** Crea un text box transparente. */
  function box(slide, x, y, w, h) {
    var s = slide.insertTextBox('', x, y, w, h);
    s.getFill().setTransparent();
    s.getBorder().setTransparent();
    return s;
  }

  /** Crea un rectángulo con relleno y/o borde opcionales. */
  function rect(slide, x, y, w, h, fill, border) {
    var s = slide.insertShape(SlidesApp.ShapeType.RECTANGLE, x, y, w, h);
    if (fill)   { s.getFill().setSolidFill(fill); }
    else        { s.getFill().setTransparent(); }
    if (border) { s.getBorder().getLineFill().setSolidFill(border); s.getBorder().setWeight(0.5); }
    else        { s.getBorder().setTransparent(); }
    return s;
  }

  /**
   * Texto enriquecido. Cada elemento de `parts` puede tener:
   *   text, font, size, color, accent (bool), bold, italic
   */
  function richText(shape, parts, defaults) {
    defaults = defaults || {};
    var fullText = '';
    var segments = parts.map(function (p) {
      var start = fullText.length;
      fullText += p.text;
      return {
        start:  start,
        end:    start + p.text.length,
        font:   p.font,
        size:   p.size,
        color:  p.color,
        accent: p.accent,
        bold:   p.bold,
        italic: p.italic
      };
    });
    var tr = shape.getText();
    tr.setText(fullText);
    segments.forEach(function (seg) {
      if (seg.start >= seg.end) { return; }
      var r  = tr.getRange(seg.start, seg.end);
      var st = r.getTextStyle();
      st.setFontFamily(seg.font  || defaults.font  || 'Georgia');
      st.setFontSize  (seg.size  || defaults.size  || 24);
      st.setForegroundColor(seg.accent ? ACCENT : (seg.color || defaults.color || WHITE));
      st.setBold  (seg.bold   !== undefined ? seg.bold   : (defaults.bold   || false));
      st.setItalic(seg.italic !== undefined ? seg.italic : (seg.accent ? true : (defaults.italic || false)));
    });
    if (defaults.align) {
      tr.getParagraphStyle().setParagraphAlignment(defaults.align);
    }
    return shape;
  }

  /** Texto con estilo uniforme. */
  function txt(slide, text, x, y, w, h, opts) {
    opts = opts || {};
    var s  = box(slide, x, y, w, h);
    var tr = s.getText();
    tr.setText(text);
    var st = tr.getTextStyle();
    st.setFontFamily(opts.font   || 'Arial');
    st.setFontSize  (opts.size   || 11);
    st.setForegroundColor(opts.color || WHITE);
    st.setBold  (opts.bold   || false);
    st.setItalic(opts.italic || false);
    if (opts.align) { tr.getParagraphStyle().setParagraphAlignment(opts.align); }
    return s;
  }

  /** Tag de sección (kicker) en la parte superior. */
  function sectionTag(slide, text) {
    txt(slide, '— ' + text.toUpperCase(), PX, PY, CW, 12,
        { size: 7, color: ACCENT, bold: true });
  }

  /** Número de slide en el pie. */
  function footer(slide, num) {
    txt(slide,
        (num < 10 ? '0' : '') + num + ' / 16',
        PX, FOOTER_Y, 80, 10,
        { size: 7.5, color: DIM });
  }

  /** Línea de cita con borde izquierdo rosa. */
  function accentLine(slide, text, y, h) {
    h = h || 26;
    rect(slide, PX, y, 2, h, ACCENT, null);
    txt(slide, text, PX + 10, y, CW - 10, h,
        { font: 'Georgia', size: 10.5, color: ACCENT, italic: true });
  }

  /** Paso numerado (slides 02 y 15). */
  function step(slide, num, title, body, x, y, w, h) {
    rect(slide, x, y, w, h, CARD_BG, CARD_BORDER);
    txt(slide, String(num), x + 12, y + 6, 22, 28,
        { font: 'Georgia', size: 22, color: ACCENT, italic: true });
    var ty = y + 10;
    if (title) {
      txt(slide, title, x + 42, ty, w - 54, 16, { size: 10, bold: true });
      ty += 18;
    }
    txt(slide, body, x + 42, ty, w - 54, h - (ty - y) - 8,
        { size: 8.5, color: MUTED });
  }

  /** Tarjeta con eyebrow + título + cuerpo. */
  function card(slide, x, y, w, h, eyebrow, title, body, bSize) {
    rect(slide, x, y, w, h, CARD_BG, CARD_BORDER);
    var cy = y + 12;
    if (eyebrow) {
      txt(slide, eyebrow.toUpperCase(), x + 12, cy, w - 24, 10,
          { size: 7, color: ACCENT, bold: true });
      cy += 13;
    }
    if (title) {
      txt(slide, title, x + 12, cy, w - 24, 18, { size: 10, bold: true });
      cy += 21;
    }
    if (body) {
      txt(slide, body, x + 12, cy, w - 24, h - (cy - y) - 8,
          { size: bSize || 8.5, color: MUTED });
    }
  }

  /** Bloque de columna con título + lista de ítems. */
  function colBlock(slide, x, y, w, h, title, items) {
    rect(slide, x, y, w, h, CARD_BG, CARD_BORDER);
    var cy = y + 12;
    if (title) {
      txt(slide, title, x + 12, cy, w - 24, 16, { size: 9.5, bold: true });
      cy += 19;
    }
    txt(slide, items.map(function (i) { return '– ' + i; }).join('\n'),
        x + 12, cy, w - 24, h - (cy - y) - 8,
        { size: 8.5, color: MUTED });
  }


  // ════════════════════════════════════════════════════════════════════════════
  // SLIDE 01 — PORTADA
  // ════════════════════════════════════════════════════════════════════════════
  var sl01 = deck.getSlides()[0];
  sl01.getPageElements().forEach(function (e) { e.remove(); });
  bgFill(sl01);

  rect(sl01, PX - 8, PY, 3, 20, ACCENT, null);
  txt(sl01, 'WAM', PX + 2, PY, 60, 20, { size: 13, bold: true });

  txt(sl01, 'DIRECCIÓN DE INNOVACIÓN · PROPUESTA',
      PX, H / 2 - 90, CW, 12, { size: 7, color: ACCENT, bold: true });

  richText(box(sl01, PX, H / 2 - 74, CW, 76), [
    { text: 'Un nuevo motor de\n', font: 'Georgia', size: 38 },
    { text: 'ingresos',            font: 'Georgia', size: 38, accent: true },
    { text: ' para WAM',           font: 'Georgia', size: 38 }
  ], { color: WHITE });

  txt(sl01, 'Studio de Innovación — visión 12 meses, plan a 6',
      PX, H / 2 + 14, CW, 18, { size: 11, color: MUTED });

  txt(sl01, 'Enric Mora · 01/06/2026', PX, FOOTER_Y, 200, 10, { size: 7.5, color: DIM });


  // ════════════════════════════════════════════════════════════════════════════
  // SLIDE 02 — ANTES DE EMPEZAR
  // ════════════════════════════════════════════════════════════════════════════
  var sl02 = newSlide(); bgFill(sl02);
  sectionTag(sl02, 'Antes de empezar');

  richText(box(sl02, PX, PY + 16, CW, 70), [
    { text: 'No es un plan de innovación.\nEs una propuesta para ', font: 'Georgia', size: 24 },
    { text: 'proteger el margen',                                    font: 'Georgia', size: 24, accent: true },
    { text: '\nen los próximos 18 meses.',                           font: 'Georgia', size: 24 }
  ], { color: WHITE });

  [
    [null, 'Convertir las iniciativas de IA ya desarrolladas en la compañía — Enric, Anna, Sira — en aceleradores que los estudios puedan integrar en sus ventas. Y construir nuevos aceleradores validados con el consejo ampliado.'],
    [null, 'Hay un espacio entre las tendencias del mercado y la capacidad de los estudios — el Studio de Innovación lo ocupa.'],
    [null, 'Hoy se presenta cómo se construye y por dónde empieza.']
  ].forEach(function (s, i) {
    step(sl02, i + 1, s[0], s[1], PX, PY + 96 + i * 60, CW, 54);
  });
  footer(sl02, 2);


  // ════════════════════════════════════════════════════════════════════════════
  // SLIDE 03 — EL MODELO DE HORAS SE COMPRIME
  // ════════════════════════════════════════════════════════════════════════════
  var sl03 = newSlide(); bgFill(sl03);
  sectionTag(sl03, 'El contexto que ya conoces');

  richText(box(sl03, PX, PY + 16, CW, 52), [
    { text: 'El modelo de horas se comprime —\ny nadie en WAM ', font: 'Georgia', size: 26 },
    { text: 'lo ha enfrentado todavía',                          font: 'Georgia', size: 26, accent: true }
  ], { color: WHITE });

  var c3Y = PY + 78, c3H = 142, c3W = (CW - 12) / 2;
  colBlock(sl03, PX, c3Y, c3W, c3H, 'Lo que está pasando', [
    'Claude Code y similares están reduciendo el tiempo de desarrollo en un 40-60%',
    'Esa eficiencia se la queda el cliente, no el partner',
    'Cada hora ganada en productividad es una hora menos facturable'
  ]);
  colBlock(sl03, PX + c3W + 12, c3Y, c3W, c3H, 'Lo que esto significa para WAM', [
    'Connect, Scale, Grow e Impact dependen de horas facturadas',
    'La compresión todavía no es masiva, pero la dirección es estructural',
    'En 18 meses, esto va a impactar el P&L de todas las prácticas'
  ]);
  accentLine(sl03, '"No es una predicción. Es lo que ya está pasando en nuestros proyectos."', c3Y + c3H + 12, 24);
  footer(sl03, 3);


  // ════════════════════════════════════════════════════════════════════════════
  // SLIDE 04 — EL HUECO DEL MERCADO
  // ════════════════════════════════════════════════════════════════════════════
  var sl04 = newSlide(); bgFill(sl04);
  sectionTag(sl04, 'El espacio que ocupamos');

  richText(box(sl04, PX, PY + 16, CW, 52), [
    { text: 'Hay un hueco entre las tendencias del mercado\ny los estudios — ', font: 'Georgia', size: 26 },
    { text: 'y nadie lo ocupa hoy',                                              font: 'Georgia', size: 26, accent: true }
  ], { color: WHITE });

  var c4Y = PY + 78, c4H = 150, c4W = (CW - 24) / 3;
  card(sl04, PX,                     c4Y, c4W, c4H,
    'Las tendencias', 'Avanzan más rápido que los estudios',
    'La IA, los nuevos modelos de delivery y las nuevas formas de comprar de los clientes evolucionan a una velocidad que ningún estudio individual puede absorber mientras mantiene el delivery actual.');
  card(sl04, PX + c4W + 12,          c4Y, c4W, c4H,
    'Los estudios', 'Están en delivery',
    'Connect, Scale, Grow e Impact no tienen tiempo ni orden para detectar tendencias, validarlas y construir aceleradores. Su foco es el delivery de proyectos.');
  card(sl04, PX + (c4W + 12) * 2,   c4Y, c4W, c4H,
    'Las cuentas grandes', 'Esperan que WAM lidere',
    'Las cuentas grandes con ambición digital esperan que su partner les hable de lo nuevo. Hoy en WAM no hay nadie con ese rol formalizado.');
  accentLine(sl04, '"Innovación es el puente entre la tendencia y el estudio. No compite con los estudios — los habilita."', c4Y + c4H + 12, 24);
  footer(sl04, 4);


  // ════════════════════════════════════════════════════════════════════════════
  // SLIDE 05 — NUESTRA POSICIÓN
  // ════════════════════════════════════════════════════════════════════════════
  var sl05 = newSlide(); bgFill(sl05);
  sectionTag(sl05, 'Nuestra posición');

  richText(box(sl05, PX, PY + 16, CW, 62), [
    { text: 'WAM ayuda a las grandes cuentas a\n',         font: 'Georgia', size: 24 },
    { text: 'activar innovación con resultados medibles',   font: 'Georgia', size: 24, accent: true },
    { text: '\n— sin transformaciones de 18 meses',        font: 'Georgia', size: 24 }
  ], { color: WHITE });

  txt(sl05, 'Acelerador cerrado, ROI medible, en ciclos de semanas. No transformación de 18 meses.',
      PX, PY + 86, CW, 12, { size: 9.5, color: MUTED });

  var c5Y = PY + 104, c5H = 156, c5W = (CW - 24) / 3;
  card(sl05, PX,                    c5Y, c5W, c5H,
    '1. Track record', 'Grandes cuentas demostradas',
    'Mahou, Heineken, Aleph. Track record contrastado en cuentas de este perfil.');
  card(sl05, PX + c5W + 12,         c5Y, c5W, c5H,
    '2. Aceleradores en producción', 'No se empieza de cero',
    'Enric, Anna, Sira, asistente de compras. Los aceleradores existentes se industrializan, no se inventan.');
  card(sl05, PX + (c5W + 12) * 2,  c5Y, c5W, c5H,
    '3. Ecosistema 360', 'Lo que ninguna boutique tiene',
    'Connect, Scale, Grow e Impact. Ninguna boutique de innovación puede activar el CRM, el commerce o la creatividad. WAM sí.');
  footer(sl05, 5);


  // ════════════════════════════════════════════════════════════════════════════
  // SLIDE 06 — CÓMO SE ORGANIZA
  // ════════════════════════════════════════════════════════════════════════════
  var sl06 = newSlide(); bgFill(sl06);
  sectionTag(sl06, 'Cómo lo organizamos');

  txt(sl06, 'Studio de Innovación', PX, PY + 16, CW, 32,
      { font: 'Georgia', size: 30 });
  txt(sl06, 'Un área que detecta, construye y habilita a los estudios',
      PX, PY + 54, CW, 14, { size: 10, color: MUTED });

  var c6Y = PY + 74, c6H = 166, c6W = (CW - 24) / 3;
  card(sl06, PX,                    c6Y, c6W, c6H,
    'Diagnóstico', 'Acelerador de entrada de 2 semanas',
    'Habilita conversaciones con cuentas grandes. ROI medible desde el primer entregable. La venta la cierra el estudio correspondiente.');
  card(sl06, PX + c6W + 12,         c6Y, c6W, c6H,
    'Aceleradores', 'Componentes reutilizables con precio cerrado',
    'IP propia que reduce el tiempo de entrega y protege el margen de los estudios proyecto a proyecto.');
  card(sl06, PX + (c6W + 12) * 2,  c6Y, c6W, c6H,
    'Soluciones ad-hoc', 'Transformación profunda con agentes',
    'Casos complejos que combinan el área de Innovación con la ejecución de los estudios. Ticket alto, margen protegido por la IP construida.');
  accentLine(sl06, '"No es un lab. Es el estudio que habilita a los demás estudios."', c6Y + c6H + 10, 22);
  footer(sl06, 6);


  // ════════════════════════════════════════════════════════════════════════════
  // SLIDE 07 — WAM DATA READINESS FOR AI
  // ════════════════════════════════════════════════════════════════════════════
  var sl07 = newSlide(); bgFill(sl07);
  sectionTag(sl07, 'El primer acelerador del catálogo');

  richText(box(sl07, PX, PY + 16, CW, 54), [
    { text: 'WAM Data Readiness for AI\n',                               font: 'Georgia', size: 26 },
    { text: '15.000 € · 2 semanas · puerta a proyectos derivados',      font: 'Georgia', size: 17, accent: true }
  ], { color: WHITE });

  var c7Y = PY + 80, c7H = 188, c7W = (CW - 24) / 3;
  card(sl07, PX, c7Y, c7W, c7H,
    'Qué incluye', 'Diagnóstico completo',
    'Madurez de datos sobre 5 ejes:\n(1) Calidad del dato\n(2) Accesibilidad e integración\n(3) Gobernanza y trazabilidad\n(4) Cumplimiento normativo (GDPR)\n(5) Preparación para casos de IA\n\nMapa de 2-3 quick-wins en <90 días\nRoadmap de 12 meses para AI-ready');
  card(sl07, PX + c7W + 12, c7Y, c7W, c7H,
    'Para quién', 'Cuentas grandes con datos infraexplotados',
    'Mahou, Heineken, Aleph como hipótesis de cuentas iniciales. La venta la cierra el Account Manager con apoyo técnico del Studio.');
  card(sl07, PX + (c7W + 12) * 2, c7Y, c7W, c7H,
    'Por qué este primero', 'El dolor real del mercado',
    'Resuelve el dolor real que las cuentas grandes tienen con sus datos. Nadie lo vende empaquetado con este nivel de concreción. Es la puerta a proyectos derivados de mayor ticket.');
  footer(sl07, 7);


  // ════════════════════════════════════════════════════════════════════════════
  // SLIDE 08 — CÓMO SE MIDE EL IMPACTO
  // ════════════════════════════════════════════════════════════════════════════
  var sl08 = newSlide(); bgFill(sl08);
  sectionTag(sl08, 'Cómo se mide el impacto');

  richText(box(sl08, PX, PY + 16, CW, 30), [
    { text: 'Venta ',                      font: 'Georgia', size: 28 },
    { text: 'influenciada',                font: 'Georgia', size: 28, accent: true },
    { text: ', no facturación directa',    font: 'Georgia', size: 28 }
  ], { color: WHITE });

  txt(sl08, 'El Studio se mide por su capacidad de habilitar negocio en los estudios, no por su propia facturación.',
      PX, PY + 52, CW, 14, { size: 9, color: MUTED });

  var c8Y = PY + 74, c8H = 120, c8W = (CW - 36) / 4, c8G = 12;
  card(sl08, PX,                   c8Y, c8W, c8H, 'Pipeline influenciado', null,
    'Oportunidades comerciales abiertas en las que el Studio ha participado — con un acelerador, un diagnóstico o un workshop.');
  card(sl08, PX + (c8W + c8G),     c8Y, c8W, c8H, 'Ventas influenciadas', null,
    'Contratos cerrados por los estudios que incluyen aceleradores del catálogo del Studio.');
  card(sl08, PX + (c8W + c8G) * 2, c8Y, c8W, c8H, 'Negocio habilitado', null,
    'Volumen total de facturación de los estudios atribuible a la influencia del Studio.');
  card(sl08, PX + (c8W + c8G) * 3, c8Y, c8W, c8H, 'Aceleradores activos', null,
    'Número de aceleradores del catálogo con uso comercial real durante el periodo.');
  accentLine(sl08, '"La venta cerrada con el apoyo del Studio queda íntegramente en el estudio ejecutor del proyecto."', c8Y + c8H + 12, 28);
  footer(sl08, 8);


  // ════════════════════════════════════════════════════════════════════════════
  // SLIDE 09 — EL EQUIPO
  // ════════════════════════════════════════════════════════════════════════════
  var sl09 = newSlide(); bgFill(sl09);
  sectionTag(sl09, 'Cómo lo hacemos posible');

  richText(box(sl09, PX, PY + 16, CW, 28), [
    { text: 'Un equipo ',           font: 'Georgia', size: 26 },
    { text: 'deliberadamente lean', font: 'Georgia', size: 26, accent: true }
  ], { color: WHITE });

  // Tabla equipo core
  var tY = PY + 52, tH = 94;
  rect(sl09, PX, tY, CW, tH, CARD_BG, CARD_BORDER);
  txt(sl09, 'Núcleo operativo', PX + 12, tY + 8, 200, 12, { size: 9, bold: true });
  var hY09 = tY + 22;
  txt(sl09, 'PERFIL',     PX + 12,  hY09, 150, 10, { size: 6.5, color: DIM, bold: true });
  txt(sl09, 'PERSONA',    PX + 170, hY09, 180, 10, { size: 6.5, color: DIM, bold: true });
  txt(sl09, 'DEDICACIÓN', PX + 360, hY09, 120, 10, { size: 6.5, color: DIM, bold: true });
  [
    ['Tecnología',           'Enric Mora',           '100%',              true],
    ['Producto Digital',     'Cristian Sanclemente', '30-50%',            false],
    ['Negocio / Estrategia', 'Gonzalo Gamboa',       '30% (lanzamiento)', false]
  ].forEach(function (r, i) {
    var ry = hY09 + 14 + i * 18;
    txt(sl09, r[0], PX + 12,  ry, 150, 14, { size: 9,   color: WHITE });
    txt(sl09, r[1], PX + 170, ry, 178, 14, { size: 9,   color: MUTED });
    txt(sl09, r[2], PX + 360, ry, 118, 14, { size: 9,   color: r[3] ? ACCENT : MUTED, bold: r[3] });
  });

  // Bloques consejo
  var c9Y = tY + tH + 8, c9H = 108, c9W = (CW - 12) / 2;
  colBlock(sl09, PX, c9Y, c9W, c9H, 'Consejo ampliado (bajo demanda)', [
    'VPs y Practice Leads de cada estudio',
    'Directores de Cuenta de cuentas estratégicas',
    'Personas de negocio (por confirmar)'
  ]);
  colBlock(sl09, PX + c9W + 12, c9Y, c9W, c9H, 'Funciones del consejo', [
    'Aportar señales de mercado',
    'Validar prioridades del catálogo',
    'Liderar el GTM hacia los estudios',
    'Dedicación parcial sobre incorporación permanente'
  ]);
  accentLine(sl09, '"Tres personas que destilan y construyen. Un consejo que aporta señales y prioriza."', c9Y + c9H + 8, 22);
  footer(sl09, 9);


  // ════════════════════════════════════════════════════════════════════════════
  // SLIDE 10 — GTM
  // ════════════════════════════════════════════════════════════════════════════
  var sl10 = newSlide(); bgFill(sl10);
  sectionTag(sl10, 'Cómo lo contamos al mercado');

  richText(box(sl10, PX, PY + 16, CW, 30), [
    { text: 'El GTM ocurre ',           font: 'Georgia', size: 28 },
    { text: 'a través de los estudios', font: 'Georgia', size: 28, accent: true }
  ], { color: WHITE });

  txt(sl10, 'El Studio no vende al cliente final. Habilita a los Account Managers y a los estudios a vender mejor.',
      PX, PY + 52, CW, 14, { size: 9, color: MUTED });

  var c10Y = PY + 74, c10H = 164, c10W = (CW - 24) / 3;
  card(sl10, PX,                     c10Y, c10W, c10H, 'Cómo llega al cliente', null,
    'Los Account Managers detectan necesidad → activan el acelerador adecuado del catálogo → el Studio soporta técnicamente → el estudio correspondiente cierra la venta.');
  card(sl10, PX + c10W + 12,         c10Y, c10W, c10H, 'Soporte de Marketing', null,
    'Materiales internos para que los estudios conozcan el catálogo. Materiales externos puntuales para posicionar a WAM como referente. El nombre definitivo del Studio lo decide Marketing.');
  card(sl10, PX + (c10W + 12) * 2,  c10Y, c10W, c10H, 'Narrativa hacia el cliente', null,
    'WAM no os trae IA. Os trae los resultados que la IA puede dar a vuestro negocio — paquetizados, medidos y entregables en semanas.');
  accentLine(sl10, '"La narrativa — y el nombre del Studio — los lidera Marketing."', c10Y + c10H + 10, 22);
  footer(sl10, 10);


  // ════════════════════════════════════════════════════════════════════════════
  // SLIDE 11 — LAS LITURGIAS DEL STUDIO
  // ════════════════════════════════════════════════════════════════════════════
  var sl11 = newSlide(); bgFill(sl11);
  sectionTag(sl11, 'Cómo se conecta el Studio con el resto de WAM');

  richText(box(sl11, PX, PY + 16, CW, 40), [
    { text: 'Las ',                                              font: 'Georgia', size: 24 },
    { text: 'liturgias',                                         font: 'Georgia', size: 24, accent: true },
    { text: ' del Studio — entradas, procesamiento y salidas',   font: 'Georgia', size: 24 }
  ], { color: WHITE });

  txt(sl11, 'El Studio es un nodo de un sistema. Su valor está en las conexiones con los estudios, los Account Managers y el cliente.',
      PX, PY + 62, CW, 14, { size: 9, color: MUTED });

  var c11Y = PY + 84, c11H = 170, c11W = (CW - 24) / 3;
  card(sl11, PX, c11Y, c11W, c11H,
    'Entrada', 'Cómo llegan las demandas',
    '– Radar propio del Studio (tendencias técnicas y de mercado)\n– Demandas de VPs y Practice Leads (desde delivery)\n– Demandas de Directores de Cuenta (desde cliente)');
  card(sl11, PX + c11W + 12, c11Y, c11W, c11H,
    'Procesamiento', 'Cómo se construye',
    '– Destilación y priorización trimestral con el consejo ampliado\n– Construcción del acelerador con el núcleo operativo\n– Validación con cliente piloto identificado por un estudio');
  card(sl11, PX + (c11W + 12) * 2, c11Y, c11W, c11H,
    'Salida', 'Cómo vuelve al negocio',
    '– Empaquetado del acelerador como activo del catálogo\n– Habilitación a Account Managers y Practice Leads\n– Venta cerrada por el estudio, métrica de influencia atribuida al Studio');
  accentLine(sl11, '"El Studio no actúa solo. La fuerza está en las conexiones."', c11Y + c11H + 8, 22);
  footer(sl11, 11);


  // ════════════════════════════════════════════════════════════════════════════
  // SLIDE 12 — PLAN 90 DÍAS
  // ════════════════════════════════════════════════════════════════════════════
  var sl12 = newSlide(); bgFill(sl12);
  sectionTag(sl12, 'Cómo lo gobernamos');

  richText(box(sl12, PX, PY + 16, CW, 36), [
    { text: 'Plan 90 días — ',                                               font: 'Georgia', size: 22 },
    { text: 'junio para lanzar, julio para construir, otoño para validar',   font: 'Georgia', size: 22, accent: true }
  ], { color: WHITE });

  var c12Y = PY + 60, c12W = (CW - 12) / 2;
  var c12H = Math.floor((FOOTER_Y - c12Y - 16) / 2 - 6);   // ≈ 118 pt
  [
    ['Fase 1 — Junio', 'Lanzamiento',
      '– Kickoff con dirección general\n– Diseño operativo y modelo de relación con los estudios\n– Análisis de costes\n– Inventario de activos reutilizables\n– Definición del plan de Marketing'],
    ['Fase 2 — Julio', 'Construcción',
      '– Run del modelo operativo, primeras conclusiones\n– Asistente de venta\n– Data Readiness for AI\n– Agentes Customer Service\n– Identificación de pipeline en cuentas existentes'],
    ['Fase 3 — Agosto', 'Mes inhábil',
      '– Refinamiento del catálogo\n– Depuración de entregables'],
    ['Fase 4 — Sep–Dic', 'Validación',
      '– Primeras ventas influenciadas\n– BAU de toda la operativa\n– Iteración de aceleradores con datos reales\n– Revisión integral en diciembre y roadmap 2027']
  ].forEach(function (p, i) {
    var col = i % 2, row = Math.floor(i / 2);
    card(sl12,
      PX + col * (c12W + 12),
      c12Y + row * (c12H + 8),
      c12W, c12H, p[0], p[1], p[2], 8.5);
  });
  footer(sl12, 12);


  // ════════════════════════════════════════════════════════════════════════════
  // SLIDE 13 — RIESGOS
  // ════════════════════════════════════════════════════════════════════════════
  var sl13 = newSlide(); bgFill(sl13);
  sectionTag(sl13, 'Lo que se debe evitar');

  richText(box(sl13, PX, PY + 16, CW, 28), [
    { text: 'Cinco riesgos identificados — ', font: 'Georgia', size: 24 },
    { text: 'y cómo se mitigan',              font: 'Georgia', size: 24, accent: true }
  ], { color: WHITE });

  txt(sl13, 'El Studio nace consciente de los modos de fallo. Cada riesgo tiene un mecanismo de mitigación definido desde el día uno.',
      PX, PY + 50, CW, 12, { size: 8.5, color: MUTED });

  var risks = [
    ['CONVERTIRSE EN UN LAB',
     'Equipo aislado que hace cosas interesantes pero que nadie vende y termina siendo centro de coste.',
     'Medición exclusiva por venta influenciada y conexión obligatoria con los estudios a través del consejo ampliado.'],
    ['INICIATIVA PERCIBIDA COMO EXCLUSIVA DE UN ESTUDIO',
     'Pérdida de transversalidad si el Studio se asocia a una sola práctica.',
     'Consejo ampliado con VPs de todas las prácticas y comunicación explícita de transversalidad desde el kickoff.'],
    ['CONSTRUIR ACELERADORES QUE NADIE COMPRA',
     'Innovación tecnológica desconectada del pragmatismo del negocio.',
     'Cada acelerador requiere validación con cliente piloto identificado por un Account Manager antes de entrar al catálogo.'],
    ['COMPETIR CON LOS ESTUDIOS',
     'El Studio absorbe ventas que deberían capitalizar las prácticas.',
     'Principio rector de venta atribuida íntegramente al estudio que la cierra, sin facturación propia del Studio.'],
    ['OPERATIVA DIFUSA',
     'Falta de claridad sobre relaciones, liturgias y procesos.',
     'Diseño operativo formalizado en la slide de liturgias y revisión trimestral con Dirección General.']
  ];

  var rY0 = PY + 68, rColW = (CW - 24) / 2, rRowH = 38;
  txt(sl13, 'RIESGO',     PX,              rY0, rColW, 10, { size: 7, color: DIM, bold: true });
  txt(sl13, 'MITIGACIÓN', PX + rColW + 24, rY0, rColW, 10, { size: 7, color: DIM, bold: true });

  var rBodyY = rY0 + 14;
  rect(sl13, PX, rBodyY - 4, CW, rRowH * risks.length + 6, CARD_BG, CARD_BORDER);

  risks.forEach(function (r, i) {
    var ry = rBodyY + i * rRowH;
    txt(sl13, r[0], PX + 8, ry + 4,  rColW - 10, 10,         { size: 6.5, color: ACCENT, bold: true });
    txt(sl13, r[1], PX + 8, ry + 16, rColW - 10, rRowH - 18, { size: 7.5, color: MUTED });
    txt(sl13, r[2], PX + rColW + 28, ry + 4, rColW - 10, rRowH - 6, { size: 7.5, color: MUTED });
    if (i < risks.length - 1) {
      rect(sl13, PX, ry + rRowH - 1, CW, 0.5, '#333333', null);
    }
  });

  accentLine(sl13, '"Los riesgos no se eliminan — se gestionan. La slide existe para que el sistema sepa qué evitar."',
    rBodyY + risks.length * rRowH + 10, 22);
  footer(sl13, 13);


  // ════════════════════════════════════════════════════════════════════════════
  // SLIDE 14 — PRESUPUESTO
  // ════════════════════════════════════════════════════════════════════════════
  var sl14 = newSlide(); bgFill(sl14);
  sectionTag(sl14, 'La inversión');

  richText(box(sl14, PX, PY + 16, CW, 30), [
    { text: '200 K€ — ',                          font: 'Georgia', size: 28 },
    { text: 'orientados a habilitar pipeline',     font: 'Georgia', size: 28, accent: true }
  ], { color: WHITE });

  txt(sl14, 'Presupuesto aprobado para el resto del año. El 77% va al equipo — el activo que genera el valor.',
      PX, PY + 52, CW, 12, { size: 9, color: MUTED });

  var c14Y = PY + 70, c14W = (CW - 12) / 2;
  var c14H = Math.floor((FOOTER_Y - c14Y - 52) / 2 - 6);   // ≈ 92 pt

  [
    ['SALARIOS EQUIPO CORE · 77%', '154 K€', 'Tres perfiles dedicados hasta fin de año: tecnología, producto digital y negocio/estrategia.'],
    ['TECH & ENABLEMENT · 13%',    '26 K€',  'Formación específica en IA, herramientas, licencias y certificaciones del equipo dedicado.'],
    ['FONDO PILOTOS · 7%',         '14 K€',  'Descuentos comerciales puntuales en los primeros clientes estratégicos para asegurar caso de éxito inicial.'],
    ['HABILITACIÓN COMERCIAL · 3%', '6 K€',  'Eventos sectoriales y materiales externos puntuales. La narrativa GTM se construye con el equipo de Marketing interno.']
  ].forEach(function (b, i) {
    var col = i % 2, row = Math.floor(i / 2);
    var bx = PX + col * (c14W + 12);
    var by = c14Y + row * (c14H + 8);
    rect(sl14, bx, by, c14W, c14H, CARD_BG, CARD_BORDER);
    txt(sl14, b[0], bx + 12, by + 10,  c14W - 24, 10, { size: 7,  color: ACCENT, bold: true });
    txt(sl14, b[1], bx + 12, by + 22,  c14W - 24, 24, { font: 'Georgia', size: 22, color: ACCENT });
    txt(sl14, b[2], bx + 12, by + 50,  c14W - 24, c14H - 56, { size: 8.5, color: MUTED });
  });

  accentLine(sl14, '"El activo del Studio es el equipo. Todo lo demás es soporte para que ese equipo destile y construya con criterio."',
    c14Y + 2 * c14H + 20, 24);
  footer(sl14, 14);


  // ════════════════════════════════════════════════════════════════════════════
  // SLIDE 15 — PRÓXIMOS PASOS
  // ════════════════════════════════════════════════════════════════════════════
  var sl15 = newSlide(); bgFill(sl15);
  sectionTag(sl15, 'El cierre');

  richText(box(sl15, PX, PY + 16, CW, 30), [
    { text: 'Próximos pasos — ',         font: 'Georgia', size: 26 },
    { text: 'qué se activa esta semana', font: 'Georgia', size: 26, accent: true }
  ], { color: WHITE });

  [
    ['Kickoff con Dirección General',
     'Arranque formal del Studio con presencia del Director General. Diseño operativo en marcha.'],
    ['Conversación con Marketing',
     'Cierre del nombre definitivo y diseño de la narrativa interna y externa antes del All Hands del 20 de junio.'],
    ['Modelo de atribución',
     'Definición del modelo de atribución para que las métricas de venta influenciada tengan reglas claras desde el día uno.']
  ].forEach(function (s, i) {
    step(sl15, i + 1, s[0], s[1], PX, PY + 56 + i * 66, CW, 60);
  });
  accentLine(sl15, '"Si en mes 12 la venta influenciada no sostiene la tesis, se ajusta sin drama."',
    PY + 56 + 3 * 66 + 6, 22);
  footer(sl15, 15);


  // ════════════════════════════════════════════════════════════════════════════
  // SLIDE 16 — CLOSING
  // ════════════════════════════════════════════════════════════════════════════
  var sl16 = newSlide(); bgFill(sl16);

  var q16Y = H / 2 - 52;
  txt(sl16, '—', PX, q16Y - 22, CW, 14,
      { size: 12, color: ACCENT, align: SlidesApp.ParagraphAlignment.CENTER });
  txt(sl16, 'WAM no se adapta al futuro. Lo construye.', PX, q16Y, CW, 72,
      { font: 'Georgia', size: 34, italic: true, align: SlidesApp.ParagraphAlignment.CENTER });
  txt(sl16, 'WAM STUDIO DE INNOVACIÓN · ESTRATEGIA 2026', PX, q16Y + 78, CW, 14,
      { size: 7.5, color: DIM, align: SlidesApp.ParagraphAlignment.CENTER });
  txt(sl16, 'WAM', W / 2 - 20, H - PY - 20, 40, 14,
      { size: 10, bold: true, color: DIM, align: SlidesApp.ParagraphAlignment.CENTER });
  footer(sl16, 16);


  // ── Done ─────────────────────────────────────────────────────────────────
  var url = deck.getUrl();
  Logger.log('Presentación creada: ' + url);
  return url;
}
