# Flow

### Front-End
api/ai (all_projects, active_project, user_query) -> [backend] api/brain 


### Backend
api/brain -> fetch using sys_prompt/thinking.md -> service/brain_processing.py -> api/tools -> api/neuron.py -> api/tools -> service/brain_processing.py



# Creating new tool
## [Backend]
1. create md file in /sys_prompts
2. update thinking.md -> the when brain thinks it gotta know the tool
2. create tool in /tools.py
3. create new type in /types.ai.py
4. create new tool in /service/brain.brain_processing.py

## [Frontend]
1. add new response from src/app/services/ai_chat_response_checker that focuses its response on 
[*]_AI_Response
2. modify src/app/services/project_manager/chat.tsx to allow the response
3. Optional in making new componenets in /project_manager/ai_response_comp

# Important i guess [*] -> modifiable
- the class [*]_AI_Response (found in /types.ai.py) decides the response sent to front-end