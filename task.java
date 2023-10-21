  
public class Task {
  public static void main(String[] args) {
      int [] numbers = {10, 20};
      long product = calculateOddProduct(numbers[0] , numbers[1]);

      System.out.println("Multiply of [" + numbers[0]+ ", " + numbers[1]+ "]: " + product);
  }

  public static long calculateOddProduct(int start, int end) {
      long product = 1;
      for (int i = start; i <= end; i++) {
          if (i % 2 != 0) { // Проверка на нечетное число
              product *= i;
          }
      }
      return product;
  }
}
    