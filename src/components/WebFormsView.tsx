import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  FileText, 
  ExternalLink, 
  Copy, 
  Check, 
  Sparkles, 
  ArrowRight, 
  Code, 
  Trash2,
  RefreshCw,
  Settings,
  AlertCircle,
  CheckCircle2,
  Link2,
  RotateCcw,
  Bot
} from 'lucide-react';
import { WebForm, FormSubmission, GoogleFormSyncConfig, Opportunity, Contact } from '../types';

interface WebFormsViewProps {
  webForms: WebForm[];
  submissions: FormSubmission[];
  googleSyncConfig: GoogleFormSyncConfig;
  onUpdateGoogleSyncConfig: (config: GoogleFormSyncConfig) => void;
  onSyncGoogleForm: () => Promise<{ success: boolean; count: number; message: string }>;
  onResetGoogleFormImport: () => void;
  onOpenBuilder: () => void;
  onOpenPublicTest: (formId: string) => void;
  onDeleteForm: (formId: string) => void;
  toastMessage: string | null;
}

export const WebFormsView: React.FC<WebFormsViewProps> = ({
  webForms,
  submissions,
  googleSyncConfig,
  onUpdateGoogleSyncConfig,
  onSyncGoogleForm,
  onResetGoogleFormImport,
  onOpenBuilder,
  onOpenPublicTest,
  onDeleteForm,
  toastMessage,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [scriptUrlInput, setScriptUrlInput] = useState(googleSyncConfig.scriptUrl);
  const [autoSyncToggle, setAutoSyncToggle] = useState(googleSyncConfig.autoSync);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);

  // AI Business Plan generator state
  const [aiPrompt, setAiPrompt] = useState('Draft a high-conversion sales strategy for our Q4 pipeline');
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  useEffect(() => {
    setScriptUrlInput(googleSyncConfig.scriptUrl);
    setAutoSyncToggle(googleSyncConfig.autoSync);
  }, [googleSyncConfig]);

  const handleCopyLink = (formId: string) => {
    const link = `${window.location.origin}/form/${formId}?utm_source=website&utm_medium=direct`;
    navigator.clipboard.writeText(link);
    setCopiedId(formId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveConfig = () => {
    onUpdateGoogleSyncConfig({
      ...googleSyncConfig,
      scriptUrl: scriptUrlInput,
      autoSync: autoSyncToggle
    });
    setSyncStatusMsg('Google Form configuration saved successfully!');
    setTimeout(() => setSyncStatusMsg(null), 3000);
  };

  const handleRunSync = async () => {
    setIsSyncing(true);
    setSyncStatusMsg(null);
    try {
      const res = await onSyncGoogleForm();
      setSyncStatusMsg(res.message);
    } catch (err: any) {
      setSyncStatusMsg(err.message || 'Failed to fetch');
    } finally {
      setIsSyncing(false);
    }
  };

  // Call Netlify Function /.netlify/functions/generate-plan
  const handleGenerateAiPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeneratingAi(true);
    setAiError(null);
    setAiResult(null);

    try {
      const response = await fetch('/.netlify/functions/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate AI plan');
      }

      setAiResult(data.result);
    } catch (err: any) {
      setAiError(err.message || 'Network error while calling AI function');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC] text-slate-800 overflow-y-auto p-8 relative">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-8 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl z-50 flex items-center space-x-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-semibold text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Web Forms, Google Form Sync & AI Assistant</h2>
          <p className="text-xs text-slate-500 mt-1">Manage web capture forms, Google Sheet sync, and serverless AI sales strategy generation.</p>
        </div>
        <button
          onClick={onOpenBuilder}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm flex items-center space-x-2 shadow-lg shadow-blue-600/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add form</span>
        </button>
      </div>

      {/* AI Business Plan Generator Card (Calls /.netlify/functions/generate-plan) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-8 max-w-5xl w-full">
        <div className="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Serverless AI Sales Plan Generator</h3>
            <p className="text-xs text-slate-500">Powered by Gemini API via Netlify Function (<code className="bg-slate-100 px-1 py-0.5 rounded text-blue-600">/.netlify/functions/generate-plan</code>).</p>
          </div>
        </div>

        <form onSubmit={handleGenerateAiPlan} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Business Prompt / Strategy Topic</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="e.g. Draft a high-conversion sales strategy..."
                className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-600"
              />
              <button
                type="submit"
                disabled={isGeneratingAi}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl text-xs shadow-md transition-all flex items-center space-x-2 disabled:opacity-50 shrink-0"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isGeneratingAi ? 'animate-spin' : ''}`} />
                <span>{isGeneratingAi ? 'Generating...' : 'Generate AI Plan'}</span>
              </button>
            </div>
          </div>

          {aiError && (
            <div className="p-3 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold">
              {aiError}
            </div>
          )}

          {aiResult && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
              <h4 className="font-bold text-slate-900 mb-2 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Generated AI Strategy Result:</span>
              </h4>
              {aiResult}
            </div>
          )}
        </form>
      </div>

      {/* Google Form Sync Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-8 max-w-5xl w-full">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <RefreshCw className={`w-5 h-5 ${isSyncing ? 'animate-spin' : ''}`} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Google Form / Sheets Live Sync</h3>
              <p className="text-xs text-slate-500">Auto-detects Name, Phone, Email, Product, Message, and Timestamp (case-insensitive).</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onResetGoogleFormImport}
              className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors"
              title="Reset Google Form imported contacts & opportunities"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset imported data</span>
            </button>
            <button
              onClick={handleRunSync}
              disabled={isSyncing}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all flex items-center space-x-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
            </button>
          </div>
        </div>

        {/* Sync Settings Form */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">Apps Script Web App URL</label>
            <div className="relative">
              <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="https://script.google.com/macros/s/.../exec"
                value={scriptUrlInput}
                onChange={(e) => setScriptUrlInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <div className="flex items-center justify-between bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200">
            <span className="text-xs font-semibold text-slate-700">Auto sync every 60s</span>
            <input
              type="checkbox"
              checked={autoSyncToggle}
              onChange={(e) => {
                setAutoSyncToggle(e.target.checked);
                onUpdateGoogleSyncConfig({ ...googleSyncConfig, autoSync: e.target.checked });
              }}
              className="w-4 h-4 rounded text-blue-600 focus:ring-0"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
          <div className="flex items-center space-x-4">
            <span>Last synced: <strong className="text-slate-800">{googleSyncConfig.lastSyncedAt || 'Never'}</strong></span>
            <span>•</span>
            <span>Total imported: <strong className="text-emerald-600">{googleSyncConfig.totalImported} leads</strong></span>
          </div>
          <button
            onClick={handleSaveConfig}
            className="text-blue-600 font-semibold hover:underline"
          >
            Save URL & Settings
          </button>
        </div>

        {syncStatusMsg && (
          <div className={`mt-3 p-3 rounded-xl text-xs font-semibold ${syncStatusMsg.includes('Failed') || syncStatusMsg.includes('Invalid') || syncStatusMsg.includes('Please') ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
            {syncStatusMsg}
          </div>
        )}
      </div>

      {webForms.length === 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start max-w-5xl mx-auto w-full">
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-3">Build your first web form</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              Capture leads directly from your landing page or sync Google Forms. Submissions instantly generate a Contact and an Opportunity in your "New" pipeline stage.
            </p>
            <button
              onClick={onOpenBuilder}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl text-sm shadow-md transition-all flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add form now</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8 max-w-5xl mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {webForms.map((form) => (
              <div key={form.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-base">{form.title}</h3>
                        <p className="text-xs text-slate-500">{form.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => onDeleteForm(form.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100"
                      title="Delete Form"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center space-x-3 mb-6 text-xs">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                      Stage: {form.pipelineStage}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                      {form.submissionsCount} Submissions
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => onOpenPublicTest(form.id)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Test Form Page</span>
                  </button>
                  <button
                    onClick={() => handleCopyLink(form.id)}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center space-x-1 transition-colors"
                    title="Copy Public Link"
                  >
                    {copiedId === form.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === form.id ? 'Copied' : 'Share'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Submissions Table */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm mt-8">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">Form Submissions & Google Form Leads</h3>
              <span className="text-xs text-slate-500">{submissions.length} total records</span>
            </div>
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50/50 text-slate-500 uppercase text-[11px] font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-6">Source / Form</th>
                  <th className="py-3 px-6">Lead Name / Email</th>
                  <th className="py-3 px-6">UTM / Sheet ID</th>
                  <th className="py-3 px-6">Submitted At</th>
                  <th className="py-3 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {submissions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-slate-400 text-xs">
                      No submissions recorded yet.
                    </td>
                  </tr>
                ) : (
                  submissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-6 font-bold text-slate-900">{sub.formTitle}</td>
                      <td className="py-3.5 px-6 text-xs">
                        <div className="font-bold text-slate-800">{sub.data['Name'] || sub.data['Full Name'] || 'Unknown'}</div>
                        <div className="text-slate-500">{sub.data['Email'] || sub.data['Email Address'] || 'No Email'}</div>
                      </td>
                      <td className="py-3.5 px-6 text-xs">
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
                          {sub.utmSource}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-xs text-slate-500">{sub.submittedAt}</td>
                      <td className="py-3.5 px-6 text-xs text-emerald-600 font-bold">
                        ✓ Lead Created
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
