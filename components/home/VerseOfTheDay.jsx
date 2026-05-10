'use client';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Download, BookOpen, RefreshCw } from 'lucide-react';

const BIBLE_VERSES = [
  { ref: 'John 3:16', en: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.', ta: 'தேவன் இந்த உலகத்தை மிகவும் நேசித்தார், அதனால் தம்முடைய ஒரே குமாரனை கொடுத்தார்.' },
  { ref: 'Psalm 23:1', en: 'The Lord is my shepherd, I lack nothing.', ta: 'கர்த்தர் என் மேய்ப்பர்; எனக்கு குறைவு இராது.' },
  { ref: 'Philippians 4:13', en: 'I can do all this through him who gives me strength.', ta: 'என்னை பலப்படுத்துகிற கிறிஸ்துவினால் எல்லாவற்றையும் செய்யக்கூடும்.' },
  { ref: 'Romans 8:28', en: 'And we know that in all things God works for the good of those who love him.', ta: 'தேவனிடத்தில் அன்பு கூர்கிறவர்களுக்கு எல்லாம் நன்மைக்கு ஏதுவாக நடக்கிறது.' },
  { ref: 'Jeremiah 29:11', en: 'For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you.', ta: 'உங்களுக்கு நான் நினைக்கும் நினைவுகளை அறிவேன்; அவைகள் தீமையல்ல, நன்மையாயிருக்கும்.' },
];

export default function VerseOfTheDay() {
  const { language } = useSelector((s) => s.ui);
  const [verse, setVerse] = useState(null);

  useEffect(() => {
    const dayIndex = new Date().getDate() % BIBLE_VERSES.length;
    setVerse(BIBLE_VERSES[dayIndex]);
  }, []);

  const downloadVerse = () => {
    if (!verse) return;
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext('2d');

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
    gradient.addColorStop(0, '#4c1d95');
    gradient.addColorStop(1, '#1a1a2e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1200, 630);

    // Cross decoration
    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    ctx.fillRect(575, 100, 50, 430);
    ctx.fillRect(375, 280, 450, 70);

    // Verse text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px Georgia';
    ctx.textAlign = 'center';

    const text = language === 'ta' ? verse.ta : verse.en;
    const words = text.split(' ');
    let lines = [];
    let currentLine = '';
    words.forEach((word) => {
      const testLine = currentLine + word + ' ';
      if (ctx.measureText(testLine).width > 900) {
        lines.push(currentLine.trim());
        currentLine = word + ' ';
      } else {
        currentLine = testLine;
      }
    });
    lines.push(currentLine.trim());

    const lineHeight = 50;
    const startY = 315 - (lines.length * lineHeight) / 2;
    ctx.font = '32px Georgia';
    lines.forEach((line, i) => {
      ctx.fillText(`"${i === 0 ? line : line}"`, 600, startY + i * lineHeight);
    });

    // Reference
    ctx.font = 'bold 28px Georgia';
    ctx.fillStyle = '#d4af37';
    ctx.fillText(`— ${verse.ref}`, 600, startY + lines.length * lineHeight + 40);

    // Church name
    ctx.font = '22px sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.fillText('Grace Church', 600, 580);

    const link = document.createElement('a');
    link.download = `verse-${verse.ref.replace(/[:\s]/g, '-')}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  if (!verse) return null;

  return (
    <section className="bg-gradient-to-r from-primary-900 to-primary-800 py-16">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <BookOpen size={20} className="text-gold" />
            <span className="text-gold font-semibold tracking-wide uppercase text-sm">
              {language === 'ta' ? 'இன்றைய வசனம்' : 'Verse of the Day'}
            </span>
          </div>
          <blockquote className="text-white text-xl md:text-2xl font-serif leading-relaxed italic mb-4">
            "{language === 'ta' ? verse.ta : verse.en}"
          </blockquote>
          <cite className="text-gold font-semibold text-lg not-italic">— {verse.ref}</cite>
          <div className="mt-6">
            <button
              onClick={downloadVerse}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-gold text-church-dark font-medium text-sm hover:bg-gold-light transition-colors"
            >
              <Download size={16} />
              {language === 'ta' ? 'படமாக பதிவிறக்கு' : 'Download as Image'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
