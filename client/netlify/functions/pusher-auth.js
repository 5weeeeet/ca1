const Pusher = require('pusher');

exports.handler = async (event) => {
  const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_APP_KEY,
    secret: process.env.PUSHER_APP_SECRET,
    cluster: 'eu',
    useTLS: true,
  });

  const { socket_id: socketId, channel_name: channelName } = JSON.parse(event.body);

  try {
    const auth = pusher.authenticate(socketId, channelName);
    return {
      statusCode: 200,
      body: JSON.stringify(auth),
    };
  } catch (error) {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: 'Forbidden' }),
    };
  }
};