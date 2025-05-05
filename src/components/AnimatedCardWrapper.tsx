'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedCardWrapperProps {
  children: ReactNode;
}

export function AnimatedCardWrapper({ children }: AnimatedCardWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative z-10 mx-4 sm:mx-8 lg:mx-10 px-6 sm:px-10 py-2 sm:py-6 text-white bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] shadow-2xl shadow-[#38fdfd22] rounded-2xl"
    >
      {children}
    </motion.div>
  );
}
