import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Confetti from 'react-confetti';

const INITIAL_TIMER = 120;

const LANGUAGES = [
  'Spanish','French','German','Italian','Portuguese','Russian','Chinese','Japanese','Korean','Hindi',
  'Arabic','Turkish','Greek','Dutch','Swedish','Finnish','Vietnamese','Thai','Hebrew','Polish',
  'Bengali','Urdu','Punjabi','Marathi','Tamil','Telugu','Kannada','Malayalam','Gujarati','Burmese',
  'Filipino','Indonesian','Malay','Romanian','Hungarian','Czech','Slovak','Serbian','Croatian','Bulgarian',
  'Ukrainian','Lithuanian','Latvian','Estonian','Icelandic','Swahili','Zulu','Amharic','Maori','Hawaiian'
];

export default function App() {
  const [daily, setDaily] = useState(null);
  const [infiniteMode, setInfiniteMode] = useState(false);
  const [infiniteWord, setInfiniteWord] = useState(null);
  const [timer, setTimer] = useState(INITIAL_TIMER);
  const [intervalId, setIntervalId] = useState(null);
  const [relisens, setRelisens] = useState(0);
  const [selected, setSelected] = useState(null);
  const [correct, setCorrect] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const timerRef = useRef(timer);

  // fetch daily word
  useEffect(()=>{
    axios.get('/api/daily-word').then(res=>setDaily(res.data));
  },[]);

  // Timer logic
  useEffect(()=>{
    timerRef.current = timer;
    if(timer<=0){
      clearInterval(intervalId);
      setCorrect(false);
    }
  },[timer]);

  const startTimer = () => {
    if(intervalId) return;
    const id = setInterval(()=>{
      setTimer(prev=>prev-1);
    },1000);
    setIntervalId(id);
  }

  const listenAudio = () => {
    startTimer();
    // Fake TTS: alert word, in real deploy replace with real TTS
    const word = infiniteMode? infiniteWord?.word : daily?.word;
    alert(`Listen: ${word}`);
    if(relisens===0){
      setTimer(prev=>prev-5);
      setRelisens(1);
    } else {
      const penalty = 5 * Math.pow(2, relisens-1);
      setTimer(prev=>prev-penalty);
      setRelisens(prev=>prev+1);
    }
  }

  const selectOption = (option) => {
    setSelected(option);
    const correctWord = infiniteMode? infiniteWord.word : daily.word;
    if(option===correctWord){
      setCorrect(true);
      setShowConfetti(true);
      clearInterval(intervalId);
    } else {
      setCorrect(false);
      clearInterval(intervalId);
    }
  }

  const nextInfinite = () => {
    const remaining = LANGUAGES.filter(l=>l!==infiniteWord?.word);
    const word = remaining[Math.floor(Math.random()*remaining.length)];
    let options = [word];
    while(options.length<4){
      const opt = LANGUAGES[Math.floor(Math.random()*LANGUAGES.length)];
      if(!options.includes(opt)) options.push(opt);
    }
    options.sort(()=>Math.random()-0.5);
    setInfiniteWord({word,options});
    setTimer(INITIAL_TIMER);
    setIntervalId(null);
    setRelisens(0);
    setSelected(null);
    setCorrect(null);
    setShowConfetti(false);
  }

  const startInfinite = () => {
    setInfiniteMode(true);
    nextInfinite();
  }

  if(!daily) return <div className="text-center mt-20 text-xl">Loading...</div>;

  const currentWord = infiniteMode? infiniteWord : daily;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-5 bg-white shadow rounded">
      {showConfetti && <Confetti />}
      <h1 className="text-3xl font-bold text-center mb-5">Randle</h1>
      {!infiniteMode && <button onClick={startInfinite} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Start Infinite Mode</button>}
      <div className="text-center mb-4">Timer: {timer}s</div>
      <button onClick={listenAudio} disabled={correct!==null} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mb-4">
        Listen
      </button>
      <div className="grid grid-cols-2 gap-4 mb-4">
        {currentWord?.options?.map(opt=>(
          <button key={opt} disabled={selected!==null} onClick={()=>selectOption(opt)}
            className={`px-4 py-2 rounded ${selected===opt? (correct? 'bg-green-500':'bg-red-500'):'bg-gray-200 hover:bg-gray-300'}`}>
            {opt}
          </button>
        ))}
      </div>
      {correct!==null && (
        <div className="text-center mb-4">
          Word: {currentWord.word} ({currentWord.word})
        </div>
      )}
      {infiniteMode && correct && <button onClick={nextInfinite} className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">Next Word</button>}
    </div>
  );
}
