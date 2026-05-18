import React, { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'motion/react';

const NUM_GECKOS = 15;

const Gecko: React.FC<{ mousePosRef: React.MutableRefObject<{x: number, y: number}> }> = ({ mousePosRef }) => {
  const controls = useAnimation();
  const position = useRef({
    x: typeof window !== 'undefined' ? Math.random() * window.innerWidth : 500,
    y: typeof window !== 'undefined' ? Math.random() * window.innerHeight : 500,
    angle: Math.random() * 360
  });

  useEffect(() => {
    let isActive = true;
    let timeoutId: NodeJS.Timeout;

    const move = async () => {
      if (!isActive) return;

      const { x: cx, y: cy, angle: currentAngle } = position.current;
      const { x: mx, y: my } = mousePosRef.current;

      const dxMouse = cx - mx;
      const dyMouse = cy - my;
      const distMouse = Math.hypot(dxMouse, dyMouse);

      let targetX, targetY, speed;

      // React to cursor: run away if close (< 150px)
      if (distMouse < 150) {
        const escapeAngle = Math.atan2(dyMouse, dxMouse);
        targetX = cx + Math.cos(escapeAngle) * (150 - distMouse + 50);
        targetY = cy + Math.sin(escapeAngle) * (150 - distMouse + 50);
        speed = 400; // fast
      } else {
        // Wander randomly
        const wanderAngle = (currentAngle + (Math.random() - 0.5) * 120) * (Math.PI / 180);
        targetX = cx + Math.cos(wanderAngle) * (50 + Math.random() * 100);
        targetY = cy + Math.sin(wanderAngle) * (50 + Math.random() * 100);
        speed = 50; // slow
      }

      // Keep in bounds
      const padding = 20;
      targetX = Math.max(padding, Math.min(window.innerWidth - padding, targetX));
      targetY = Math.max(padding, Math.min(window.innerHeight - padding, targetY));

      const dx = targetX - cx;
      const dy = targetY - cy;
      
      // If blocked by wall, turn around
      if (Math.hypot(dx, dy) < 5 && distMouse >= 150) {
         position.current.angle += 180;
         timeoutId = setTimeout(move, 100);
         return;
      }

      let targetAngle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
      
      const deltaAngle = ((targetAngle - currentAngle + 540) % 360) - 180;
      targetAngle = currentAngle + deltaAngle;

      const dist = Math.hypot(dx, dy);
      const duration = dist / speed;

      position.current = { x: targetX, y: targetY, angle: targetAngle };

      controls.start({
        x: targetX,
        y: targetY,
        rotate: targetAngle,
        transition: { duration: Math.max(duration, 0.2), ease: "linear" }
      });

      const waitTime = distMouse < 150 ? duration * 1000 : duration * 1000 + Math.random() * 2000;
      timeoutId = setTimeout(move, waitTime);
    };

    controls.set({ x: position.current.x, y: position.current.y, rotate: position.current.angle });
    move();

    return () => {
      isActive = false;
      clearTimeout(timeoutId);
    };
  }, [controls, mousePosRef]);

  return (
    <motion.div 
      animate={controls} 
      className="absolute pointer-events-none opacity-20 text-gecko-green"
      style={{ width: '32px', height: '32px', originX: 0.5, originY: 0.5, marginLeft: '-16px', marginTop: '-16px' }}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full drop-shadow-md">
        <circle cx="12" cy="5" r="2" />
        <path d="M12 7v7c0 3 3 3 3 6" />
        <path d="M12 8L8 6l-1 2" />
        <path d="M12 8l4-2 1 2" />
        <path d="M12 13l-4 2-1-2" />
        <path d="M12 13l4 2 1-2" />
      </svg>
    </motion.div>
  );
};

export const AnimatedGecko = () => {
  const mousePosRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {Array.from({ length: NUM_GECKOS }).map((_, i) => (
        <Gecko key={i} mousePosRef={mousePosRef} />
      ))}
    </div>
  );
};
