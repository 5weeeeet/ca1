import React from 'react';
import {Button} from './button';

const LoginForm = () => {
  return (
    <form>
      <Button variant="primary">Войти</Button>
      <Button variant="secondary">Регистрация</Button>
    </form>
  );
};

export { Button };

