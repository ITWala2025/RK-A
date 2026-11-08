"use client";

import React, { useState } from "react";
import { Bot, Sliders, History, Sparkles, RefreshCw, ArrowRight } from "lucide-react";
import {
  AgentSettingsCard,
  AgentAuditLogView,
  AgentCopilotCenter,
  useAgentCopilot,
} from "@/components/admin/AgentCopilotCenter";
import { useCompanyContext } from "@/contexts/CompanyContext";

export default function CopilotAdminPage() {
  const { selectedCompany } = useCompanyContext();
  const [activeTab, setActiveTab] = useState<"overview" | "settings" | "audit">("overview");
  const [isCenterOpen, setIsCenterOpen] = useState(false);
  const { insights, isRunning, scan, stats } = useAgentCopilot(selectedCompany?.id);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white shadow-lg border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg">
              <Bot className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold">Autonomous AI Agents &amp; Copilot Center</h1>
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Autonomous runtime monitoring for CT1 &amp; VAT3 tax deadlines, preliminary tax safe harbors,
                proprietary director Form 11 filings, deal margins, overdue collections, and expense anomalies.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={scan}
              disabled={isRunning}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center gap-1.5 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRunning ? "animate-spin text-indigo-400" : ""}`} />
              <span>{isRunning ? "Scanning..." : "Run Diagnostics"}</span>
            </button>
            <button
              onClick={() => setIsCenterOpen(true)}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Launch Copilot Slide-Over</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === "overview"
                ? "bg-indigo-600 text-white"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            Agent Insights &amp; Active Flags ({insights.length})
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
              activeTab === "settings"
                ? "bg-indigo-600 text-white"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Agent Governance &amp; Thresholds</span>
          </button>
          <button
            onClick={() => setActiveTab("audit")}
            className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
              activeTab === "audit"
                ? "bg-indigo-600 text-white"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Governance Audit Trail</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === "overview" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white border border-slate-200">
              <span className="text-[11px] font-semibold uppercase text-slate-500">Total Scanned Items</span>
              <p className="text-2xl font-bold text-slate-900 mt-1">{stats.totalScanned}</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200">
              <span className="text-[11px] font-semibold uppercase text-rose-600">Active Anomalies</span>
              <p className="text-2xl font-bold text-rose-700 mt-1">{stats.activeAnomalies}</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200">
              <span className="text-[11px] font-semibold uppercase text-indigo-600">Pending Review</span>
              <p className="text-2xl font-bold text-indigo-700 mt-1">{stats.pendingReview}</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200">
              <span className="text-[11px] font-semibold uppercase text-emerald-600">Actions Applied</span>
              <p className="text-2xl font-bold text-emerald-700 mt-1">{stats.appliedCount}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Active Proactive Recommendations</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Click &ldquo;Review Action&rdquo; to execute suggested workflows with human-in-the-loop review.
                </p>
              </div>
              <button
                onClick={() => setIsCenterOpen(true)}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                Open Full Slide-Over Drawer &rarr;
              </button>
            </div>

            {insights.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs">
                All systems optimal. No active risk flags or anomalies detected.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {insights.map((insight) => (
                  <div key={insight.id} className="py-3 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                          {insight.agentLabel}
                        </span>
                        <span className="text-xs font-bold text-slate-900">{insight.title}</span>
                      </div>
                      <p className="text-xs text-slate-600">{insight.description}</p>
                    </div>
                    <button
                      onClick={() => setIsCenterOpen(true)}
                      className="shrink-0 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                      Review Action
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "settings" && <AgentSettingsCard />}

      {activeTab === "audit" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900">Governance &amp; Audit Trail</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Immutable ledger of autonomous agent discoveries, drafted reminders, and operator actions.
            </p>
          </div>
          <AgentAuditLogView />
        </div>
      )}

      {/* Slide-over Drawer */}
      <AgentCopilotCenter
        isOpen={isCenterOpen}
        onClose={() => setIsCenterOpen(false)}
        companyId={selectedCompany?.id}
      />
    </div>
  );
}

