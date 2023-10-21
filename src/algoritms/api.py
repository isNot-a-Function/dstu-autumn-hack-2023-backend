from typing import Union

from fastapi import FastAPI
import json


from typing import List, Optional
from pydantic import BaseModel
from calculate_answer import get_answer_by_ai_by_definition,get_answer_by_ai_message_by_question
app = FastAPI()

class MessageDefinitionType(BaseModel):
    content: str

class MessageQuestionType(BaseModel):
    question: str
    answer: str


@app.post("/get_answer_by_ai_by_definition")
async def get_by_definition(data: MessageDefinitionType):

    # Создаем экземпляр RootModel из данных
    root_message = MessageDefinitionType.model_validate(data)

    result = get_answer_by_ai_by_definition(root_message.content)
    data = {"ai_answer": result}
    json_data = json.dumps(data)

    return(json_data)


@app.post("/get_answer_by_ai_message_by_question")
async def get_by_question(data: MessageQuestionType):

    # Создаем экземпляр RootModel из данных
    root_message = MessageQuestionType.model_validate(data)

    result = get_answer_by_ai_message_by_question(root_message.question,root_message.answer)
    data = {"ai_answer": result}
    json_data = json.dumps(data)

    return(json_data)

