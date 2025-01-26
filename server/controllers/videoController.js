// Логика для управления видеосоединениями
const startVideoChat = (req, res) => {
    res.json({ message: 'Видеочат начат' });
  };
  
  const stopVideoChat = (req, res) => {
    res.json({ message: 'Видеочат остановлен' });
  };
  
  module.exports = { startVideoChat, stopVideoChat };