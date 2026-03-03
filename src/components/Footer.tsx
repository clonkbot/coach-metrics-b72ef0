import { motion } from "framer-motion";

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
      className="mt-auto py-6 sm:py-8 border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs sm:text-sm text-gray-600">
          Requested by{" "}
          <a
            href="https://twitter.com/michaelonsol"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-amber-400 transition-colors"
          >
            @michaelonsol
          </a>
          {" · "}
          Built by{" "}
          <a
            href="https://twitter.com/clonkbot"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-amber-400 transition-colors"
          >
            @clonkbot
          </a>
        </p>
      </div>
    </motion.footer>
  );
}
