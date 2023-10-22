// eslint-disable-next-line id-length
const fs = require('fs');
const { exec } = require('child_process');
const { promisify } = require('util');

const cppCode1 = `
#include <iostream>
#include <vector>

int main() {
    std::vector<int> numbers;
    int number;

    while (std::cin >> number && number >= 0) {
        numbers.push_back(number);
    }

    int sum = 0;
    int count = numbers.size();

    for (int num : numbers) {
        sum += num;
    }

    if (count > 0) {
        double average = static_cast<double>(sum) / count;
        std::cout.precision(2);
        std::cout << "Mean score: " << std::fixed << average << std::endl;
    } else {
        std::cout << "Its Empty" << std::endl;
    }

    return 0;
}
`;

async function runCppCode (cppCode, input) {
  // Создаем временный файл с C++ кодом
  await promisify(fs.writeFile)('temp.cpp', cppCode);

  // Компилируем C++ код
  const compileCommand = 'g++ temp.cpp -o temp';
  const { stderr, stdout } = await promisify(exec)(compileCommand);

  if (stderr) {
    throw new Error(`Ошибка компиляции C++ кода: ${stderr}`);
  }

  // Запускаем программу и передаем ввод
  const executeCommand = `echo ${input.join(' ')} -1 | ./temp`;
  const { stderr: error, stdout: output } = await promisify(exec)(executeCommand);

  if (error) {
    throw new Error(`Ошибка выполнения C++ кода: ${error}`);
  }

  // Удаляем временные файлы
  await promisify(fs.unlink)('temp.cpp');
  await promisify(fs.unlink)('temp');

  return output;
}

async function evaluateTasks (cppCode, tasksData) {
  for (const taskData of tasksData) {
    try {
      const input = taskData.input;
      const expectedOutput = taskData.output;
      const output = await runCppCode(cppCode, input);

      console.log('Input:', input.join(' '));
      console.log('Expected Output:', expectedOutput);
      console.log('Actual Output:', output);

      if (output.trim() === expectedOutput.trim()) {
        console.log('Результат совпадает с ожидаемым "output".\n');
      } else {
        console.log('Результат не совпадает с ожидаемым "output".\n');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
}

const tasksData1 = [
  { input: [5, 10, 15, 20], output: 'Mean score: 12.50' },
  { input: [7, 3, -2], output: 'Mean score: 5.00' },
  { input: [0, 0, 0], output: 'Mean score: 0.00' },
  { input: [100, 200, 300, 400, 500, -5], output: 'Mean score: 300.00' },
  { input: [-10], output: 'Its Empty' },
];

evaluateTasks(cppCode1, tasksData1);
