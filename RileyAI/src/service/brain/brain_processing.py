from src.tools.create_container import CreateContainer as create_container

# ============ Tools Here ============ #
from src.tools.create_project import CreateProject as create_project
from src.types.ai import Tools

AVAILABLE_TOOLS = {
    "create_project": create_project,
    "create_container": create_container,
}
# ============ Tools Here ============ #


async def Brain_Processing(ai_tool_response: Tools, user_query: str):
    print("\n === BRAIN PROCESSING ===")
    print("The user query is:", user_query)

    state = {tool.id: tool.status for tool in ai_tool_response.tools}

    print("Initial State:", state)

    last_response = None

    for tool in ai_tool_response.tools:
        tool_function = AVAILABLE_TOOLS.get(tool.tool_name)

        if not tool_function:
            print(f"WARNING: Tool '{tool.tool_name}' does not exist.")
            state[tool.id] = "failed"
            continue

        try:
            print(f"Executing tool: {tool.tool_name} for ID {tool.id}")

            # ============ TOOL CALL ============ #
            response = await tool_function(user_query)

            print("========== BRAIN IS PROCESSING stuff ==========")
            print("Tool Response from brain processing ->", response)

            # Handle response safely - check if it's a dict or has status attribute
            if isinstance(response, dict):
                # It's a dict with status key
                if response.get("status") == "completed":
                    state[tool.id] = "completed"
                else:
                    state[tool.id] = "failed"
            elif hasattr(response, "status"):
                # It's a Pydantic model with status attribute
                if response.status == "completed":
                    state[tool.id] = "completed"
                else:
                    state[tool.id] = "failed"
            else:
                print(f"WARNING: Unexpected response format from {tool.tool_name}")
                state[tool.id] = "failed"

            last_response = response

        except Exception as e:
            print(f"Tool {tool.tool_name} crashed with error: {e}")
            state[tool.id] = "failed"

    print("Final State:", state)

    # Return the last response if available, otherwise return state
    if last_response:
        return last_response
    else:
        return {"status": "failed", "message": "No tools were executed successfully"}
