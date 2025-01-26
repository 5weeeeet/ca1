const Pusher = require('pusher');

exports.handler = async (event) => {
  // Проверяем, что тело запроса существует
  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Тело запроса отсутствует" }),
    };
  }

  // Пытаемся распарсить тело запроса
  let body;
  try {
    body = JSON.parse(event.body);
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Невалидный JSON в теле запроса" }),
    };
  }

  // Проверяем, что необходимые поля присутствуют
  if (!body.socket_id || !body.channel_name) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Отсутствуют socket_id или channel_name" }),
    };
  }

  const { socket_id: socketId, channel_name: channelName } = body;

  // Инициализируем Pusher
  const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_APP_KEY,
    secret: process.env.PUSHER_APP_SECRET,
    cluster: 'eu',
    useTLS: true,
  });

  try {
    // Аутентифицируем пользователя
    const auth = pusher.authenticate(socketId, channelName);
    return {
      statusCode: 200,
      body: JSON.stringify(auth),
    };
  } catch (error) {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: "Ошибка аутентификации" }),
    };
  }
};