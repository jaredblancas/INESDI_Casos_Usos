import type { Variants, Transition } from "framer-motion";

// Curvas y duraciones de Emil Kowalski (las CSS por defecto son demasiado débiles).
export const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1];
export const EASE_IN_OUT: [number, number, number, number] = [
  0.77, 0, 0.175, 1,
];

// Entrada de un elemento: scale 0.97 (NUNCA scale 0) + opacity + leve subida.
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.32, ease: EASE_OUT },
  },
};

// Contenedor con stagger corto (40-60ms) — cascada natural, no bloquea interacción.
export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.05, delayChildren: 0.04 },
  },
};

// Fade simple para crossfades / cambios de estado.
export const fade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.2, ease: EASE_OUT } },
};

// Transición spring estilo Apple para elementos que deben sentirse "vivos".
export const softSpring: Transition = {
  type: "spring",
  duration: 0.5,
  bounce: 0.2,
};
