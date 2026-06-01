import { generateId } from 'ai';
import { createUIMessageStream, createUIMessageStreamResponse } from 'ai';
import type { UIMessage } from 'ai';

/** Trả lời cố định (policy) — không gọi LLM */
export function createPolicyStreamResponse(
  messages: UIMessage[],
  replyText: string,
) {
  const textId = generateId();

  return createUIMessageStreamResponse({
    stream: createUIMessageStream({
      originalMessages: messages,
      execute: async ({ writer }) => {
        writer.write({ type: 'text-start', id: textId });
        writer.write({ type: 'text-delta', id: textId, delta: replyText });
        writer.write({ type: 'text-end', id: textId });
      },
    }),
  });
}
