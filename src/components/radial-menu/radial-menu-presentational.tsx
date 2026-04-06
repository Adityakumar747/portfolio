import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MenuItem, Position } from './types';

interface RadialMenuPresentationalProps {
  isOpen: boolean;
  position: Position;
  items: MenuItem[];
  activeIndex: number | null;
}

export const RadialMenuPresentational = ({
  isOpen,
  position,
  items,
  activeIndex,
}: RadialMenuPresentationalProps) => {
  const radius = 100; // Distance from center to item center

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed z-[100]"
          style={{
            left: position.x,
            top: position.y,
            pointerEvents: 'none',
          }}
        >
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute rounded-full bg-neutral-900/80 backdrop-blur-md border border-white/10 w-12 h-12 flex items-center justify-center shadow-2xl"
            style={{ left: -24, top: -24 }}
          >
            <div className="w-2 h-2 bg-white/50 rounded-full" />
          </motion.div>

          {items.map((item, index) => {
            const count = items.length;
            const slice = 360 / count;

            const angleDeg = (index * slice) - 90;
            const angleRad = (angleDeg * Math.PI) / 180;

            const itemSize = 56; // w-14 = 56px
            const x = Math.cos(angleRad) * radius - itemSize / 2;
            const y = Math.sin(angleRad) * radius - itemSize / 2;

            const isActive = activeIndex === index;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0, x: -itemSize / 2, y: -itemSize / 2 }}
                animate={{
                  opacity: 1,
                  scale: isActive ? 1.2 : 1,
                  x,
                  y,
                }}
                exit={{ opacity: 0, scale: 0, x: -itemSize / 2, y: -itemSize / 2 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20
                }}
                className="absolute flex items-center justify-center"
              >
                <div
                  className={`
                      relative flex items-center justify-center w-14 h-14 rounded-full shadow-lg border transition-colors duration-200
                      ${isActive ? 'bg-white text-black border-white' : 'bg-neutral-800 text-white border-neutral-700'}
                    `}
                  style={{
                    backgroundColor: isActive ? item.color : undefined,
                    borderColor: isActive ? item.color : undefined,
                    color: isActive ? '#fff' : undefined
                  }}
                >
                  <span className="text-2xl">{item.emoji}</span>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-16 bg-black/80 text-white text-xs px-2 py-1 rounded backdrop-blur-md whitespace-nowrap"
                    >
                      {item.label}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </AnimatePresence>
  );
};
