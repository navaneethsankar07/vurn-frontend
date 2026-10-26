import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Node {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  baseZ: number;
  vx: number;
  vy: number;
  vz: number;
}

export function NotFoundPage() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const cols = 28;
    const rows = 16;
    const spacingX = width / (cols + 1);
    const spacingY = height / (rows + 1);

    const nodes: Node[] = [];

    for (let r = 0; r <= rows; r++) {
      for (let c = 0; c <= cols; c++) {
        const x = c * spacingX + (width - cols * spacingX) / 2;
        const y = r * spacingY + (height - rows * spacingY) / 2;
        nodes.push({
          x,
          y,
          z: 0,
          baseX: x,
          baseY: y,
          baseZ: 0,
          vx: 0,
          vy: 0,
          vz: 0,
        });
      }
    }

    let mouseX = -1000;
    let mouseY = -1000;
    let targetMouseX = width / 2;
    let targetMouseY = height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        targetMouseX = e.touches[0].clientX;
        targetMouseY = e.touches[0].clientY;
      }
    };
    window.addEventListener("touchmove", handleTouchMove);

    let angle = 0;

    const render = () => {
      mouseX += (targetMouseX - mouseX) * 0.1;
      mouseY += (targetMouseY - mouseY) * 0.1;

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#09090b";
      ctx.fillRect(0, 0, width, height);

      angle += 0.015;

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        const wave =
          Math.sin(angle + node.baseX * 0.005) *
          Math.cos(angle + node.baseY * 0.005) *
          15;

        const dx = mouseX - node.baseX;
        const dy = mouseY - node.baseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 200;

        let pushX = 0;
        let pushY = 0;
        let pushZ = 0;

        if (dist < maxDist) {
          const force = (1 - dist / maxDist) * 35;
          const theta = Math.atan2(dy, dx);
          pushX = -Math.cos(theta) * force * 1.5;
          pushY = -Math.sin(theta) * force * 1.5;
          pushZ = force * 2;
        }

        const targetX = node.baseX + pushX;
        const targetY = node.baseY + pushY + wave;
        const targetZ = node.baseZ + pushZ + wave * 0.5;

        node.x += (targetX - node.x) * 0.1;
        node.y += (targetY - node.y) * 0.1;
        node.z += (targetZ - node.z) * 0.1;

        const depthFactor = (node.z + 50) / 70;
        const radius = Math.max(1, 1.5 * depthFactor);

        ctx.fillStyle =
          dist < maxDist
            ? `rgba(255, 255, 255, ${Math.min(1, 0.3 + depthFactor * 0.4)})`
            : "rgba(255, 255, 255, 0.15)";
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
      ctx.lineWidth = 0.5;
      for (let r = 0; r <= rows; r++) {
        ctx.beginPath();
        for (let c = 0; c <= cols; c++) {
          const node = nodes[r * (cols + 1) + c];
          if (c === 0) ctx.moveTo(node.x, node.y);
          else ctx.lineTo(node.x, node.y);
        }
        ctx.stroke();
      }

      for (let c = 0; c <= cols; c++) {
        ctx.beginPath();
        for (let r = 0; r <= rows; r++) {
          const node = nodes[r * (cols + 1) + c];
          if (r === 0) ctx.moveTo(node.x, node.y);
          else ctx.lineTo(node.x, node.y);
        }
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center p-6 font-mono select-none relative overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-0"
      />

      <div className="max-w-xl w-full space-y-8 relative z-10 text-center">
        <div className="space-y-6">
          <div className="relative inline-block animate-pulse">
            <span className="text-8xl sm:text-9xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-white via-zinc-400 to-zinc-700 font-mono select-none drop-shadow-2xl">
              404
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-lg sm:text-xl font-bold text-white font-sans tracking-tight">
              Page not found
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 font-sans max-w-md mx-auto leading-relaxed">
              Sorry, we couldn't find the page you're looking for.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            type="button"
            onClick={() => navigate(-1)}
            variant="outline"
            className="w-full sm:w-auto h-10 px-6 border-white/10 bg-black/60 backdrop-blur-md text-zinc-300 hover:bg-white/5 hover:text-white font-semibold text-xs rounded-xs cursor-pointer font-mono"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Go Back
          </Button>
          <Button
            type="button"
            onClick={() => navigate("/")}
            className="w-full sm:w-auto h-10 px-6 bg-transparent text-primary/80 border border-primary/50 hover:bg-transparent hover:text-primary hover:border-primary/70 font-semibold text-xs rounded-xs cursor-pointer font-mono shadow-lg shadow-primary/10"
          >
            <Home className="h-4 w-4 mr-2" /> Take Me Home
          </Button>
        </div>
      </div>
    </div>
  );
}
