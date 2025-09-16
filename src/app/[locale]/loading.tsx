import { useLocale } from 'next-intl';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="absolute inset-0 bg-mesh-gradient animate-mesh opacity-10 blur-3xl" />
      
      <div className="relative z-10 text-center">
        {/* Animated Logo */}
        <div className="w-20 h-20 mx-auto mb-8 relative">
          <div className="absolute inset-0 rounded-full bg-gradient-primary animate-ping opacity-20"></div>
          <div className="relative w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center">
            <svg className="w-10 h-10 text-white animate-pulse" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2L12 7L17 7L13 10L15 15L10 12L5 15L7 10L3 7L8 7L10 2Z" />
            </svg>
          </div>
        </div>

        {/* Loading Text */}
        <div className="space-y-2">
          <div className="h-2 w-32 bg-white/10 rounded-full mx-auto animate-pulse"></div>
          <div className="h-2 w-24 bg-white/10 rounded-full mx-auto animate-pulse delay-100"></div>
          <div className="h-2 w-28 bg-white/10 rounded-full mx-auto animate-pulse delay-200"></div>
        </div>
      </div>
    </div>
  );
}