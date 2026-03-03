import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: number;
  icon: React.ReactNode;
  color?: "amber" | "emerald" | "blue" | "purple" | "rose";
  delay?: number;
}

const colorClasses = {
  amber: {
    bg: "from-amber-500/10 to-amber-600/5",
    border: "border-amber-500/20",
    icon: "bg-amber-500/20 text-amber-400",
    trend: "text-amber-400",
  },
  emerald: {
    bg: "from-emerald-500/10 to-emerald-600/5",
    border: "border-emerald-500/20",
    icon: "bg-emerald-500/20 text-emerald-400",
    trend: "text-emerald-400",
  },
  blue: {
    bg: "from-blue-500/10 to-blue-600/5",
    border: "border-blue-500/20",
    icon: "bg-blue-500/20 text-blue-400",
    trend: "text-blue-400",
  },
  purple: {
    bg: "from-purple-500/10 to-purple-600/5",
    border: "border-purple-500/20",
    icon: "bg-purple-500/20 text-purple-400",
    trend: "text-purple-400",
  },
  rose: {
    bg: "from-rose-500/10 to-rose-600/5",
    border: "border-rose-500/20",
    icon: "bg-rose-500/20 text-rose-400",
    trend: "text-rose-400",
  },
};

export function KPICard({ title, value, subtitle, trend, icon, color = "amber", delay = 0 }: KPICardProps) {
  const classes = colorClasses[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`bg-gradient-to-br ${classes.bg} rounded-2xl p-4 sm:p-6 border ${classes.border} cursor-default`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${classes.icon} flex items-center justify-center`}>
          {icon}
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-sm ${trend > 0 ? 'text-emerald-400' : trend < 0 ? 'text-rose-400' : 'text-gray-400'}`}>
            {trend > 0 ? <TrendingUp className="w-4 h-4" /> : trend < 0 ? <TrendingDown className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
            <span className="font-medium">{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <p className="text-xs sm:text-sm text-gray-400 uppercase tracking-wider mb-1">{title}</p>
      <p className="text-2xl sm:text-3xl font-bold text-white">{value}</p>
      {subtitle && <p className="text-xs sm:text-sm text-gray-500 mt-1">{subtitle}</p>}
    </motion.div>
  );
}
