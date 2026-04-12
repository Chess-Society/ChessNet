// Sistema de animaciones y transiciones para ChessNet
export const animations = {
  // Transiciones de entrada
  fadeIn: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, ease: "easeOut" }
  },
  
  slideInFromLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.3, ease: "easeOut" }
  },
  
  slideInFromRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.3, ease: "easeOut" }
  },
  
  slideInFromTop: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, ease: "easeOut" }
  },
  
  // Transiciones de salida
  fadeOut: {
    initial: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2, ease: "easeIn" }
  },
  
  // Animaciones de hover
  hover: {
    scale: 1.02,
    transition: { duration: 0.2, ease: "easeOut" }
  },
  
  hoverSubtle: {
    scale: 1.01,
    transition: { duration: 0.15, ease: "easeOut" }
  },
  
  // Animaciones de botones
  buttonPress: {
    scale: 0.98,
    transition: { duration: 0.1, ease: "easeIn" }
  },
  
  // Animaciones de lista
  staggerChildren: {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  },
  
  // Animaciones de loading
  pulse: {
    animate: {
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  },
  
  // Animaciones de éxito/error
  success: {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { 
      type: "spring", 
      stiffness: 500, 
      damping: 30,
      duration: 0.3
    }
  },
  
  error: {
    initial: { x: 0 },
    animate: { x: [-10, 10, -10, 10, 0] },
    transition: { duration: 0.5, ease: "easeInOut" }
  }
};

// Clases CSS para animaciones
export const animationClasses = {
  // Transiciones suaves
  smoothTransition: "transition-all duration-300 ease-out",
  fastTransition: "transition-all duration-150 ease-out",
  slowTransition: "transition-all duration-500 ease-out",
  
  // Hover effects
  hoverScale: "hover:scale-105 transition-transform duration-200 ease-out",
  hoverScaleSubtle: "hover:scale-102 transition-transform duration-150 ease-out",
  hoverLift: "hover:-translate-y-1 transition-transform duration-200 ease-out",
  
  // Focus effects
  focusRing: "focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200",
  
  // Loading states
  loadingPulse: "animate-pulse",
  loadingSpin: "animate-spin",
  
  // Entrance animations
  fadeInUp: "animate-fade-in-up",
  slideInLeft: "animate-slide-in-left",
  slideInRight: "animate-slide-in-right",
  
  // Button animations
  buttonHover: "hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200",
  buttonActive: "active:scale-95 transition-transform duration-100",
  
  // Card animations
  cardHover: "hover:shadow-xl hover:-translate-y-1 transition-all duration-300",
  cardEnter: "animate-fade-in-up"
};

// Utilidades para animaciones programáticas
export const createStaggerAnimation = (delay: number = 0.1) => ({
  animate: {
    transition: {
      staggerChildren: delay
    }
  }
});

export const createFadeInAnimation = (direction: 'up' | 'down' | 'left' | 'right' = 'up') => {
  const directions = {
    up: { y: 20 },
    down: { y: -20 },
    left: { x: 20 },
    right: { x: -20 }
  };
  
  return {
    initial: { opacity: 0, ...directions[direction] },
    animate: { opacity: 1, x: 0, y: 0 },
    transition: { duration: 0.4, ease: "easeOut" }
  };
};

// Hook para animaciones de entrada
export const useEnterAnimation = (delay: number = 0) => {
  return {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { 
      duration: 0.4, 
      ease: "easeOut",
      delay 
    }
  };
};
