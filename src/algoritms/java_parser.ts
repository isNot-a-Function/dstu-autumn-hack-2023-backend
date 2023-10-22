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

// Пример использования
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
//   })
// //   .catch((error) => {
// //     console.error('Error:', error);
// //   });
// const tasksData1 = [
//   {
//     input: [1, 10],
//     output: 'Sum 1 to 10, multiplicity 3 or 5: 33',
//   },
//   {
//     input: [5, 15],
//     output: 'Sum 5 to 15, multiplicity 3 or 5: 68',
//   },
//   {
//     input: [2, 8],
//     output: 'Sum 2 to 8, multiplicity 3 or 5: 14',
//   },
//   {
//     input: [-3, 3],
//     output: 'Sum -3 to 3, multiplicity 3 or 5: 0',
//   },
//   {
//     input: [10, 20],
//     output: 'Sum 10 to 20, multiplicity 3 or 5: 98',
//   },
// ];

// const javaCode1 = `
// public class Task {
//   public static void main(String[] args) {
//       int [] numbers = {array_for_test};
//       long product = calculateOddProduct(numbers[0] , numbers[1]);

//       System.out.println("Multiply of [" + numbers[0]+ ", " + numbers[1]+ "]: " + product);
//   }

//   public static long calculateOddProduct(int start, int end) {
//       long product = 1;
//       for (int i = start; i <= end; i++) {
//           if (i % 2 != 0) { // Проверка на нечетное число
//               product *= i;
//           }
//       }
//       return product;
//   }
// }
//     `;

export async function evaluateTasks (code: string, tasksData) {
  for (const taskData of tasksData) {
    console.log(code);
    console.log(taskData);
    const javaCode = code.replace('array_for_test', `${taskData.input.join(', ')}`);

    try {
      const compileResult = await compileAndSaveJavaCode(javaCode);

      // console.log('Compilation Result:', compileResult);

      const executionResult = await runCompiledJavaCode();

      console.log('Execution Result:', executionResult);

      // Сравните результат выполнения с ожидаемым "output"
      if ((executionResult.trim() !== taskData.output)) {
        return false;
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
  return true;
}
