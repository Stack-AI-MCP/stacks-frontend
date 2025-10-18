import { motion } from "framer-motion";
import Image from "next/image";

export const Greeting = () => {
  return (
    <div
      key="overview"
      className="max-w-3xl mx-auto md:mt-20 px-4 sm:px-6 md:px-8 w-full min-w-0 flex flex-col justify-center gap-2"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.5 }}
        className="text-2xl sm:text-3xl font-semibold bg-gradient-accent bg-clip-text text-transparent flex flex-row gap-2 items-center"
      >
        <Image
          src="/images/stacks.png"
          alt="StacksAI"
          width={32}
          height={32}
          className="sm:w-10 sm:h-10 md:w-10 md:h-10 animate-pulse-slow flex-shrink-0"
        />
        <h1 className="font-semibold bg-gradient-accent bg-clip-text text-transparent break-words">StacksAI</h1>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.6 }}
        className="text-base sm:text-lg md:text-xl text-text-muted break-words"
      >
        Talk to Bitcoin. Trade, lend, stack - through conversation.
      </motion.div>
    </div>
  );
};
