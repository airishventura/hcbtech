export const easeOut = [0.22, 1, 0.36, 1] as const;
export const easeInOut = [0.65, 0, 0.35, 1] as const;

export const duration = {
  feedback: 0.14,
  micro: 0.24,
  transition: 0.42,
  reveal: 0.68,
  hero: 1.05,
} as const;

export const spring = {
  type: "spring" as const,
  stiffness: 260,
  damping: 28,
  mass: 0.75,
};

export const stagger = (index: number, amount = 0.065, maximum = 0.28) => Math.min(index * amount, maximum);
