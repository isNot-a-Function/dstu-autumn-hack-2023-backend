import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';

const writeFileAsync = promisify(fs.writeFile);
const execAsync = promisify(exec);

async function compileAndSaveJavaCode (javaCode: string): Promise<string> {
  // Записываем строку Java-кода в файл
  await writeFileAsync('Task.java', javaCode, 'utf8');

  // Команда для компиляции файла
  const compileCommand = 'javac Task.java';

  // Выполняем компиляцию с помощью javac
  const { stderr } = await execAsync(compileCommand);

  if (stderr) {
    throw new Error(stderr); // Compilation failed
  }

  return 'Compilation successful';
}

async function runCompiledJavaCode (): Promise<string> {
  // Команда для выполнения скомпorрованного Java-кода
  const runCommand = 'java Task';

  const { stderr, stdout } = await execAsync(runCommand);

  if (stderr) {
    throw new Error(stderr); // Execution failed
  }

  return stdout; // Execution successful
}

// const javaCode = `
// public class Task {    public static void main(String[] args) {
//   int[] numbers = {5, 8, 13, 21, 34, 55, 89};
//   int sum = 0;        for (int number : numbers) {
//       sum += number;        }
//           double average = (double) sum / numbers.length;
//   System.out.println("Mean: " + average);    }
// }
// `;

// compileAndSaveJavaCode(javaCode)
//   .then((compileResult) => {
//     console.log('Compilation Result:', compileResult);

//     return runCompiledJavaCode();
//   })
//   .then((executionResult) => {
//     console.log('Execution Result:', executionResult);
//   });
//   .catch((error) => {
//     console.error('Error:', error);
//   });
const tasksData1 = [
  { input: [5, 10, 15, 20, -1], output: 'Mean score: 12,50' },
  { input: [7, 3, -2], output: 'Mean score: 5,00' },
  { input: [0, 0, 0, -1], output: 'Mean score: 0,00' },
  { input: [100, 200, 300, 400, 500, -5], output: 'Mean score: 300,00' },
  { input: [-10], output: 'Its Empty' },
];

async function evaluateTasks () {
  for (const taskData of tasksData1) {
    const javaCode = `
    public class Task {
      public static void main(String[] args) {
          int[] numbers = {${taskData.input.join(', ')}}; // Пример массива для тестирования
  
          int sum = 0;
          int count = 0;
  
          for (int number : numbers) {
              if (number < 0) {
                  break;
              }
  
              sum += number;
              count++;
          }
  
          if (count > 0) {
              double average = (double) sum / count;
              System.out.printf("Mean score: %.2f", average);
          } else {
              System.out.println("Its Empty");
          }
          System.out.println();
      }
  }  
    `;

    try {
      const compileResult = await compileAndSaveJavaCode(javaCode);

      console.log('Compilation Result:', compileResult);

      const executionResult = await runCompiledJavaCode();

      console.log('Execution Result:', executionResult);

      // Сравните результат выполнения с ожидаемым "output"
      if (executionResult.trim() === taskData.output) {
        console.log('Результат совпадает с ожидаемым "output".');
      } else {
        console.log('Результат не совпадает с ожидаемым "output".');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
}

evaluateTasks();
