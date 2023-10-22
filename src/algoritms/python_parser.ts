const { spawn } = require('child_process');

function runPythonCode (pythonCode, callback) {
  const pythonProcess = spawn('python', ['-c', pythonCode]);

  let outputData = '';

  pythonProcess.stdout.on('data', (data) => {
    // Обработка частей вывода Python
    outputData += data;
  });

  pythonProcess.stderr.on('data', (data) => {
    // Обработка ошибок Python
    callback(data.toString(), null);
  });

  pythonProcess.on('close', (code) => {
    if (code === 0) {
      callback(null, outputData);
    } else {
      // eslint-disable-next-line n/no-callback-literal
      callback(`Python код завершился с ошибкой, код: ${code}`, null);
    }
  });
}
const tasksData1 = [
  { input: [5, 10, 15, 20, -1], output: 'Mean score: 12.50' },
  { input: [7, 3, -2], output: 'Mean score: 5.00' },
  { input: [0, 0, 0, -1], output: 'Mean score: 0.00' },
  { input: [100, 200, 300, 400, 500, -5], output: 'Mean score: 300.00' },
  { input: [-10], output: 'Its Empty' },
];
const code = `
numbers = [array_for_test]  # Пример списка для тестирования

sum = 0
count = 0

for number in numbers:
    if number < 0:
        break

    sum += number
    count += 1

if count > 0:
    average = float(sum) / count
    print("Mean score: {:.2f}".format(average))
else:
    print("Its Empty")
`;

async function evaluateTasks (pythonCodeTmp, tasksData) {
  for (const taskData of tasksData) {
    const pythonCode = pythonCodeTmp.replace('array_for_test', `${taskData.input.join(', ')}`);

    try {
      console.log(`${taskData.input.join(', ')}`);

      runPythonCode(pythonCode, (error, output) => {
        if (error) {
          console.error('Ошибка выполнения Python кода:', error);
        } else {
          console.log(output.replace('\n', ''));
          console.log(taskData.output);
          if (output.trim() === taskData.output.trim()) {
            console.log('Результат совпадает с ожидаемым "output".');
          } else {
            console.log('Результат не совпадает с ожидаемым "output".');
          }
        }
      });
      // Сравните результат выполнения с ожидаемым "output"
    } catch (error) {
      console.error('Error:', error);
    }
  }
}

evaluateTasks(code, tasksData1);
