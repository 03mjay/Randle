import { randomUUID } from 'crypto';

const LANGUAGES = [
  'Spanish','French','German','Italian','Portuguese','Russian','Chinese','Japanese','Korean','Hindi',
  'Arabic','Turkish','Greek','Dutch','Swedish','Finnish','Vietnamese','Thai','Hebrew','Polish',
  'Bengali','Urdu','Punjabi','Marathi','Tamil','Telugu','Kannada','Malayalam','Gujarati','Burmese',
  'Filipino','Indonesian','Malay','Romanian','Hungarian','Czech','Slovak','Serbian','Croatian','Bulgarian',
  'Ukrainian','Lithuanian','Latvian','Estonian','Icelandic','Swahili','Zulu','Amharic','Maori','Hawaiian'
];

let dailyData = { date: '', word: '', options: [] };

export default function handler(req, res) {
  const today = new Date().toLocaleDateString('en-US', { timeZone: 'America/New_York' });
  if(dailyData.date !== today) {
    const word = LANGUAGES[Math.floor(Math.random() * LANGUAGES.length)];
    let options = [word];
    while(options.length<4){
      const opt = LANGUAGES[Math.floor(Math.random() * LANGUAGES.length)];
      if(!options.includes(opt)) options.push(opt);
    }
    options = options.sort(()=>Math.random()-0.5);
    dailyData = { date: today, word, options };
  }
  res.status(200).json(dailyData);
}
