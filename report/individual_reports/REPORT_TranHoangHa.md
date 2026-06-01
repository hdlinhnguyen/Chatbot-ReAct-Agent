# Individual Report: Lab 3 - Chatbot vs ReAct Agent

- **Student Name**: Trần Hoàng Hà
- **Student ID**: 2A202600612
- **Date**: 01-06-2026
- **Git author**: `HaTH <tranhoangha94@gmail.com>`
- **Focus**: ReAct loop (Python), telemetry/trace & parse recovery, Security Guardrails (Python + TypeScript), routing chống ticket nhầm (`SORRY_FALLBACK`)

---

## Commits đã đóng góp (theo `git log --author=HaTH`)

| Hash | Ngày | Message | File chính |
|------|------|---------|------------|
| `3143503` | 2026-06-01 | Add React Loop | `src/agent/agent.py` |
| `954095b` | 2026-06-01 | Update Agen, trace quality, handle hallucinate | `src/agent/agent.py` |
| `54645ca` | 2026-06-01 | Update spam ticket | `vinwonders-agent/lib/agent-tools.ts` |
| `519d688` | 2026-06-01 | Advoice unnecessary ticket | `vinwonders-agent/lib/agent-tools.ts` |
| `1930580` | 2026-06-01 | Implement Security GuardsRail | `src/security/*`, `vinwonders-agent/lib/guardrails.ts`, `SECURITY*.md`, ví dụ secure route/agent |
| `8f137fc` | 2026-06-01 | ignore venv | `.gitignore` |
| `e76390b` | 2026-06-01 | Update report | `report/individual_reports/REPORT_TranHoangHa.md`, `GROUP_REPORT_Table_D1.md` |

*Các PR merge: #7, #11, #12, #13 (branch `hath`).*

**Phân công nhóm (tham chiếu [`GROUP_REPORT_Table_D1.md`](../group_report/GROUP_REPORT_Table_D1.md)):** guard spam v2.1 (`tool-guard`, silent stream, Karpathy rules, sửa merge `agent-tools`) do **Nguyễn Hồ Diệu Linh**; E2E VinWonders API/UI do **Hoàng Đức Trường**. Phần dưới chỉ mô tả commit của **Trần Hoàng Hà**.

---

## I. Technical Contribution (15 Points)

### 1.1 Triển khai vòng ReAct (Python) — `3143503`

Thay skeleton TODO trong `src/agent/agent.py` bằng vòng **Thought → Action → Observation → Final Answer**:

- `get_system_prompt()` liệt kê tool + format ReAct (dùng `textwrap.dedent`).
- `run()`: gọi LLM từng bước, parse `Action: tool_name(args)`, execute tool, append observation vào prompt, dừng khi có `Final Answer:`.
- `_parse_action`, `_execute_tool`, `_build_prompt` — đủ để chạy lab với `run_agent.py` / provider thật.

Đây là đóng góp **core Lab 3** theo hướng dẫn instructor (ReAct mechanics).

### 1.2 Trace, logging & xử lý parse fail — `954095b`

Cải thiện độ tin cậy khi model không tuân format:

- `self.trace: List[Dict]` + `get_trace()` — lưu từng bước (assistant, tool, observation, `parse_error`, `final_answer`).
- Log structured: `AGENT_START` (kèm `max_steps`), `AGENT_STEP` (usage, latency), `AGENT_PARSE_ERROR`.
- Khi **không parse được Action**: không `break` sớm; đẩy observation lỗi parser vào history và **tiếp tục vòng** (giảm “kẹt” một shot).
- System prompt bổ sung: tool unavailable → giải thích; không cần tool → trả `Final Answer` trực tiếp.

> **Lưu ý:** Trên `main` hiện tại, `agent.py` đã được nhóm tích hợp thêm guardrails (`src/security/guardrails.py` trong `run()`). Logic trace/parse của commit `954095b` là nền tảng; có thể khác một phần so với file đang checkout.

### 1.3 Security Guardrails — `1930580`

Bộ **Guardrails** dùng chung cho lab Python và app Next.js:

| Thành phần | Vai trò |
|------------|---------|
| `src/security/guardrails.py` | Python: injection, validate input/output, tool whitelist, rate limit, resource budget, `get_security_report()` |
| `src/agent/secure_agent_example.py` | Ví dụ agent ReAct có guardrails |
| `vinwonders-agent/lib/guardrails.ts` | TypeScript: tương đương (rate limit, injection, tool args, PII patterns) |
| `vinwonders-agent/app/api/chat/secure_route_example.ts` | Mẫu tích hợp vào `/api/chat` |
| `SECURITY.md`, `SECURITY_ARCHITECTURE.md`, `SECURITY_CHECKLIST.md`, `SECURITY_INTEGRATION.md`, `SECURITY_IMPLEMENTATION_SUMMARY.md`, `SECURITY_QUICK_REFERENCE.md` | Tài liệu triển khai & checklist |

`app/api/chat/route.ts` (nhóm) gọi `getValidator().checkRateLimit` / `validateInput` — module TypeScript do commit này cung cấp.

### 1.4 Giảm ticket / tool nhầm khi model “xin lỗi” — `54645ca`, `519d688`

Trong `vinwonders-agent/lib/agent-tools.ts`:

- Thêm regex **`SORRY_FALLBACK`** (`xin lỗi`, `sorry`, `không biết`, `chưa rõ`, …).
- Chỉ gọi `searchDestination` / `handleEmergency` khi **không** khớp `SORRY_FALLBACK` (tránh routing khẩn cấp/tìm kiếm khi câu mang nghĩa từ chối / lỗi).
- `519d688`: sửa typo `SORRY _FALLBACK` → `SORRY_FALLBACK` (lỗi syntax sau refactor).

*Khác với spam guard 3 lần (`tool-guard.ts`) — phần đó không nằm trong commit của Hà.*

### 1.5 Repo hygiene — `8f137fc`, `121862a`

- Cập nhật `.gitignore` để bỏ qua `.venv` / virtualenv.

---

### Modules implemented (theo commit)

| Module | Commit | Vai trò |
|--------|--------|---------|
| `src/agent/agent.py` | `3143503`, `954095b` | ReAct loop, trace, parse recovery |
| `src/security/guardrails.py` | `1930580` | Security validator Python |
| `src/agent/secure_agent_example.py` | `1930580` | Demo agent có guardrails |
| `vinwonders-agent/lib/guardrails.ts` | `1930580` | Validator cho Next.js API |
| `vinwonders-agent/app/api/chat/secure_route_example.ts` | `1930580` | Mẫu route bảo mật |
| `vinwonders-agent/lib/agent-tools.ts` | `54645ca`, `519d688` | `SORRY_FALLBACK` trong `detectServerTool` |
| `SECURITY*.md` (6 file) | `1930580` | Hướng dẫn bảo mật |

---

### Code highlights

**ReAct loop (rút gọn từ `3143503`):**

```python
while steps < self.max_steps:
    response = self.llm.generate(prompt, system_prompt=self.get_system_prompt())
    content = response.get("content", "").strip()
    final_answer = self._extract_final_answer(content)
    if final_answer:
        return final_answer
    action = self._parse_action(content)
    if action is None:
        # 954095b: feed parser error as Observation, continue loop
        ...
    tool_name, args = action
    observation = self._execute_tool(tool_name, args)
    prompt = self._build_prompt(user_input, self.history)
    steps += 1
```

**Chống routing nhầm khi model / user “xin lỗi”:**

```typescript
// vinwonders-agent/lib/agent-tools.ts (54645ca)
const SORRY_FALLBACK =
  /(xin lỗi|sorry|bị lỗi|bi loi|không biết|khong biet|chưa rõ|chua ro|không chắc|khong chac)/i;

if (EMERGENCY_MEDICAL.test(lower) && !SORRY_FALLBACK.test(lower)) { ... }
if (EMERGENCY_INCIDENT.test(lower) && !SORRY_FALLBACK.test(lower)) { ... }
if (SEARCH_FALLBACK.test(lower) && !SORRY_FALLBACK.test(lower)) { ... }
```

**Guardrails TypeScript (được `route.ts` dùng):**

```typescript
// vinwonders-agent/lib/guardrails.ts (1930580)
export class GuardrailsValidator {
  checkRateLimit(userId: string, ipAddress: string): boolean { ... }
  validateInput(userInput: string, userId?: string): boolean { ... }
  validateTool(toolName: string, toolArgs: Record<string, unknown>, availableTools?: string[]): ... 
}
```

---

### Documentation

| Tài liệu | Nội dung |
|----------|----------|
| `SECURITY.md` + 5 file `SECURITY_*` | Kiến trúc, checklist, tích hợp Python/TS, quick reference |
| [`GROUP_REPORT_Table_D1.md`](../group_report/GROUP_REPORT_Table_D1.md) | Bảng phân công — Hà: ReAct + Security |
| [`REPORT_HoangDucTruong.md`](REPORT_HoangDucTruong.md) | E2E VinWonders, tools, logging, UI trace |
| [`REPORT_NguyenHoDieuLinh.md`](REPORT_NguyenHoDieuLinh.md) | v2.1 anti-spam / Karpathy / `tool-guard` |

**Tương tác với agent loop:**

- **Python ReAct:** block `Thought` / `Action` / `Observation` rõ — phù hợp debug & báo cáo failed trace (`logs/`).
- **VinWonders:** Hà không implement `tool-guard` hay `stepCountIs`; chỉ bổ sung **SORRY_FALLBACK** + **guardrails** cho input/rate limit.

---

## II. Debugging Case Study (10 Points)

### Problem 1 — Model không parse được Action (ReAct Python)

**Mô tả:** Với model nhỏ / mock, output thiếu `Action:` đúng format → agent dừng sớm, không có `Final Answer`.

**Log:** `AGENT_PARSE_ERROR`, `AGENT_NO_ACTION` (trước `954095b`).

**Chẩn đoán:** `_parse_action` trả `None` → vòng lặp `break` ngay.

**Giải pháp (`954095b`):** Ghi observation lỗi parser, rebuild prompt, `continue` — cho model một “Observation” để sửa hướng (tương tự ReAct chuẩn khi tool fail).

---

### Problem 2 — Ticket khẩn cấp / search kích hoạt nhầm

**Mô tả:** Câu kiểu “xin lỗi mình không biết…” hoặc phản hồi lỗi vẫn khớp `EMERGENCY_*` / `SEARCH_FALLBACK` → `handleEmergency` tạo ticket không cần thiết.

**Log / UI:** Nhiều `tool-handleEmergency` khi nội dung không phải báo sự cố thật.

**Chẩn đoán:** `detectServerTool` chỉ dựa regex intent, không loại trừ ngữ điệu từ chối / apology.

**Giải pháp (`54645ca`, `519d688`):** `SORRY_FALLBACK` + sửa typo biến regex.

---

### Problem 3 — Thiếu lớp bảo mật production

**Mô tả:** Lab ban đầu chưa có injection check, rate limit, tool whitelist.

**Giải pháp (`1930580`):** Module guardrails song song Python/TS + tài liệu + `secure_*_example` để nhóm gắn vào `route.ts` / `agent.py`.

---

## III. Personal Insights: Chatbot vs ReAct (10 Points)

1. **Reasoning:** Implement ReAct (`3143503`) cho thấy **Thought/Action tách bạch** giúp debug hơn chatbot một shot — mỗi bước in/log được. VinWonders chatbot thường ẩn vòng tool trong AI SDK; ReAct Python phù hợp bài lab “đọc trace”.

2. **Reliability:** Agent **kém hơn** khi parse fail liên tục (model yếu); **tốt hơn** khi cần tool thật (weather, ticket, location trong `src/tools/`). Trace (`954095b`) và guardrails (`1930580`) là hai lớp bổ sung: một cho **quan sát**, một cho **chặn**.

3. **Observation:** Observation sai (parser error hoặc tool spam) lãng phí bước LLM — fix parser loop và `SORRY_FALLBACK` là cắt “observation nhiễu” sớm, tương tự guard spam của nhóm nhưng ở tầng **intent routing**.

---

## IV. Future Improvements (5 Points)

- **ReAct:** Khôi phục/merge `get_trace()` vào `agent.py` hiện tại cùng guardrails; export trace JSON ra `logs/` mỗi `run()`.
- **Security:** Bật đầy đủ `validateTool` trên native tools trong `route.ts` (hiện mới rate limit + `validateInput`).
- **Routing:** Mở rộng `SORRY_FALLBACK` hoặc dùng embedding thay regex thuần cho intent VinWonders.
- **Testing:** `pytest` cho `GuardrailsValidator` + case `detectServerTool` với câu apology / emergency thật.

---

## Kiểm thử đã thực hiện / đề xuất

1. `python run_agent.py` — ReAct với MockProvider: weather / ticket / location intent.
2. `python src/agent/secure_agent_example.py` (nếu có) — input injection bị chặn.
3. VinWonders: gửi “xin lỗi mình không biết gì” → **không** tạo ticket (sau `54645ca`).
4. VinWonders: spam “Mất đồ” — kiểm tra với `tool-guard` (Linh), không thuộc commit Hà.
5. `npm run build` trong `vinwonders-agent/` — pass sau khi nhóm sửa merge `agent-tools.ts` (Trường/Linh).

---

## Phạm vi & cộng tác

| Hạng mục | Người thực hiện (commit / báo cáo nhóm) |
|----------|------------------------------------------|
| ReAct `agent.py`, trace/parse | **Trần Hoàng Hà** |
| Security modules + docs | **Trần Hoàng Hà** |
| `SORRY_FALLBACK` trong `agent-tools.ts` | **Trần Hoàng Hà** |
| `tool-guard`, silent stream, Karpathy, `stepCountIs` | Nguyễn Hồ Diệu Linh |
| API chat E2E, mock data, UI trace | Hoàng Đức Trường |
| Security techniques v2 trên `agent.py` | Nguyễn Thị Bích Duyên (merge `5c9e7ad`) |

---

> Báo cáo này được **cập nhật theo git history** (`git log --author=HaTH`), không còn gán các module v2.1 anti-spam/Karpathy vào phạm vi commit của Trần Hoàng Hà.
