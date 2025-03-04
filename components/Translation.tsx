import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Volume2 } from 'lucide-react';

interface TranslationProps {
  japanese: string;
  selectedCountry: string;
}

const languageMap: { [key: string]: string } = {
  "Japan": "ja-JP",
  "Spain": "es-ES",
  "France": "fr-FR",
  "Germany": "de-DE",
  "Korea": "ko-KR",
  "Vietnam": "vi-VN",
  "Thailand": "th-TH",
  "English": "en-US",
};

const Translation: React.FC<TranslationProps> = ({ japanese, selectedCountry }) => {
  const [translation, setTranslation] = useState<{ translation: string; pronunciation: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTranslation = async () => {
      try {
        const response = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phrases: [japanese], selectedCountry })
        });
        const data = await response.json();
        setTranslation(data.translatedPhrases[0]);
      } catch (error) {
        console.error("翻訳エラー", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTranslation();
  }, [japanese, selectedCountry]);

  const speakText = (text: string) => {
    if (!window.speechSynthesis) {
      alert("このブラウザは音声合成をサポートしていません。");
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = languageMap[selectedCountry] || "es-ES";
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex items-center justify-between space-x-2 p-2 border-b border-gray-300">
      <div>
        <p className="text-gray-700">{japanese}</p>
        {loading ? (
          <p className="text-gray-500 text-sm">翻訳中...</p>
        ) : translation ? (
          <>
            <p className="text-blue-600 font-medium">{translation.translation}</p>
            <p className="text-gray-500 text-sm">{translation.pronunciation}</p>
          </>
        ) : (
          <p className="text-red-500 text-sm">翻訳できませんでした。</p>
        )}
      </div>
      {translation && <Button onClick={() => speakText(translation.translation)}><Volume2/></Button>}
    </div>
  );
};

export default Translation;
