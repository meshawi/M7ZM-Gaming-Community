import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Translate = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [translationDirection, setTranslationDirection] = useState('en-ar');
  const { t } = useTranslation();

  const enToArTranslationMap = {
    '2': 'ى',
    '3': 'ع',
    '4': 'ذ',
    '5': 'خ',
    '6': 'ط',
    '7': 'ح',
    '8': 'ق',
    '9': 'ص',
    'a': 'ا',
    'b': 'ب',
    'c': 'س',
    'd': 'د',
    'e': 'ي',
    'f': 'ف',
    'g': 'ق',
    'h': 'ه',
    'i': 'ي',
    'j': 'ج',
    'k': 'ك',
    'l': 'ل',
    'm': 'م',
    'n': 'ن',
    'o': 'و',
    'p': 'ب',
    'q': 'ك',
    'r': 'ر',
    's': 'س',
    't': 'ت',
    'u': 'و',
    'v': 'ڤ',
    'w': 'و',
    'x': 'اكس',
    'y': 'ي',
    'z': 'ز',
    'sh': 'ش',
    'th': 'ث',
    "3'": 'غ',
    "6'": 'ض',
    "9'": 'ظ',
    // Add more mappings here...
  };

  const arToEnTranslationMap = {
    'ى': '2',
    'ع': '3',
    'ذ': '4',
    'خ': '5',
    'ط': '6',
    'ح': '7',
    'ق': '8',
    'ص': '9',
    'ا': 'a',
    'ب': 'b',
    'س': 'c',
    'د': 'd',
    'ي': 'e',
    'ف': 'f',
    'ق': 'g',
    'ه': 'h',
    'ي': 'i',
    'ج': 'j',
    'ك': 'k',
    'ل': 'l',
    'م': 'm',
    'ن': 'n',
    'و': 'o',
    'ر': 'r',
    'س': 's',
    'ت': 't',
    'ڤ': 'v',
    'اكس': 'x',
    'ي': 'y',
    'ز': 'z',
    'ش': 'sh',
    'ث': 'th',
    'ض': "6'",
    'ظ': "9'",
    // Add more mappings here...
  };

  const switchTranslationDirection = () => {
    setTranslationDirection((prevDirection) =>
      prevDirection === 'en-ar' ? 'ar-en' : 'en-ar'
    );
    setOutputText(''); // Clear output when switching direction
  };

  const translateText = () => {
    let output = '';
    const text = inputText.toLowerCase(); // Convert input to lowercase
    if (translationDirection === 'en-ar') {
      for (let i = 0; i < text.length; i++) {
        const translatedChar = enToArTranslationMap[text.substring(i, i + 2)];
        if (translatedChar) {
          output += translatedChar;
          i++; // Skip next character
        } else {
          const char = enToArTranslationMap[text[i]];
          output += char ? char : text[i];
        }
      }
    } else if (translationDirection === 'ar-en') {
      for (let i = 0; i < text.length; i++) {
        const char = arToEnTranslationMap[text[i]];
        output += char ? char : text[i];
      }
    }
    setOutputText(output);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="bg-primary-100 p-8 rounded-lg shadow-md w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">{t('characterTranslator')}</h1>
        <textarea
          id="inputText"
          placeholder={t('enterText')}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />
        <button
          onClick={switchTranslationDirection}
          className="w-full bg-blue-500 text-white p-2 rounded mb-4"
        >
          {translationDirection === 'en-ar' ? t('translateEnToAr') : t('translateArToEn')}
        </button>
        <button
          onClick={translateText}
          className="w-full bg-green-500 text-white p-2 rounded mb-4"
        >
          {t('translate')}
        </button>
        <textarea
          id="outputText"
          placeholder={t('translatedText')}
          value={outputText}
          readOnly
          className="w-full p-2 border rounded"
        />
      </div>
    </div>
  );
};

export default Translate;
