---
layout: post
authors: [maarten_casteels]
title: 'Date and Time Testing'
image: /img/2023-04-28-date-time-testing/blog-post-overlay.webp
tags: [testing]
category: Testing
comments: false
---

Working with dates and times can be challenging for developers, especially regarding testing. 
When testing code that involves the current date or time, it takes time to ensure that the results are correct and consistent. 
Luckily, there are several ways to solve this problem.

One approach is to use a fixed date and time in your tests. 
This ensures that your code produces consistent results, regardless of the actual date and time. 
You can achieve this by mocking the `now()` method of the `LocalDateTime` class, which returns the current date and time.

Here's an example of how to mock the `now()` method of the `LocalDateTime` class using Mockito and Java:

```java
try (MockedStatic<LocalDateTime> mockedStatic = Mockito.mockStatic(LocalDateTime.class)) {
    mockedStatic.when(LocalDateTime::now).thenReturn(fixedDate);
    // Your code here.
}
```

In this code snippet, `fixedDate` is a `LocalDateTime` object representing the fixed date and time you want to use in your tests. 
The `MockedStatic` class is a Mockito class that allows you to mock static methods.

To make this code more reusable, you can create a small method that accepts a `fixedDate` and a test in a `Runnable`. 
This will help to improve your code significantly and make it more readable:

```java
private void tryOn(LocalDateTime fixedDate, Runnable test) {
    try (MockedStatic<LocalDateTime> mockedStatic = Mockito.mockStatic(LocalDateTime.class)) {
        mockedStatic.when(LocalDateTime::now).thenReturn(fixedDate);
        test.run();
    }
}
```

You can then use this method in your tests to ensure that your code produces consistent results:

```java
tryOn(fixedDate, () -> {
    // Your code here.
});
```

Using a fixed date and time in your tests ensures that your code produces consistent results, regardless of the actual date and time. 
This can help you to identify and fix bugs more quickly and ensure that your code works as expected in all scenarios.

In summary, when testing code that involves the current date and time, it's essential to use a fixed date and time to ensure consistent results. 
You can achieve this by mocking the `now()` method of the `LocalDateTime` class using Mockito and Java. 
By using a small method like `tryOn`, you can make your code more reusable and easier to read.

A full code example

```java
import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDate;

import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.mockito.Mockito;

class AgeCalculatorTest {

	@Test
	void testCalculateAgeWorksOnlyIn2023() {
		// Arrange
		LocalDate birthDate = LocalDate.of(1993, 4, 27);

		// Act
		int actualAge = AgeCalculator.calculateAge(birthDate);

		// Assert
		int expectedAge = 30;
		assertThat(actualAge).isEqualTo(expectedAge);
	}

	@Test
	void testCalculateAgeWorksEveryYear() {
		// Arrange
		final LocalDate birthDate = LocalDate.of(1993, 4, 27);
		final LocalDate fixedDate = LocalDate.of(2023, 4, 27);

		try (MockedStatic<LocalDate> mockedStatic = Mockito.mockStatic(LocalDate.class)) {
			mockedStatic.when(LocalDate::now).thenReturn(fixedDate);

			// Act
			int actualAge = AgeCalculator.calculateAge(birthDate);

			// Assert
			int expectedAge = 30;
			assertThat(actualAge).isEqualTo(expectedAge);
		}
	}

	@Test
	void testCalculateAgeWorksEveryYearUsingTryOn() {
		// Arrange
		final LocalDate birthDate = LocalDate.of(1993, 4, 27);
		final LocalDate fixedDate = LocalDate.of(2023, 4, 27);

		tryOn(fixedDate, () -> {
			// Act
			int actualAge = AgeCalculator.calculateAge(birthDate);

			// Assert
			int expectedAge = 30;
			assertThat(actualAge).isEqualTo(expectedAge);
		});
	}

	private void tryOn(LocalDate fixedDate, Runnable test) {
		try (MockedStatic<LocalDate> mockedStatic = Mockito.mockStatic(LocalDate.class)) {
			mockedStatic.when(LocalDate::now).thenReturn(fixedDate);

			test.run();
		}
	}

	static class AgeCalculator {

		public static int calculateAge(LocalDate birthDate) {
			LocalDate currentDate = LocalDate.now();
			int age = currentDate.getYear() - birthDate.getYear();
			if (birthDate.getDayOfYear() > currentDate.getDayOfYear()) {
				age--;
			}
			return age;
		}
	}
}
```
