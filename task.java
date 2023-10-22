
    public class Task {
      public static void main(String[] args) {
          int[] numbers = {-10}; // Пример массива для тестирования
  
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
    