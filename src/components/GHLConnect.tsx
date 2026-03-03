import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { motion } from "framer-motion";
import { Link2, Key, Building2, ArrowRight, CheckCircle2, Unlink } from "lucide-react";

export function GHLConnect() {
  const connection = useQuery(api.ghlConnections.get);
  const connect = useMutation(api.ghlConnections.connect);
  const disconnect = useMutation(api.ghlConnections.disconnect);
  const createDemoSnapshot = useMutation(api.kpis.createDemoSnapshot);

  const [locationId, setLocationId] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [agencyName, setAgencyName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await connect({ locationId, apiKey, agencyName: agencyName || undefined });
      // Create demo data for now (in production, this would sync from GHL)
      await createDemoSnapshot();
      setShowForm(false);
      setLocationId("");
      setApiKey("");
      setAgencyName("");
    } catch (error) {
      console.error("Failed to connect:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setIsLoading(true);
    try {
      await disconnect();
    } finally {
      setIsLoading(false);
    }
  };

  if (connection === undefined) {
    return (
      <div className="bg-white/5 rounded-2xl p-6 sm:p-8 border border-white/10 animate-pulse">
        <div className="h-6 bg-white/10 rounded w-48 mb-4" />
        <div className="h-4 bg-white/5 rounded w-full" />
      </div>
    );
  }

  if (connection && !showForm) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-emerald-500/10 to-green-600/5 rounded-2xl p-6 sm:p-8 border border-emerald-500/20"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                {connection.agencyName || "GoHighLevel Connected"}
              </h3>
              <p className="text-sm text-emerald-400/80">
                Location: {connection.locationId}
              </p>
            </div>
          </div>
          <button
            onClick={handleDisconnect}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition-colors text-sm"
          >
            <Unlink className="w-4 h-4" />
            Disconnect
          </button>
        </div>
        {connection.lastSyncAt && (
          <p className="mt-4 text-xs text-gray-500">
            Last synced: {new Date(connection.lastSyncAt).toLocaleString()}
          </p>
        )}
      </motion.div>
    );
  }

  if (!showForm && !connection) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-amber-500/10 to-orange-600/5 rounded-2xl p-6 sm:p-8 border border-amber-500/20"
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
            <Link2 className="w-8 h-8 text-black" />
          </div>
          <div className="flex-grow">
            <h3 className="text-xl font-bold text-white mb-2">Connect GoHighLevel</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Link your GoHighLevel account to start tracking leads, conversions, appointments, and revenue in real-time.
            </p>
          </div>
          <motion.button
            onClick={() => setShowForm(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-shrink-0 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-semibold px-6 py-3 rounded-xl flex items-center gap-2 hover:shadow-lg hover:shadow-amber-500/25 transition-all"
          >
            Connect
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 rounded-2xl p-6 sm:p-8 border border-white/10"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Connect GoHighLevel</h3>
        <button
          onClick={() => setShowForm(false)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleConnect} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Agency/Business Name (optional)
          </label>
          <input
            type="text"
            value={agencyName}
            onChange={(e) => setAgencyName(e.target.value)}
            placeholder="My Coaching Business"
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
            <Link2 className="w-4 h-4" />
            Location ID
          </label>
          <input
            type="text"
            value={locationId}
            onChange={(e) => setLocationId(e.target.value)}
            required
            placeholder="abc123xyz"
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all"
          />
          <p className="text-xs text-gray-500">
            Find this in GHL Settings → Business Profile → Location ID
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
            <Key className="w-4 h-4" />
            API Key
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            required
            placeholder="••••••••••••••••"
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all"
          />
          <p className="text-xs text-gray-500">
            Generate in GHL Settings → API Keys
          </p>
        </div>

        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-black font-semibold py-4 rounded-xl flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-amber-500/25 transition-all disabled:opacity-50"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
          ) : (
            <>
              Connect & Sync Data
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}
