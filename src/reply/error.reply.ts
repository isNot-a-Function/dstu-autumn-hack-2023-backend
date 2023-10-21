/* eslint-disable perfectionist/sort-objects */

export const ErrorReply = {
  BaseErrorStatus: 400,

  ValidationErrorStatus: 400,
  ValidationErrorMessage: 'Ошибка валидации данных',

  EmailDoesNotExistErrorStatus: 400,
  EmailDoesNotExistErrorMessage: 'Данной почты не существует \n Для регистрации используйте настоящие данные',

  UserExistErrorStatus: 400,
  UserExistErrorMessage: `Пользователь с такой почтой уже зарегистрированн 
  \n Авторизируйтесь или используйте другую почту`,

  PasswordValidationErrorStatus: 400,
  PasswordValidationErrorMessage: 'Неверный пароль',

  EmailValidationErrorStatus: 400,
  EmailValidationErrorMessage: 'Пользователя с такой почтой не существует',

  TokenIsNotExistErrorStatus: 402,

  TokenIsInvalidErrorStatus: 401,

  AccessDeniedErrorStatus: 400,
  AccessDeniedErrorMessage: 'Ошибка доступа',
};
