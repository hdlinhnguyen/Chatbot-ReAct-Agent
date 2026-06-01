import re
from textwrap import dedent
from typing import Any, Dict, List, Optional, Tuple

from src.core.llm_provider import LLMProvider
from src.telemetry.logger import logger


class ReActAgent:
    """ReAct-style agent that follows the Thought-Action-Observation loop."""

    def __init__(self, llm: LLMProvider, tools: List[Dict[str, Any]], max_steps: int = 5):
        self.llm = llm
        self.tools = tools
        self.max_steps = max_steps
        self.history: List[Dict[str, Any]] = []

    def get_system_prompt(self) -> str:
        tool_descriptions = "\n".join(
            f"- {tool['name']}: {tool.get('description', 'No description provided')}"
            for tool in self.tools
        )

        return dedent(f"""
            You are an intelligent assistant. You have access to the following tools:
            {tool_descriptions}

            Follow the ReAct pattern carefully.
            When you need a tool, respond using the exact format:
            Thought: <your reasoning>
            Action: tool_name(arguments)
            Observation: <tool result>

            Repeat Thought/Action/Observation as needed.
            When you are finished, answer with:
            Final Answer: <your final response>
        """)

    def run(self, user_input: str) -> str:
        logger.log_event("AGENT_START", {"input": user_input, "model": self.llm.model_name})

        self.history = []
        prompt = user_input.strip()
        steps = 0

        while steps < self.max_steps:
            response = self.llm.generate(prompt, system_prompt=self.get_system_prompt())
            content = response.get("content", "").strip()
            logger.log_event("AGENT_STEP", {"step": steps + 1, "response": content})

            if not content:
                logger.log_event("AGENT_EMPTY_RESPONSE", {"step": steps + 1})
                break

            self.history.append({"role": "assistant", "content": content})

            final_answer = self._extract_final_answer(content)
            if final_answer:
                logger.log_event(
                    "AGENT_FINAL_ANSWER",
                    {"answer": final_answer, "steps": steps + 1},
                )
                logger.log_event("AGENT_END", {"steps": steps + 1})
                return final_answer

            action = self._parse_action(content)
            if action is None:
                logger.log_event("AGENT_NO_ACTION", {"content": content, "step": steps + 1})
                break

            tool_name, args = action
            observation = self._execute_tool(tool_name, args)
            self.history.append(
                {
                    "role": "tool",
                    "name": tool_name,
                    "input": args,
                    "output": observation,
                }
            )
            prompt = self._build_prompt(user_input, self.history)
            steps += 1

        logger.log_event("AGENT_END", {"steps": steps})
        return content or "I could not produce a final answer."

    def _build_prompt(self, user_input: str, history: List[Dict[str, Any]]) -> str:
        prompt = user_input.strip()
        for entry in history:
            if entry["role"] == "assistant":
                prompt += f"\n{entry['content'].strip()}"
            elif entry["role"] == "tool":
                prompt += f"\nObservation: {entry['output'].strip()}"
        return prompt

    def _parse_action(self, content: str) -> Optional[Tuple[str, str]]:
        action_match = re.search(r"Action:\s*([A-Za-z0-9_]+)\s*\((.*?)\)", content, re.DOTALL)
        if not action_match:
            return None

        tool_name = action_match.group(1).strip()
        args = action_match.group(2).strip()
        return tool_name, args

    def _extract_final_answer(self, content: str) -> Optional[str]:
        final_match = re.search(r"Final Answer:\s*(.*)", content, re.DOTALL)
        if not final_match:
            return None

        return final_match.group(1).strip()

    def _execute_tool(self, tool_name: str, args: str) -> str:
        for tool in self.tools:
            if tool.get("name") != tool_name:
                continue

            executor = tool.get("function") or tool.get("execute") or tool.get("callable")
            if callable(executor):
                try:
                    return executor(args)
                except Exception as exc:
                    return f"Tool {tool_name} failed: {exc}"

            if "description" in tool:
                return f"Executed {tool_name} with args: {args}"

        return f"Tool {tool_name} not found."
