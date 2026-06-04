import { useState, useEffect, useRef, useCallback } from 'react';
import { Terminal, X, ChevronDown, Trash2, Bug } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogEntry {
  id: number;
  timestamp: string;
  level: 'log' | 'warn' | 'error' | 'info' | 'sdk';
  message: string;
  detail?: string;
}

let logIdCounter = 0;

const LOG_STORAGE_KEY = 'stayfind_debug_logs';
const MAX_LOGS = 200;

export default function DebugConsole() {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filter, setFilter] = useState<'all' | 'sdk' | 'error'>('all');
  const scrollRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef(true);

  /* ── Load saved logs ── */
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOG_STORAGE_KEY);
      if (saved) setLogs(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  /* ── Intercept console methods ── */
  useEffect(() => {
    const addLog = (level: LogEntry['level'], message: string, detail?: string) => {
      const entry: LogEntry = {
        id: ++logIdCounter,
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
        level,
        message: String(message).slice(0, 500),
        detail: detail?.slice(0, 1000),
      };
      setLogs(prev => {
        const next = [...prev, entry].slice(-MAX_LOGS);
        try { localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(next)); } catch { /* ignore */ }
        return next;
      });
    };

    // SDK detection helper
    const detectPiSdk = () => {
      const pi = (window as any).Pi;
      if (!pi) return 'window.Pi = undefined (SDK not loaded)';
      const keys = Object.keys(pi).join(', ');
      return `window.Pi = { ${keys} }`;
    };

    // Override console methods
    const origLog = console.log;
    const origWarn = console.warn;
    const origError = console.error;

    console.log = (...args: any[]) => {
      origLog.apply(console, args);
      addLog('log', args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
    };
    console.warn = (...args: any[]) => {
      origWarn.apply(console, args);
      addLog('warn', args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
    };
    console.error = (...args: any[]) => {
      origError.apply(console, args);
      addLog('error', args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
    };

    // Initial SDK check
    setTimeout(() => {
      addLog('sdk', `[SDK CHECK] ${detectPiSdk()}`);
      addLog('sdk', `[UA] ${navigator.userAgent.slice(0, 120)}`);
      addLog('sdk', `[Pi Browser] ${navigator.userAgent.includes('PiBrowser') || navigator.userAgent.includes('Pi Browser')}`);
    }, 2000);

    // Periodic SDK check
    const interval = setInterval(() => {
      addLog('sdk', `[PERIODIC CHECK] ${detectPiSdk()}`);
    }, 10000);

    return () => {
      console.log = origLog;
      console.warn = origWarn;
      console.error = origError;
      clearInterval(interval);
    };
  }, []);

  /* ── Auto scroll ── */
  useEffect(() => {
    if (autoScrollRef.current && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const clearLogs = useCallback(() => {
    setLogs([]);
    localStorage.removeItem(LOG_STORAGE_KEY);
  }, []);

  const filteredLogs = logs.filter(l => filter === 'all' || l.level === filter);

  const levelColors: Record<string, string> = {
    log: 'text-[#4A5468]',
    warn: 'text-[#E8A838]',
    error: 'text-[#D93838]',
    info: 'text-[#5B8DEF]',
    sdk: 'text-[#7B5EA7] font-medium',
  };

  const levelLabels: Record<string, string> = {
    all: 'All', sdk: 'SDK', error: 'Errors', log: 'Logs', warn: 'Warn',
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-[100] w-12 h-12 rounded-full bg-[#0F1B2E] text-white flex items-center justify-center shadow-lg hover:bg-[#1A2B47] transition-colors"
        aria-label="Open debug console"
      >
        <Bug size={20} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-[100] w-[calc(100vw-2rem)] max-w-[480px] bg-[#0F1B2E] rounded-xl shadow-2xl border border-white/10 overflow-hidden flex flex-col"
      style={{ maxHeight: '60vh' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 bg-[#1A2B47]">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-[#E85D4A]" />
          <span className="font-body text-xs font-semibold text-white">Debug Console</span>
          <span className="font-body text-[10px] text-white/40">({filteredLogs.length})</span>
        </div>
        <div className="flex items-center gap-1">
          {/* Filters */}
          {(['all', 'sdk', 'error'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-2 py-0.5 rounded font-body text-[10px] transition-colors',
                filter === f ? 'bg-[#E85D4A] text-white' : 'text-white/40 hover:text-white/70'
              )}
            >
              {levelLabels[f]}
            </button>
          ))}
          <button onClick={clearLogs} className="p-1 text-white/40 hover:text-[#E85D4A] transition-colors">
            <Trash2 size={12} />
          </button>
          <button onClick={() => setIsOpen(false)} className="p-1 text-white/40 hover:text-white transition-colors">
            <ChevronDown size={14} />
          </button>
          <button onClick={() => setIsOpen(false)} className="p-1 text-white/40 hover:text-white transition-colors">
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Pi SDK Status Bar */}
      <div className="px-3 py-1.5 border-b border-white/5 bg-[#0F1B2E]">
        <div className="flex items-center gap-2 font-body text-[10px]">
          <span className="text-white/40">Pi SDK:</span>
          <span className={cn(
            (window as any).Pi ? 'text-[#4ADE80]' : 'text-[#D93838]'
          )}>
            {(window as any).Pi ? '✓ Loaded' : '✗ Not Found'}
          </span>
          <span className="text-white/20">|</span>
          <span className="text-white/40">Browser:</span>
          <span className={cn(
            navigator.userAgent.includes('PiBrowser') || navigator.userAgent.includes('Pi Browser')
              ? 'text-[#4ADE80]' : 'text-[#E8A838]'
          )}>
            {navigator.userAgent.includes('PiBrowser') || navigator.userAgent.includes('Pi Browser')
              ? 'Pi Browser' : 'Other'}
          </span>
          <span className="text-white/20">|</span>
          <span className="text-white/40">sandbox:</span>
          <span className="text-[#7B5EA7]">{(window as any).Pi?.sandbox ?? 'N/A'}</span>
        </div>
      </div>

      {/* Log Lines */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-3 py-2 space-y-1 font-mono text-[11px] leading-relaxed"
        onScroll={() => {
          if (scrollRef.current) {
            const el = scrollRef.current;
            autoScrollRef.current = el.scrollTop + el.clientHeight >= el.scrollHeight - 20;
          }
        }}
      >
        {filteredLogs.length === 0 && (
          <p className="text-white/20 text-center py-4">No logs yet...</p>
        )}
        {filteredLogs.map(log => (
          <div key={log.id} className="flex gap-2 break-all">
            <span className="text-white/20 shrink-0">{log.timestamp}</span>
            <span className={cn('shrink-0 uppercase text-[9px] mt-0.5', levelColors[log.level])}>
              [{log.level}]
            </span>
            <span className={cn(levelColors[log.level])}>{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
