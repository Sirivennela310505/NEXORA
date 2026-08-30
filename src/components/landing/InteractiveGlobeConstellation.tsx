import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  z: number;
  radius: number;
  color: string;
  glowColor: string;
  label?: string;
  badgeBg?: string;
}

export const InteractiveGlobeConstellation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 550);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Problem-Statement Solution Nodes (Goal finding, clear paths, skill gaps, free lessons)
    const keyTopics: { name: string; color: string; glow: string }[] = [
      { name: '🎯 Find Goal by Interest', color: '#00f2fe', glow: 'rgba(0, 242, 254, 0.9)' },
      { name: '🗺️ Clear Learning Paths', color: '#38bdf8', glow: 'rgba(56, 189, 248, 0.9)' },
      { name: '⚡ Diagnostic Skill Check', color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.9)' },
      { name: '🧩 Bridge Foundation Gaps', color: '#f43f5e', glow: 'rgba(244, 63, 94, 0.9)' },
      { name: '🎥 Free Video Lessons', color: '#10b981', glow: 'rgba(16, 185, 129, 0.9)' },
      { name: '📊 Interactive Flowchart', color: '#a855f7', glow: 'rgba(168, 85, 247, 0.9)' },
      { name: '🚀 Next Best Daily Action', color: '#6366f1', glow: 'rgba(99, 102, 241, 0.9)' },
      { name: '🎓 College & Career Readiness', color: '#14b8a6', glow: 'rgba(20, 184, 166, 0.9)' }
    ];

    const particleCount = 85;
    const globeRadius = Math.min(width, height) * 0.35;
    const particles: Particle[] = [];

    // Create 3D particles on a sphere surface
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.acos(2 * Math.random() - 1);
      const phi = 2 * Math.PI * Math.random();

      const x = globeRadius * Math.sin(theta) * Math.cos(phi);
      const y = globeRadius * Math.sin(theta) * Math.sin(phi);
      const z = globeRadius * Math.cos(theta);

      const isKey = i < keyTopics.length;
      const topic = isKey ? keyTopics[i] : null;

      particles.push({
        x,
        y,
        z,
        radius: isKey ? 4.5 : 2.2,
        color: topic ? topic.color : '#38bdf8',
        glowColor: topic ? topic.glow : 'rgba(56, 189, 248, 0.6)',
        label: topic?.name
      });
    }

    let angleX = 0.003;
    let angleY = 0.006;
    let mouseX = 0;
    let mouseY = 0;
    let isHovered = false;

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / width - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / height - 0.5) * 2;
      isHovered = true;
    };

    const onMouseLeave = () => {
      isHovered = false;
    };

    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseleave', onMouseLeave);

    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      // Draw central radiant radial glow
      const cx = width / 2;
      const cy = height / 2;
      const gradient = ctx.createRadialGradient(cx, cy, 10, cx, cy, globeRadius * 1.3);
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0.22)');
      gradient.addColorStop(0.5, 'rgba(6, 182, 212, 0.1)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Rotation angles
      const rotY = isHovered ? mouseY * 0.012 : angleY;
      const rotX = isHovered ? mouseX * 0.012 : angleX;

      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      // Rotate particles
      const projected = particles.map((p) => {
        let x1 = p.x * cosY - p.z * sinY;
        let z1 = p.z * cosY + p.x * sinY;

        let y1 = p.y * cosX - z1 * sinX;
        let z2 = z1 * cosX + p.y * sinX;

        p.x = x1;
        p.y = y1;
        p.z = z2;

        const fov = 420;
        const scale = fov / (fov + z2);
        const px = cx + x1 * scale;
        const py = cy + y1 * scale;
        const alpha = Math.max(0.2, (z2 + globeRadius) / (2 * globeRadius));

        return {
          px,
          py,
          scale,
          alpha,
          radius: p.radius * scale,
          color: p.color,
          glowColor: p.glowColor,
          label: p.label,
          z: z2
        };
      });

      // Depth sorting
      projected.sort((a, b) => a.z - b.z);

      // Draw glowing constellation filaments
      ctx.lineWidth = 1.0;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const dx = projected[i].px - projected[j].px;
          const dy = projected[i].py - projected[j].py;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 85) {
            const lineAlpha = (1 - dist / 85) * Math.min(projected[i].alpha, projected[j].alpha) * 0.65;
            const strokeGrad = ctx.createLinearGradient(
              projected[i].px, projected[i].py,
              projected[j].px, projected[j].py
            );
            strokeGrad.addColorStop(0, projected[i].color);
            strokeGrad.addColorStop(1, projected[j].color);
            ctx.strokeStyle = strokeGrad;
            ctx.globalAlpha = lineAlpha;
            ctx.beginPath();
            ctx.moveTo(projected[i].px, projected[i].py);
            ctx.lineTo(projected[j].px, projected[j].py);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1.0;

      // Draw particle points & labels
      projected.forEach((pt) => {
        // Outer glowing corona
        ctx.beginPath();
        ctx.arc(pt.px, pt.py, pt.radius * 2.8, 0, Math.PI * 2);
        ctx.fillStyle = pt.glowColor.replace('0.9', `${pt.alpha * 0.3}`);
        ctx.fill();

        // Inner solid luminous dot
        ctx.beginPath();
        ctx.arc(pt.px, pt.py, pt.radius, 0, Math.PI * 2);
        ctx.fillStyle = pt.color;
        ctx.shadowColor = pt.color;
        ctx.shadowBlur = 10 * pt.alpha;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Topic badge for front-facing nodes
        if (pt.label && pt.alpha > 0.55) {
          const text = pt.label;
          ctx.font = 'bold 10px system-ui, sans-serif';
          const textWidth = ctx.measureText(text).width;
          const tagX = pt.px + 9;
          const tagY = pt.py - 10;
          const padX = 6;

          // Badge pill background
          ctx.fillStyle = 'rgba(8, 14, 28, 0.88)';
          ctx.strokeStyle = pt.color;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.roundRect(tagX - padX, tagY - 9, textWidth + padX * 2, 16, 6);
          ctx.fill();
          ctx.stroke();

          // Badge text
          ctx.fillStyle = '#ffffff';
          ctx.fillText(text, tagX, tagY + 3);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative w-full h-[380px] sm:h-[430px] lg:h-[450px] flex items-center justify-center overflow-hidden bg-transparent group">
      
      {/* Canvas */}
      <canvas ref={canvasRef} className="w-full h-full cursor-grab active:cursor-grabbing block" />

      {/* Floating HUD status bar */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/[0.08] text-xs pointer-events-none whitespace-nowrap">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        <span className="font-mono text-cyan-300 text-[11px] font-bold">
          Interactive 3D Prerequisite Graph
        </span>
        <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
          • Drag to rotate
        </span>
      </div>
    </div>
  );
};
