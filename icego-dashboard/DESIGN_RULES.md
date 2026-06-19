# ICE-GO · Reglas de diseño (anti-slop)

> Fuente: **Glacier Modernist** (DESIGN.md de Stitch) + skills `emil-design-eng`,
> `impeccable`, `Leonxlnx/taste-skill`. Cada pantalla se valida contra esta lista
> en el pase de refinamiento (Fase 4) antes de darse por terminada.

## Locks de consistencia (taste-skill)
- **Color lock:** un solo accent — Glacier Cyan (`--primary`). Nada de segundo
  accent compitiendo. Estados (éxito/aviso/error) en tonos desaturados.
- **Shape lock:** radios desde `--radius` (0.75rem). Cards `rounded-xl`, botones/
  inputs `rounded-md`/`rounded-lg`, chips `rounded-full`. No mezclar sharp y pill.
- **Theme lock:** claro y dark definidos a nivel raíz. Dark usa off-black
  (`#0B1014`) / off-white (`#E6EDF3`), nunca negro/blanco puro. Paridad de
  contraste WCAG AA en ambos.

## Prohibido (bans)
- `transition: all` → especificar propiedades (transform, opacity, colores).
- Animar desde `scale(0)` → empezar en `scale(0.95-0.97)` + opacity.
- `ease-in` en UI → usar `--ease-out` o curva custom.
- Animar acciones de teclado / acciones repetidas 100+ veces al día.
- `window.addEventListener('scroll')` → usar IntersectionObserver / Motion useScroll.
- Gradientes mesh-blob o AI-purple (la marca no es morada).
- Dots de estado decorativos → solo para estado semántico real (semáforo de pedidos).
- 3 cards iguales en fila como recurso por defecto → preferir jerarquía/asimetría.
- Em-dash / en-dash en copy de cara al usuario.
- Texto placeholder genérico → copy original en español, profesional.

## Motion (Emil)
- Duraciones: press 100-160ms · tooltip 125-200ms · dropdown 150-250ms · modal <300ms.
- Botones: `scale(0.97)` en `:active` (ya en `Button`).
- Popovers: origin-aware (escalan desde el trigger). Modales: centrados.
- Stagger de listas: 40-60ms entre items (`staggerContainer` en `lib/motion.ts`).
- `prefers-reduced-motion`: quita movimiento, conserva opacidad/color (en globals.css).
- Hover effects detrás de `@media (hover:hover)` donde aplique.

## Layout / contenido
- Sidebar charcoal fija 240px (colapsa en tablet/móvil).
- Container máx. 1440px; densidad cómoda (16px) salvo tablas (compacta 8px).
- Tablas borderless con divisores horizontales + hover tint cyan (`--accent`).
- Estados vacío / loading (skeletons) / error en cada módulo.
