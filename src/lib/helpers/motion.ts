import { Variants } from "framer-motion";

export function slideInFromLeft(delay: number): Variants {
  return {
    hidden: { x: -50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        delay: delay,
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };
}

export function slideInFromRight(delay: number): Variants {
  return {
    hidden: { x: 50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        delay: delay,
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };
}

export const slideInFromTop: Variants = {
  hidden: { y: -30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      delay: 0.2,
      duration: 0.6,
    },
  },
};

export const slideInFromBottom: Variants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      delay: 0.4,
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export const fadeIn = (delay: number): Variants => ({
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delay: delay,
      duration: 0.7,
      ease: "easeOut",
    },
  },
});

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

export const floatUp = (delay: number): Variants => ({
  hidden: {
    y: 60,
    opacity: 0,
    scale: 0.9,
    rotateX: 15,
  },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    rotateX: 0,
    transition: {
      delay: delay,
      duration: 1,
      ease: [0.6, -0.05, 0.01, 0.99],
      type: "spring",
      stiffness: 60,
      damping: 20,
    },
  },
});

export const bounceIn = (delay: number): Variants => ({
  hidden: {
    scale: 0.3,
    opacity: 0,
    y: 50,
  },
  visible: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: {
      delay: delay,
      duration: 0.6,
      ease: "easeOut",
      type: "spring",
      stiffness: 260,
      damping: 20,
    },
  },
});

export const rotateSlideIn = (
  delay: number,
  direction: "left" | "right"
): Variants => ({
  hidden: {
    x: direction === "left" ? -80 : 80,
    opacity: 0,
    rotate: direction === "left" ? -10 : 10,
    scale: 0.9,
  },
  visible: {
    x: 0,
    opacity: 1,
    rotate: 0,
    scale: 1,
    transition: {
      delay: delay,
      duration: 0.7,
      ease: [0.34, 1.56, 0.64, 1],
      type: "spring",
      stiffness: 120,
      damping: 18,
    },
  },
});

export const staggerList = (delay: number): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: delay + 0.1,
    },
  },
});

export const listItem: Variants = {
  hidden: {
    opacity: 0,
    x: -20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

export const scrollReveal = (delay: number = 0): Variants => ({
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay,
      duration: 0.5,
      ease: "easeOut",
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
});

export const iconReveal = (delay: number = 0): Variants => ({
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      delay,
      duration: 0.4,
      ease: "easeOut",
    },
  },
});

export const textReveal = (delay: number = 0): Variants => ({
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay,
      duration: 0.4,
      ease: "easeOut",
    },
  },
});
