import { $Enums } from '@prisma/client';
import { evaluateTasks } from '../algoritms/java_parser';

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
        console.log(processSingleResponseTask(task, relevantTaskAnswer));
        break;

      case $Enums.TaskType.multipleResponse:
        console.log(processMultipleResponseTask(task, relevantTaskAnswer));
        break;

      case $Enums.TaskType.detailedResponse:
        console.log(await processDetailedResponseTask(task, relevantTaskAnswer));
        break;

      case $Enums.TaskType.codeResponse:
        console.log(await processCodeResponseTask(task, relevantTaskAnswer));
        break;

      default:
        // Handle unknown task types here
        break;
    }
  }
};
// Define a function for processing singleResponse tasks
function processSingleResponseTask (task: any, relevantTaskAnswer: any) {
  return task.correctSingleAnswer === JSON.parse(relevantTaskAnswer.answer);
}

// Define a function for processing multipleResponse tasks
function processMultipleResponseTask (task: any, relevantTaskAnswer: any) {
  const answerArray = JSON.parse(relevantTaskAnswer.answer);

  return !!(arraysEqual(task.correctMultipleAnswer, answerArray));
}

// Define a function for processing detailedResponse tasks
async function processDetailedResponseTask (task, relevantTaskAnswer) {
  const data = {
    question: task.question,
    // eslint-disable-next-line perfectionist/sort-objects
    answer: relevantTaskAnswer.answer,
  };

  // URL вашего FastAPI-эндпоинта
  const url = 'http://127.0.0.1:8000/get_answer_by_ai_message_by_question';

  try {
    // Выполняем POST-запрос с использованием axios
    const response = await axios.post(url, data);

    // Обрабатываем ответ
    if (response.status === 200) {
      // Здесь можно обработать результат, который вернул сервер
      return JSON.parse(response.data).ai_answer;
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
const sampleData = {
  answer: 'Sample answer',
  createdAt: new Date('2023-10-22T10:00:00Z'),
  id: 1,
  taskAnswers: [
    {
      answer: '2',
      answerModelId: 1,
      id: 1,
      taskId: 1,
      userId: 3,
      verdict: null,
    },
    {
      answer: '[2,7]',
      answerModelId: 1,
      id: 1,
      taskId: 2,
      userId: 3,
      verdict: null,
    },
    {

      // eslint-disable-next-line max-len
      answer: 'Сериализация и десериализация - это процессы, используемые в Java (и многих других языках программирования) для сохранения объектов в поток байтов',
      answerModelId: 1,
      id: 1,
      taskId: 3,
      userId: 3,
      verdict: null,
    },
    {
      // eslint-disable-next-line max-len
      answer: 'public class Task {\n  public static void main(String[] args) {\n    double[] numbers = {array_for_test};\n    long product = calculateOddProduct(numbers[0], numbers[1]);\n\n    System.out.println("Multiply of [" + numbers[0] + ", " + numbers[1] + "]: " + product);\n  }\n\n  public static long calculateOddProduct(int start, int end) {\n    long product = 1;\n    for (int i = start; i <= end; i++) {\n      if (i % 2 != 0) { // Проверка на нечетное число\n        product *= i;\n      }\n    }\n    return product;\n  }\n}',
      answerModelId: 1,
      id: 1,
      taskId: 4,
      userId: 4,
      verdict: null,
    },
  ],
  test: {
    createdAt: new Date('2023-10-21T14:30:00Z'),
    id: 2,
    tasks: [
      {
        code: null,
        correctMultipleAnswer: [],
        correctSingleAnswer: 2,
        createdAt: new Date('2023-10-21T14:45:00Z'),
        id: 1,
        question: 'What is 2 + 2?',
        testId: null,
        type: $Enums.TaskType.singleResponse,
        variants: ['3', '4', '5'],
      },
      {
        code: null,
        correctMultipleAnswer: [2, 7],
        correctSingleAnswer: null,
        createdAt: new Date('2023-10-21T15:15:00Z'),
        id: 2,
        question: 'Select all prime numbers:',
        testId: null,
        type: $Enums.TaskType.multipleResponse,
        variants: ['2', '4', '7', '9'],
      },
      {
        code: null,
        correctMultipleAnswer: [2, 7],
        correctSingleAnswer: null,
        createdAt: new Date('2023-11-21T15:15:00Z'),
        id: 3,
        question: 'Что такое сериализация и десериализация объектов в Java?',
        testId: null,
        type: $Enums.TaskType.detailedResponse,
        variants: ['2', '4', '7', '9'],
      },
      {

        // eslint-disable-next-line max-len
        code: '[{"input":[5,10,15,20,-1],"output":"Mean score: 12.50"},{"input":[7,3,-2],"output":"Mean score: 5.00"}]',
        correctMultipleAnswer: [2, 7],
        correctSingleAnswer: null,
        createdAt: new Date('2023-12-21T15:15:00Z'),
        id: 4,
        // eslint-disable-next-line max-len
        question: 'Написать программу для подсчета среднего значения чисел, введенных пользователем, до первого отрицательного числа',
        testId: null,
        type: $Enums.TaskType.codeResponse,
        variants: ['2', '4', '7', '9'],
      },
    ],
    title: 'Sample Test',
  },
  testId: 2,
};

TestAnswers(sampleData)
  .then((result) => {
    // Обработка результата, если функция возвращает Promise
    console.log(result);
  })
  .catch((error) => {
    // Обработка ошибки, если функция возвращает Promise и произошла ошибка
    console.error(error);
  });
