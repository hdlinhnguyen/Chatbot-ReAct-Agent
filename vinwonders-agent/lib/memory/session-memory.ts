import type { UIMessage } from 'ai';
import type { EmergencyResult, SearchResult } from '@/components/chat/types';

export type SessionFact = {
  kind: 'emergency' | 'search' | 'user_note';
  text: string;
  at: string;
};

const MAX_FACTS = 8;

function getTextFromMessage(message: UIMessage): string {
  return message.parts
    .filter((p) => p.type === 'text')
    .map((p) => p.text)
    .join(' ')
    .trim();
}

/** Trích xuất sự kiện quan trọng từ lịch sử (rule-based, phù hợp lab local LLM) */
export function extractSessionFacts(messages: UIMessage[]): SessionFact[] {
  const facts: SessionFact[] = [];
  const seen = new Set<string>();

  for (const message of messages) {
    if (message.role === 'user') {
      const text = getTextFromMessage(message);
      if (text.length > 12) {
        const key = `user:${text.slice(0, 40)}`;
        if (!seen.has(key)) {
          seen.add(key);
          facts.push({
            kind: 'user_note',
            text: `Khách đã nói: "${text.length > 120 ? `${text.slice(0, 120)}…` : text}"`,
            at: message.id,
          });
        }
      }
    }

    if (message.role !== 'assistant') continue;

    for (const part of message.parts) {
      if (
        part.type === 'tool-handleEmergency' &&
        part.state === 'output-available' &&
        'output' in part
      ) {
        const out = part.output as EmergencyResult;
        const key = `emergency:${out.ticketId}`;
        if (!seen.has(key)) {
          seen.add(key);
          facts.push({
            kind: 'emergency',
            text: `Sự cố ${out.type}: ticket ${out.ticketId}. ${out.message}`,
            at: message.id,
          });
        }
      }

      if (
        part.type === 'tool-searchDestination' &&
        part.state === 'output-available' &&
        'output' in part
      ) {
        const out = part.output as SearchResult;
        const names = out.results.map((r) => r.name).join(', ');
        const key = `search:${names.slice(0, 60)}`;
        if (!seen.has(key)) {
          seen.add(key);
          facts.push({
            kind: 'search',
            text: `Đã gợi ý địa điểm: ${names || '(không có kết quả)'}`,
            at: message.id,
          });
        }
      }
    }
  }

  return facts.slice(-MAX_FACTS);
}

export function buildMemorySummary(facts: SessionFact[]): string {
  if (facts.length === 0) return '';

  const lines = facts.map((f, i) => `${i + 1}. ${f.text}`);
  return [
    '## Bộ nhớ phiên (Memory) — các sự kiện đã xảy ra:',
    ...lines,
    'Hãy tham chiếu bộ nhớ này khi khách hỏi tiếp (ví dụ: "ticket lúc nãy", "chỗ mưa hồi trước").',
  ].join('\n');
}
