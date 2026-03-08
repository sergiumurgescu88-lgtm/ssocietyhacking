import { Shield } from "lucide-react";

const positions = [
  { top: "12%", left: "8%", size: 20, delay: 0, duration: 6 },
  { top: "25%", right: "12%", size: 16, delay: 1.5, duration: 7 },
  { top: "60%", left: "15%", size: 14, delay: 3, duration: 5 },
  { top: "70%", right: "20%", size: 22, delay: 0.8, duration: 8 },
  { top: "40%", left: "75%", size: 12, delay: 2.2, duration: 6 },
  { top: "15%", left: "55%", size: 18, delay: 4, duration: 7 },
];

const FloatingShields = () => {
  return (
    <>
      {positions.map((pos, i) => (
        <div
          key={i}
          className="absolute pointer-events-none animate-float-shield"
          style={{
            top: pos.top,
            left: pos.left,
            right: pos.right,
            animationDelay: `${pos.delay}s`,
            animationDuration: `${pos.duration}s`,
          }}
        >
          <Shield
            className="text-primary/10"
            style={{ width: pos.size, height: pos.size }}
          />
        </div>
      ))}
    </>
  );
};

export default FloatingShields;
