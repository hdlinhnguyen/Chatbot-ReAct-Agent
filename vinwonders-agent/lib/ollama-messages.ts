import type { ModelMessage, UIMessage } from 'ai';

/** Chuyển UIMessage (có tool parts) sang text thuần cho Ollama Chat Completions */
export function toOllamaMessages(messages: UIMessage[]): ModelMessage[] {
  const result: ModelMessage[] = [];

  for (const message of messages) {
    if (message.role !== 'user' && message.role !== 'assistant') continue;

    const lines: string[] = [];
    for (const part of message.parts) {
      if (part.type === 'text' && part.text.trim()) {
        lines.push(part.text);
      } else if (
        part.type.startsWith('tool-') &&
        'state' in part &&
        part.state === 'output-available' &&
        'output' in part
      ) {
        const toolName = part.type.replace(/^tool-/, '');
        lines.push(`[Kết quả ${toolName}]: ${JSON.stringify(part.output)}`);
      }
    }

    const content = lines.join('\n').trim();
    if (content) {
      result.push({ role: message.role, content });
    }
  }

  return result;
}
