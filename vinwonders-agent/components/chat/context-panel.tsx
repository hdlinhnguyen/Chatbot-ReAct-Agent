'use client';

import type { ContextWindowStats } from '@/lib/memory';
import { Brain, Layers, Trash2 } from 'lucide-react';

type ContextPanelProps = {
  stats: ContextWindowStats;
  memoryActive: boolean;
  onClear: () => void;
  disabled?: boolean;
};

export function ContextPanel({
  stats,
  memoryActive,
  onClear,
  disabled,
}: ContextPanelProps) {
  const usagePercent = Math.min(
    100,
    Math.round((stats.estimatedTokens / stats.maxEstimatedTokens) * 100),
  );

  return (
    <div className="rounded-2xl border border-[var(--vw-border)] bg-[var(--vw-surface)]/80 px-3 py-2.5 text-xs">
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 font-medium text-zinc-400">
          <Layers className="h-3.5 w-3.5 text-[var(--vw-gold)]" />
          Context window
        </span>
        <button
          type="button"
          onClick={onClear}
          disabled={disabled}
          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-zinc-500 transition hover:bg-zinc-800 hover:text-zinc-300 disabled:opacity-40"
          title="Xóa hội thoại & bộ nhớ phiên"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Phiên mới
        </button>
      </div>

      <div className="mt-2 grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-[10px] uppercase text-zinc-600">Tin nhắn</p>
          <p className="font-mono text-sm text-zinc-200">
            {stats.windowUiMessages}/{stats.totalUiMessages}
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase text-zinc-600">Đã cắt</p>
          <p className="font-mono text-sm text-zinc-200">
            {stats.prunedUiMessages}
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase text-zinc-600">Tokens ~</p>
          <p className="font-mono text-sm text-zinc-200">
            {stats.estimatedTokens}
          </p>
        </div>
      </div>

      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-800">
        <div
          className={`h-full rounded-full transition-all ${
            usagePercent > 85 ? 'bg-red-500' : 'bg-[var(--vw-gold)]'
          }`}
          style={{ width: `${usagePercent}%` }}
        />
      </div>
      <p className="mt-1 text-[10px] text-zinc-600">
        Giữ tối đa {stats.maxTurns} lượt · ~{stats.maxEstimatedTokens} tokens
      </p>

      {memoryActive && (
        <p className="mt-2 flex items-center gap-1 text-[10px] text-emerald-500/90">
          <Brain className="h-3 w-3" />
          Bộ nhớ phiên đang bổ sung ngữ cảnh cho tin cũ
        </p>
      )}
    </div>
  );
}
