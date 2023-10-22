const fs = require('fs');
const { exec } = require('child_process');
const { promisify } = require('util');

const tasksData1 = [
  { input: [5, 10, 15, 20], output: 'Mean score: 12.50' },
  { input: [7, 3, -2], output: 'Mean score: 5.00' },
  { input: [0, 0, 0], output: 'Mean score: 0.00' },
  { input: [100, 200, 300, 400, 500, -5], output: 'Mean score: 300.00' },
  { input: [-10], output: 'Its Empty' },
];
const rustCode1 = `
use std::io;

fn main() {
    let mut input = String::new();
    io::stdin().read_line(&mut input).expect("Failed to read input");
    let numbers: Vec<i32> = input.split_whitespace().map(|s| s.parse().unwrap()).collect();

    let mut sum = 0;
    let mut count = 0;

    for number in &numbers {
        if *number < 0 {
            break;
        }
        sum += *number;
        count += 1;
    }

    if count > 0 {
        let average = sum as f64 / count as f64;
        println!("Mean score: {:.2}", average);
    } else {
        println!("Its Empty");
    }
}
`;

async function runRustCode (rustCode, input) {
  // Создаем временный файл с Rust кодом
  await promisify(fs.writeFile)('temp.rs', rustCode);

  // Компилируем Rust код
  const compileCommand = 'rustc temp.rs -o temp';
  const { stderr, stdout } = await promisify(exec)(compileCommand);

  if (stderr) {
    throw new Error(`Ошибка компиляции Rust кода: ${stderr}`);
  }

  // Запускаем программу и передаем ввод
  const executeCommand = `echo ${input.join(' ')} -1 | ./temp`;
  const { stderr: error, stdout: output } = await promisify(exec)(executeCommand);

  if (error) {
    throw new Error(`Ошибка выполнения Rust кода: ${error}`);
  }

  // Удаляем временные файлы
  await promisify(fs.unlink)('temp.rs');
  await promisify(fs.unlink)('temp');

  return output;
}

async function evaluateTasks (rustCode, tasksData) {
  for (const taskData of tasksData) {
    try {
      const input = taskData.input;
      const expectedOutput = taskData.output;
      const output = await runRustCode(rustCode, input);

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

evaluateTasks(rustCode1, tasksData1);
