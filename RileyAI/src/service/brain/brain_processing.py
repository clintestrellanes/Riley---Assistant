from src.types.ai import Tools

# ============ Tools Here ============ # 
from src.tools.create_project import CreateProject as create_project
from src.tools.create_container import CreateContainer as create_container

AVAILABLE_TOOLS = {
    "create_project": create_project,
    "create_container": create_container,
}
# ============ Tools Here ============ # 



# --------------- TODO --------------- # 
# 1. Save states to an array for multiple tools invoked? hmmm 


async def Brain_Processing(ai_tool_response: Tools, user_query: str):
    print("\n === BRAIN PROCESSING ===")
    print("The user query is:", user_query)
    
    
    state = {tool.id: tool.status for tool in ai_tool_response.tools}
    
    print("Initial State:", state)

    for tool in ai_tool_response.tools:        
        tool_function = AVAILABLE_TOOLS.get(tool.tool_name)
        
        if not tool_function:
            print(f"WARNING: Tool '{tool.tool_name}' does not exist.")
            state[tool.id] = "failed"
            continue
            
        try:
            print(f"Executing tool: {tool.tool_name} for ID {tool.id}")
            

            #  ============ TOOL CALL ============ # 
            response = await tool_function(user_query)


            
            print("========== BRAIN IS PROCESSING stuff ==========")
            print("Tool Respone from brain processing ->", response)
            if response.status == "completed":
                state[tool.id] = "completed"
            else:
                state[tool.id] = "failed"
                
        except Exception as e:
            print(f"Tool {tool.tool_name} crashed with error: {e}")
            state[tool.id] = "failed"

    print("Final State:", state)

    # NOT FINAL 
    # NOT FINAL 
    # NOT FINAL 
    # NOT FINAL 
    # NOT FINAL 
    
    # return state 
    
     
    # not suppose to be specific, since there are other tools that return differnet things hmmmm
    return response