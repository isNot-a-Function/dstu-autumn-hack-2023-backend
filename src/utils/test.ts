import { $Enums } from '@prisma/client';
import { evaluateTasks } from 'algoritms/java_parser';

const axios = require('axios');

export const TestAnswers = async (answer: {
  test: {
      id: number;
      createdAt: Date;
      title: string;
      tasks: {
        id: number;
        createdAt: Date;
        testId: number | null;
        type: $Enums.TaskType;
        question: string;
        variants: string[];
        correctSingleAnswer: number | null;
        correctMultipleAnswer: number[];
        code: string | null;
    }[];
  };
  taskAnswers: {
      id: number;
      answer: string;
      verdict: number | null;
      answerModelId: number;
      taskId: number;
      userId: number;
  }[];
} & {
  id: number;
  createdAt: Date;
  answer: string | null;
  testId: number;
}) => {
  // Iterate through tasks
  for (const task of answer.test.tasks) {
    // Find the relevant task answer for the current task
    const relevantTaskAnswer = answer.taskAnswers.find((answer1) => answer1.taskId === task.id);

    // Determine the task type
    switch (task.type) {
      case $Enums.TaskType.singleResponse:
        processSingleResponseTask(task, relevantTaskAnswer);
        break;

      case $Enums.TaskType.multipleResponse:
        processMultipleResponseTask(task, relevantTaskAnswer);
        break;

      case $Enums.TaskType.detailedResponse:
        processDetailedResponseTask(task, relevantTaskAnswer);
        break;

      case $Enums.TaskType.codeResponse:
        processCodeResponseTask(task, relevantTaskAnswer);
        break;

      default:
        // Handle unknown task types here
        break;
    }
  }
};
// Define a function for processing singleResponse tasks
function processSingleResponseTask (task: any, relevantTaskAnswer: any) {
  return task.correctSingleAnswer === relevantTaskAnswer.verdict;
}

// Define a function for processing multipleResponse tasks
function processMultipleResponseTask (task: any, relevantTaskAnswer: any) {
  const answerArray = JSON.parse(relevantTaskAnswer.answer);

  return !!(arraysEqual(task.correctMultipleAnswer, answerArray));
}

// Define a function for processing detailedResponse tasks
async function processDetailedResponseTask (task, relevantTaskAnswer) {
  const data = {
    answer: relevantTaskAnswer.answer,
    question: task.question,
  };

  // URL вашего FastAPI-эндпоинта
  const url = 'http://127.0.0.1:8000/get_answer_by_ai_message_by_question';

  try {
    // Выполняем POST-запрос с использованием axios
    const response = await axios.post(url, data);

    // Обрабатываем ответ
    if (response.status === 200) {
      // Здесь можно обработать результат, который вернул сервер
      return response.data.ai_answer;
    }
    // Обработка ошибок
    console.error(`HTTP Error: ${response.status}`);
    return false; // Вернуть значение (например, false) при ошибке
  } catch (error) {
    // Обработка ошибок при выполнении запроса
    console.error(error);
    return false; // Вернуть значение (например, false) при ошибке
  }
}

// Define a function for processing codeResponse tasks
async function processCodeResponseTask (task: any, relevantTaskAnswer: any) {
  // Вызываем функцию evaluateTasks, передавая relevantTaskAnswer.answer и task.code
  const taskData = JSON.parse(task.code);

  return evaluateTasks(relevantTaskAnswer.answer, taskData);
}
function arraysEqual (arr1, arr2) {
  // Если массивы разной длины, они точно не совпадают
  if (arr1.length !== arr2.length) {
    return false;
  }

  // Сортируем массивы и сравниваем элементы
  const sortedArr1 = arr1.slice().sort();
  const sortedArr2 = arr2.slice().sort();

  for (let i = 0; i < sortedArr1.length; i++) {
    if (sortedArr1[i] !== sortedArr2[i]) {
      return false;
    }
  }

  return true;
}
