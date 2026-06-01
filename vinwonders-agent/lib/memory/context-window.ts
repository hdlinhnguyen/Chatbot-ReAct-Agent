import type { UIMessage } from 'ai';

export type ContextWindowConfig = {
  /** Số lượt hội thoại (user+assistant) giữ trong cửa sổ gửi LLM */
  maxTurns: number;
  /** Ước lượng token tối đa cho phần messages (không tính system) */
  maxEstimatedTokens: number;
};

export const DEFAULT_CONTEXT_CONFIG: ContextWindowConfig = {
  maxTurns: 6,
  maxEstimatedTokens: 2800,
};

export type ContextWindowStats = {
  totalUiMessages: number;
  windowUiMessages: number;
  prunedUiMessages: number;
  estimatedTokens: number;
  maxTurns: number;
  maxEstimatedTokens: number;
};

/** Ước lượng token ~ 1 token / 4 ký tự (tiếng Việt/xáo trộn) */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

function uiMessageToText(message: UIMessage): string {
  const parts: string[] = [];
  for (const part of message.parts) {
    if (part.type === 'text' && part.text) parts.push(part.text);
    if (
      part.type.startsWith('tool-') &&
      'state' in part &&
      part.state === 'output-available' &&
      'output' in part
    ) {
      parts.push(JSON.stringify(part.output));
    }
  }
  return parts.join('\n');
}

/**
 * Sliding window: giữ N tin nhắn UI gần nhất (user/assistant),
 * có thể cắt thêm nếu vượt ngưỡng token ước lượng.
 */
export function trimToContextWindow(
  messages: UIMessage[],
  config: ContextWindowConfig = DEFAULT_CONTEXT_CONFIG,
): { windowMessages: UIMessage[]; stats: ContextWindowStats } {
  const conversational = messages.filter(
    (m) => m.role === 'user' || m.role === 'assistant',
  );

  const maxMessages = config.maxTurns * 2;
  let windowMessages = conversational.slice(-maxMessages);

  let estimatedTokens = windowMessages.reduce(
    (sum, m) => sum + estimateTokens(uiMessageToText(m)),
    0,
  );

  while (
    windowMessages.length > 2 &&
    estimatedTokens > config.maxEstimatedTokens
  ) {
    windowMessages = windowMessages.slice(2);
    estimatedTokens = windowMessages.reduce(
      (sum, m) => sum + estimateTokens(uiMessageToText(m)),
      0,
    );
  }

  const stats: ContextWindowStats = {
    totalUiMessages: conversational.length,
    windowUiMessages: windowMessages.length,
    prunedUiMessages: conversational.length - windowMessages.length,
    estimatedTokens,
    maxTurns: config.maxTurns,
    maxEstimatedTokens: config.maxEstimatedTokens,
  };

  return { windowMessages, stats };
}
