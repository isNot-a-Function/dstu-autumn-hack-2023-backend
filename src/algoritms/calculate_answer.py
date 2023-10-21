import g4f

from googletrans import Translator

async def translate_to_english(text):
    translator = Translator()
    translated = translator.translate(text, src='ru', dest='en')
    return translated.text

async def get_answer_by_ai_message_by_question(question,answer):
  g4f.logging = False # enable logging
  g4f.check_version = False # Disable automatic version checking
  print(g4f.version) # check version
  print(g4f.Provider.Ails.params)  # supported args

  question_eng = await translate_to_english(question)
  answer_eng = await translate_to_english(answer)
  # Automatic selection of provider
  request = f"""You have to work as a validation of the answers. I'm giving you the question and the user's answer.
  Analyzing the context, it is necessary to answer correctly or not the user answered.
  Please answer only with the words 'yes' if the definition is true or 'no' if it is false.
  Question: "{question_eng}";
  User Answer: "{answer_eng}"
  """
  # streamed completion
  response = g4f.ChatCompletion.create(
      model="gpt-3.5-turbo",
      messages=[{"role": "user", "content": request}],
      stream=True,
  )

  for message in response:
      result_text+=message
  result = False
  if('yes' in result_text.lower()):
    result = True
  return result

async def get_answer_by_ai_by_definition(message):
  g4f.logging = False # enable logging
  g4f.check_version = False # Disable automatic version checking
  print(g4f.version) # check version
  print(g4f.Provider.Ails.params)  # supported args

  definition = await translate_to_english(message)
  # Automatic selection of provider
  request = f"""It is necessary to act in the role of Checking tasks.definition: "<{definition}>" is it true? 
  Please answer only with the words 'yes' if the definition is true or 'no' if it is false."""
  # streamed completion
  response = g4f.ChatCompletion.create(
      model="gpt-3.5-turbo",
      messages=[{"role": "user", "content": request}],
      stream=True,
  )

  for message in response:
      result_text+=message
  result = False
  if('yes' in result_text.lower()):
    result = True
  return result
