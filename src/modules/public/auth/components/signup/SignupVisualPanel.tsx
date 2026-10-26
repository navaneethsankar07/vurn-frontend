export function SignupVisualPanel() {
  return (
    <div className="relative hidden lg:flex h-full w-full items-center justify-center overflow-hidden border-l border-white/10 bg-black p-12">
      <svg
        className="absolute inset-0 h-full w-full stroke-primary/20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g strokeDasharray="3 3" strokeWidth="1" fill="none">
          <circle cx="50%" cy="50%" r="12%" />
          <circle cx="50%" cy="50%" r="26%" />
          <circle cx="50%" cy="50%" r="42%" />
          <circle cx="50%" cy="50%" r="60%" />

          <line x1="50%" y1="0%" x2="50%" y2="100%" />
          <line x1="0%" y1="50%" x2="100%" y2="50%" />

          <line x1="0%" y1="0%" x2="100%" y2="100%" />
          <line x1="100%" y1="0%" x2="0%" y2="100%" />

          <line x1="25%" y1="0%" x2="75%" y2="100%" />
          <line x1="75%" y1="0%" x2="25%" y2="100%" />
          <line x1="0%" y1="25%" x2="100%" y2="75%" />
          <line x1="0%" y1="75%" x2="100%" y2="25%" />
        </g>
      </svg>

      <div className="relative z-10 max-w-xl text-center">
        <h2 className="text-2xl font-bold tracking-tight sm:text-5xl lg:text-5xl text-white leading-[1.1]">
          The Operating System <br />
          for <span className="text-primary">Modern Engineering</span>
        </h2>

        <p className="mt-6 text-base text-gray-400 font-normal">
          Build software with precision. Ship with confidence.
        </p>
      </div>
    </div>
  );
}