"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useOnboarding } from "@/hooks/useOnboarding";
import { Sparkles, ArrowRight, Zap } from "lucide-react";

interface OnboardingOverlayProps {
  onComplete: () => void;
}

export default function OnboardingOverlay({ onComplete }: OnboardingOverlayProps) {
  const { isFirstVisit } = useOnboarding();

  return (
    <AnimatePresence>
      {isFirstVisit === true && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="max-w-lg w-full bg-safarigray border border-safariborder rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_-12px_rgba(0,255,159,0.3)]"
          >
            <div className="relative h-56 bg-gradient-to-br from-neon/20 via-transparent to-blue/20 flex items-center justify-center">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neon/10 via-transparent to-transparent" />
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  ease: "easeInOut" 
                }}
              >
                <Sparkles className="w-20 h-20 text-neon drop-shadow-[0_0_15px_rgba(0,255,159,0.5)]" />
              </motion.div>
            </div>

            <div className="p-10 text-center relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-safarigray border border-safariborder rounded-full flex items-center justify-center shadow-xl">
                 <Zap className="w-10 h-10 text-neon" />
              </div>

              <h2 className="text-4xl font-black font-display text-white mb-4 mt-4">
                Welcome to the <span className="text-neon">Future</span>
              </h2>
              <p className="text-gray-400 text-lg mb-10 leading-relaxed">
                Elevate your tech experience with Kenya&apos;s most advanced electronics marketplace.
              </p>

              <button
                onClick={onComplete}
                className="w-full group relative bg-neon hover:bg-neon-dim text-black font-black py-5 rounded-2xl transition-all duration-300 overflow-hidden"
              >
                <div className="relative z-10 flex items-center justify-center gap-3 text-lg">
                  Get Started
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </button>
              
              <p className="mt-6 text-xs text-gray-500 font-medium uppercase tracking-widoid">
                Experience the Safaritech standard
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
