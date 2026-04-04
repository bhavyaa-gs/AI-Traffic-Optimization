import React, { useState } from 'react';
import { Settings, Shield, User, Bell, Database, Save, Loader2, CheckCircle } from 'lucide-react';

export default function SystemManagement() {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1500);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-10">
        <div className="p-4 bg-blue-500/20 rounded-2xl">
          <Settings className="text-blue-500" size={32} />
        </div>
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">System Management</h2>
          <p className="text-zinc-500 text-sm font-medium">Configure core infrastructure and security parameters</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-8">
              <Shield className="text-blue-500" size={20} />
              <h3 className="text-lg font-bold text-white">Security & Access Control</h3>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-zinc-800/50">
                <div>
                  <div className="text-sm font-bold text-white mb-1">Two-Factor Authentication</div>
                  <div className="text-xs text-zinc-500">Require 2FA for all administrative actions</div>
                </div>
                <div className="w-12 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-lg" />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-zinc-800/50">
                <div>
                  <div className="text-sm font-bold text-white mb-1">IP Whitelisting</div>
                  <div className="text-xs text-zinc-500">Restrict dashboard access to corporate IP ranges</div>
                </div>
                <div className="w-12 h-6 bg-zinc-800 rounded-full relative cursor-pointer">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-zinc-500 rounded-full shadow-lg" />
                </div>
              </div>
            </div>
          </section>

          <section className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-8">
              <Database className="text-blue-500" size={20} />
              <h3 className="text-lg font-bold text-white">Data Retention & AI Training</h3>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Historical Data Retention (Days)</label>
                <select className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-colors">
                  <option>30 Days</option>
                  <option>90 Days</option>
                  <option>180 Days</option>
                  <option>365 Days</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-zinc-800/50">
                <div>
                  <div className="text-sm font-bold text-white mb-1">Continuous AI Training</div>
                  <div className="text-xs text-zinc-500">Automatically retrain models using new traffic patterns</div>
                </div>
                <div className="w-12 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-lg" />
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <div className="bg-blue-600 rounded-3xl p-8 text-white">
            <h3 className="text-xl font-black uppercase mb-4 leading-tight">System <br />Status: Optimal</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm border-b border-white/20 pb-2">
                <span className="opacity-70">Uptime</span>
                <span className="font-bold">99.98%</span>
              </div>
              <div className="flex items-center justify-between text-sm border-b border-white/20 pb-2">
                <span className="opacity-70">Latency</span>
                <span className="font-bold">24ms</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="opacity-70">Active Nodes</span>
                <span className="font-bold">128</span>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8">
            <h3 className="text-sm font-bold text-white mb-6">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-xs font-bold text-white transition-colors">
                Clear System Cache
              </button>
              <button className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-xs font-bold text-white transition-colors">
                Export Audit Logs
              </button>
              <button className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 rounded-xl text-xs font-bold text-red-500 transition-colors">
                Emergency Shutdown
              </button>
            </div>
          </div>

          <button 
            onClick={handleSave}
            disabled={loading}
            className="w-full py-4 bg-white hover:bg-blue-500 hover:text-white text-black font-black uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-3"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : saved ? <CheckCircle size={20} /> : <Save size={20} />}
            {loading ? 'Saving...' : saved ? 'Changes Saved' : 'Apply Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}
