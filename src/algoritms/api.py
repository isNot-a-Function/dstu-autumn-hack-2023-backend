from typing import Union

from fastapi import FastAPI
import json


from typing import List, Optional
from pydantic import BaseModel
from calculate_answer import get_answer_by_ai
app = FastAPI()

class Message(BaseModel):
    content: str



@app.post("/get_answer_by_ai")
async def get_freeze_recomendation(data: Message):

    # Создаем экземпляр RootModel из данных
    root_message = Message.model_validate(data)

    result = get_answer_by_ai(root_message.content)
    data = {"ai_answer": result}
    json_data = json.dumps(data)

    return(json_data)
