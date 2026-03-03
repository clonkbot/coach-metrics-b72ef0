import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { motion } from "framer-motion";
import {
  Users, DollarSign, Target, Calendar, TrendingUp,
  BarChart3, PieChart, Activity, RefreshCw, Zap
} from "lucide-react";
import { KPICard } from "./KPICard";
import { GHLConnect } from "./GHLConnect";
import { useState } from "react";

function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value.toLocaleString()}`;
}

function formatNumber(value: number): string {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toLocaleString();
}

export function Dashboard() {
  const connection = useQuery(api.ghlConnections.get);
  const kpis = useQuery(api.kpis.getLatest);
  const createSnapshot = useMutation(api.kpis.createDemoSnapshot);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    if (!connection) return;
    setIsSyncing(true);
    try {
      await createSnapshot();
    } finally {
      setTimeout(() => setIsSyncing(false), 1000);
    }
  };

  if (connection === undefined || kpis === undefined) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-white/5 rounded-2xl" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-40 bg-white/5 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 text-sm sm:text-base">
            {connection ? "Your coaching business at a glance" : "Connect GoHighLevel to get started"}
          </p>
        </div>
        {connection && kpis && (
          <motion.button
            onClick={handleSync}
            disabled={isSyncing}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-all text-sm font-medium"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing...' : 'Sync Now'}
          </motion.button>
        )}
      </motion.div>

      {/* Connection Card */}
      <div className="mb-6 sm:mb-8">
        <GHLConnect />
      </div>

      {/* KPIs Grid */}
      {kpis && (
        <>
          {/* Primary KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <KPICard
              title="Total Revenue"
              value={formatCurrency(kpis.totalRevenue)}
              subtitle={`${formatCurrency(kpis.revenueThisMonth)} this month`}
              trend={12}
              icon={<DollarSign className="w-5 h-5 sm:w-6 sm:h-6" />}
              color="emerald"
              delay={0.1}
            />
            <KPICard
              title="Total Leads"
              value={formatNumber(kpis.totalLeads)}
              subtitle={`+${kpis.newLeadsToday} today`}
              trend={8}
              icon={<Users className="w-5 h-5 sm:w-6 sm:h-6" />}
              color="blue"
              delay={0.2}
            />
            <KPICard
              title="Conversion Rate"
              value={`${kpis.conversionRate.toFixed(1)}%`}
              subtitle={`${kpis.dealsWon} deals won`}
              trend={3}
              icon={<Target className="w-5 h-5 sm:w-6 sm:h-6" />}
              color="amber"
              delay={0.3}
            />
            <KPICard
              title="Pipeline Value"
              value={formatCurrency(kpis.pipelineValue)}
              subtitle={`${kpis.dealsClosed} in progress`}
              trend={-2}
              icon={<TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />}
              color="purple"
              delay={0.4}
            />
          </div>

          {/* Secondary KPIs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8"
          >
            {/* Appointments Card */}
            <div className="bg-white/5 rounded-2xl p-4 sm:p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-white">Appointments</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Booked</span>
                  <span className="text-white font-semibold">{kpis.appointmentsBooked}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Completed</span>
                  <span className="text-emerald-400 font-semibold">{kpis.appointmentsCompleted}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">No-Show Rate</span>
                  <span className={`font-semibold ${kpis.noShowRate > 20 ? 'text-rose-400' : 'text-amber-400'}`}>
                    {kpis.noShowRate.toFixed(1)}%
                  </span>
                </div>
                <div className="pt-4 border-t border-white/10">
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(kpis.appointmentsCompleted / kpis.appointmentsBooked) * 100}%` }}
                      transition={{ delay: 0.8, duration: 0.8 }}
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {((kpis.appointmentsCompleted / kpis.appointmentsBooked) * 100).toFixed(0)}% completion rate
                  </p>
                </div>
              </div>
            </div>

            {/* Leads Breakdown */}
            <div className="bg-white/5 rounded-2xl p-4 sm:p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-white">Lead Activity</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400 text-sm">Today</span>
                    <span className="text-white font-semibold">+{kpis.newLeadsToday}</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(kpis.newLeadsToday / 20) * 100}%` }}
                      transition={{ delay: 0.9, duration: 0.8 }}
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400 text-sm">This Week</span>
                    <span className="text-white font-semibold">+{kpis.newLeadsThisWeek}</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(kpis.newLeadsThisWeek / 100) * 100}%` }}
                      transition={{ delay: 1.0, duration: 0.8 }}
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400 text-sm">This Month</span>
                    <span className="text-white font-semibold">+{kpis.newLeadsThisMonth}</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(kpis.newLeadsThisMonth / 250) * 100}%` }}
                      transition={{ delay: 1.1, duration: 0.8 }}
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Revenue Metrics */}
            <div className="bg-white/5 rounded-2xl p-4 sm:p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <PieChart className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-white">Revenue Metrics</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Avg. Deal Value</span>
                  <span className="text-white font-semibold">{formatCurrency(kpis.averageDealValue)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">This Month</span>
                  <span className="text-emerald-400 font-semibold">{formatCurrency(kpis.revenueThisMonth)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Deals Won</span>
                  <span className="text-white font-semibold">{kpis.dealsWon}</span>
                </div>
                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span className="text-xs text-gray-400">
                      Projected: <span className="text-white font-medium">{formatCurrency(kpis.revenueThisMonth * 1.2)}</span> EOQ
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Engagement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
          >
            <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 rounded-2xl p-4 sm:p-6 border border-purple-500/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-white">Active Contacts</h3>
                  <p className="text-xs text-gray-400">Engaged in last 30 days</p>
                </div>
              </div>
              <p className="text-3xl sm:text-4xl font-bold text-white mb-2">{formatNumber(kpis.activeContacts)}</p>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-emerald-400">+12%</span>
                <span className="text-gray-500">from last month</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-rose-500/10 to-rose-600/5 rounded-2xl p-4 sm:p-6 border border-rose-500/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-rose-400" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-white">Outreach</h3>
                  <p className="text-xs text-gray-400">Contacts reached this month</p>
                </div>
              </div>
              <p className="text-3xl sm:text-4xl font-bold text-white mb-2">{formatNumber(kpis.contactsReachedOut)}</p>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-amber-400">{((kpis.contactsReachedOut / kpis.activeContacts) * 100).toFixed(0)}%</span>
                <span className="text-gray-500">of active contacts</span>
              </div>
            </div>
          </motion.div>
        </>
      )}

      {/* Empty State */}
      {!kpis && connection && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-amber-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No data yet</h3>
          <p className="text-gray-400 mb-6">Click "Sync Now" to pull data from GoHighLevel</p>
          <motion.button
            onClick={handleSync}
            disabled={isSyncing}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-amber-500 to-orange-500 text-black font-semibold px-6 py-3 rounded-xl"
          >
            Sync Data
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
