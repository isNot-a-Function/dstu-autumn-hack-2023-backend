from typing import Union

from fastapi import FastAPI
import json


from typing import List, Optional
from pydantic import BaseModel
from calculate_answer import get_answer_by_ai_by_definition, get_answer_by_ai_message_by_question
app = FastAPI()


class MessageDefinitionType(BaseModel):
    content: str


@app.post("/get_answer_by_ai_by_definition")
async def get_by_definition(data: MessageDefinitionType):

    # Создаем экземпляр RootModel из данных
    root_message = MessageDefinitionType.model_validate(data)

    result = get_answer_by_ai_by_definition(root_message.content)
    data = {"ai_answer": result}
    json_data = json.dumps(data)

    return (json_data)


class MessageQuestionType(BaseModel):
    question: str
    answer: str


@app.post("/get_answer_by_ai_message_by_question")
async def get_by_question(data: MessageQuestionType):

    # Создаем экземпляр RootModel из данных
    print(data.question, data.answer)
    result = get_answer_by_ai_message_by_question(data.question, data.answer)
    print(result)
    data = {"ai_answer": result}
    json_data = json.dumps(data)

    return (json_data)
