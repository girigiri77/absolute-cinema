import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Play, Star, Film, Monitor, Tv, Radio } from "lucide-react";

type CinemaIcon = {
  icon: React.ElementType;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  blur: number;
};

const CinemaElements: React.FC = () => {
  const [isLowPerformance, setIsLowPerformance] = useState(false);
  const [elements, setElements] = useState<CinemaIcon[]>([]);

  useEffect(() => {
    // Detect low-performance devices
    const checkPerformance = () => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isSmallScreen = window.innerWidth < 768;
      const hasLimitedMemory = (navigator as any).deviceMemory < 4;
      
      return isMobile || isSmallScreen || hasLimitedMemory;
    };

    setIsLowPerformance(checkPerformance());

    // Generate cinema elements
    const icons = [Play, Star, Film, Monitor, Tv, Radio];
    const count = isLowPerformance ? 8 : 15;
    
    const newElements: CinemaIcon[] = [];
    
    for (let i = 0; i < count; i++) {
      const icon = icons[Math.floor(Math.random() * icons.length)];
      newElements.push({
        icon,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 16 + Math.random() * 12, // 16-28px
        duration: 15 + Math.random() * 20, // 15-35s
        delay: Math.random() * 10,
        opacity: 0.05 + Math.random() * 0.05, // 5-10%
        blur: 1 + Math.random() * 2, // 1-3px blur
      });
    }
    
    setElements(newElements);
  }, []);

  if (elements.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-[1] overflow-hidden">
      {elements.map((el, i) => {
        const Icon = el.icon;
        const duration = isLowPerformance ? el.duration * 1.5 : el.duration;
        
        return (
          <motion.div
            key={i}
            initial={{ 
              opacity: 0,
              x: `${el.x}%`,
              y: `${el.y}%`
            }}
            animate={{
              opacity: [el.opacity * 0.5, el.opacity, el.opacity * 0.5],
              x: [`${el.x}%`, `${el.x + (Math.random() - 0.5) * 20}%`, `${el.x}%`],
              y: [`${el.y}%`, `${el.y + (Math.random() - 0.5) * 15}%`, `${el.y}%`],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration,
              delay: el.delay,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.5, 1]
            }}
            style={{
              filter: `blur(${el.blur}px)`,
            }}
            className="absolute"
          >
            <Icon 
              className="text-fuchsia-300/20" 
              style={{ 
                width: el.size,
                height: el.size,
                opacity: el.opacity
              }} 
            />
          </motion.div>
        );
      })}
    </div>
  );
};

export default CinemaElements;
