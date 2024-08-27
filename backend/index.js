const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const olympicKeywords = [
    'olympics', 'olympic games', 'athletics', 'swimming', 'gymnastics', 'track and field',
  'basketball', 'volleyball', 'soccer', 'football', 'tennis', 'cycling', 'rowing', 'fencing',
  'wrestling', 'boxing', 'judo', 'taekwondo', 'weightlifting', 'archery', 'badminton',
  'canoeing', 'diving', 'equestrian', 'handball', 'hockey', 'karate', 'modern pentathlon',
  'sailing', 'shooting', 'skateboarding', 'sport climbing', 'surfing', 'table tennis',
  'triathlon', 'water polo', 'olimpíadas', 'jogos olímpicos', 'atletismo', 'natação', 'ginástica', 'atletismo',
  'basquete', 'vôlei', 'futebol', 'futebol', 'tênis', 'ciclismo', 'remo', 'esgrima',
  'luta livre', 'boxe', 'judô', 'taekwondo', 'levantamento de peso', 'tiro com arco', 'badminton',
  'canoagem', 'mergulho', 'hipismo', 'handebol', 'hóquei', 'caratê', 'pentatlo moderno',
  'vela', 'tiro', 'skate', 'escalada esportiva', 'surf', 'tênis de mesa',
  'triatlo', 'pólo aquático'
];

function isOlympicRelated(message) {
    return olympicKeywords.some(keyword => message.toLowerCase().includes(keyword));
}

app.post('/chat', async (req, res) => {
    const { message, language } = req.body;
  
    console.log('Received message:', message);
    console.log('Is Olympic related:', isOlympicRelated(message));
  
    if (!isOlympicRelated(message)) {
      return res.status(400).json({ error: language === 'Pt' ? 'Pergunta não relacionada a esportes olímpicos. Por favor, pergunte sobre esportes olímpicos.' : 'Question not related to Olympic sports. Please ask about Olympic sports.' });
    }
  
    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: message }],
        language: language,
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });
  
      res.json(response.data);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

  

  const port = process.env.PORT || 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
  });
