const Pusher = require('pusher');

// Инициализация Pusher
const initializePusher = () => {
  return new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_APP_KEY,
    secret: process.env.PUSHER_APP_SECRET,
    cluster: 'eu',
    useTLS: true,
  });
};

// Валидация тела запроса
const validateRequestBody = (body) => {
  if (!body.socket_id || !body.channel_name) {
    throw new Error("Отсутствуют socket_id или channel_name");
  }

  if (!body.channel_name.startsWith('private-')) {
    throw new Error("Недопустимое имя канала");
  }
};

exports.handler = async (event) => {
  console.log('Запрос получен:', event);

  // Проверка наличия тела запроса
  if (!event.body) {
    console.error('Тело запроса отсутствует');
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Тело запроса отсутствует" }),
    };
  }

  // Парсинг тела запроса
  let body;
  try {
    body = JSON.parse(event.body);
  } catch (error) {
    console.error('Невалидный JSON в теле запроса:', error);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Невалидный JSON в теле запроса" }),
    };
  }

  // Валидация тела запроса
  try {
    validateRequestBody(body);
  } catch (error) {
    console.error('Ошибка валидации:', error.message);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message }),
    };
  }

  const { socket_id: socketId, channel_name: channelName } = body;

  // Инициализация Pusher
  const pusher = initializePusher();

  // Аутентификация
  try {
    const auth = pusher.authenticate(socketId, channelName);
    console.log('Аутентификация успешна:', auth);
    return {
      statusCode: 200,
      body: JSON.stringify(auth),
    };
  } catch (error) {
    console.error('Ошибка аутентификации:', error);
    return {
      statusCode: 403,
      body: JSON.stringify({ error: "Ошибка аутентификации" }),
    };
  }
};