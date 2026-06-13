 # this will create and manage projects base on the given context
from groq import AsyncGroq
from dotenv import load_dotenv
from pathlib import Path


# ============ Service Here ============ #
from src.service.md_prompt_reader import prompt_reader
# ============ Service Here ============ #

# ============ Worker ============ # 
from src.api.neuron import InvokeNeuron
# ============ Worker ============ # 
# 
# ============ Types ============ # 
from src.types.ai import Create_Container_AI_Response 
# ============ Types ============ # 


load_dotenv()
client = AsyncGroq()

current_dir = Path(__file__).parent.resolve()
create_project_prompt_path = current_dir.parent / "sys_prompts/create_container.md"


async def CreateContainer(user_query: str):
    print("=== CREATING Container ===")
    print("creaet container [ user query ] -> ",user_query)
    prompt_md = await prompt_reader(create_project_prompt_path)
    try:
        res = await InvokeNeuron(user_query,prompt_md,Create_Container_AI_Response )
        return res
    except Exception as e:
        print("error in creating_container.py: ",e)
        return {"status":"failed"}
