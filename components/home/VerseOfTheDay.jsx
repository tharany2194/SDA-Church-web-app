'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Download, BookOpen, RefreshCw, Loader2 } from 'lucide-react';
import useSWR from 'swr';
import api from '@/lib/api';

const fetcher = (url) => api.get(url).then((r) => r.data.data);

const BIBLE_VERSES = [
  { ref: 'John 3:16', en: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.', ta: 'தேவன் இந்த உலகத்தை மிகவும் நேசித்தார், அதனால் தம்முடைய ஒரே குமாரனை கொடுத்தார்.' },
  { ref: 'Psalm 23:1', en: 'The Lord is my shepherd, I lack nothing.', ta: 'கர்த்தர் என் மேய்ப்பர்; எனக்கு குறைவு இராது.' },
  { ref: 'Philippians 4:13', en: 'I can do all this through him who gives me strength.', ta: 'என்னை பலப்படுத்துகிற கிறிஸ்துவினால் எல்லாவற்றையும் செய்யக்கூடும்.' },
  { ref: 'Romans 8:28', en: 'And we know that in all things God works for the good of those who love him.', ta: 'தேவனிடத்தில் அன்பு கூர்கிறவர்களுக்கு எல்லாம் நன்மைக்கு ஏதுவாக நடக்கிறது.' },
  { ref: 'Jeremiah 29:11', en: 'For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you.', ta: 'உங்களுக்கு நான் நினைக்கும் நினைவுகளை அறிவேன்; அவைகள் தீமையல்ல, நன்மையாயிருக்கும்.' },
];

export default function VerseOfTheDay() {
  const { language } = useSelector((s) => s.ui);
  const { data: dynamicVerse, error, isLoading } = useSWR('/verses/today', fetcher);
  const [verse, setVerse] = useState(null);

  useEffect(() => {
    if (dynamicVerse) {
      setVerse({
        ref: dynamicVerse.reference,
        en: dynamicVerse.contentEn,
        ta: dynamicVerse.contentTa,
      });
    } else if (!isLoading) {
      // Fallback to static verses if none active
      const dayIndex = new Date().getDate() % BIBLE_VERSES.length;
      setVerse(BIBLE_VERSES[dayIndex]);
    }
  }, [dynamicVerse, isLoading]);

  const downloadVerse = () => {
    if (!verse) return;
    const canvas = document.createElement('canvas');
    const isMobile = window.innerWidth < 768;
    
    canvas.width = isMobile ? 1080 : 1920;
    canvas.height = isMobile ? 1920 : 1080;
    
    const ctx = canvas.getContext('2d');
    const bgImg = new window.Image();
    const logoImg = new window.Image();
    
    bgImg.crossOrigin = 'anonymous';
    logoImg.crossOrigin = 'anonymous';
    
    bgImg.src = isMobile ? '/images/verses_bg_portrait.png' : '/images/verses_bg_landscape.png';
    logoImg.src = '/images/varadharajapuram_logo.png';

    let imagesLoaded = 0;
    const onImageLoad = () => {
      imagesLoaded++;
      if (imagesLoaded === 2) drawCanvas();
    };

    bgImg.onload = onImageLoad;
    logoImg.onload = onImageLoad;
    bgImg.onerror = onImageLoad; // Continue even if one fails
    logoImg.onerror = onImageLoad;

    function drawCanvas() {
      // 1. Draw Background
      const canvasAspect = canvas.width / canvas.height;
      const imgAspect = bgImg.width / bgImg.height;
      let drawW, drawH, drawX, drawY;

      if (imgAspect > canvasAspect) {
        drawH = bgImg.height;
        drawW = bgImg.height * canvasAspect;
        drawX = (bgImg.width - drawW) / 2;
        drawY = 0;
      } else {
        drawW = bgImg.width;
        drawH = bgImg.width / canvasAspect;
        drawX = 0;
        drawY = 0;
      }
      ctx.drawImage(bgImg, drawX, drawY, drawW, drawH, 0, 0, canvas.width, canvas.height);

      // 2. Dark Overlay
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 3. Draw Logo (Top Right) - Maintain Aspect Ratio
      const logoAspect = logoImg.width / logoImg.height;
      const logoWidth = canvas.width * 0.15;
      const logoHeight = logoWidth / logoAspect;
      const margin = canvas.width * 0.04;
      ctx.drawImage(logoImg, canvas.width - logoWidth - margin, margin, logoWidth, logoHeight);

      // 4. Draw Text
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Label (Moved to top)
      ctx.fillStyle = '#f39c12'; // Dark Orange / Deep Gold
      ctx.font = `bold ${canvas.width * 0.025}px sans-serif`;
      ctx.fillText(language === 'ta' ? 'இன்றைய வசனம்' : 'VERSE OF THE DAY', canvas.width / 2, canvas.height * 0.1);

      // Verse text
      ctx.fillStyle = '#ffffff';
      const fontSize = language === 'ta' ? canvas.width * 0.038 : canvas.width * 0.045;
      ctx.font = `italic ${fontSize}px Georgia`;
      
      const text = language === 'ta' ? verse.ta : verse.en;
      const maxWidth = canvas.width * 0.8;
      const words = text.split(' ');
      const lines = [];
      let currentLine = '';
      words.forEach(word => {
        if (ctx.measureText(currentLine + word).width > maxWidth) {
          lines.push(currentLine.trim());
          currentLine = word + ' ';
        } else {
          currentLine += word + ' ';
        }
      });
      lines.push(currentLine.trim());

      const lineHeight = fontSize * 1.4;
      // Ensure startY doesn't overlap the title (top Label is at 0.1, so startY should be at least 0.25)
      let startY = (canvas.height / 2) - ((lines.length - 1) * lineHeight / 2);
      const minStartY = canvas.height * 0.25;
      if (startY < minStartY) startY = minStartY;

      lines.forEach((line, i) => {
        let content = line;
        if (i === 0) content = `"${content}`;
        if (i === lines.length - 1) content = `${content}"`;
        ctx.fillText(content, canvas.width / 2, startY + (i * lineHeight));
      });

      // Reference
      ctx.fillStyle = '#d4af37';
      ctx.font = `bold ${canvas.width * 0.035}px Georgia`;
      ctx.fillText(`— ${verse.ref}`, canvas.width / 2, startY + (lines.length * lineHeight) + (canvas.height * 0.05));

      // Brand
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.font = `${canvas.width * 0.02}px sans-serif`;
      ctx.fillText('Seventh-day Adventist Church', canvas.width / 2, canvas.height * 0.92);

      // Download
      const link = document.createElement('a');
      link.download = `verse-${verse.ref.replace(/[:\s]/g, '-')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  if (isLoading) {
    return (
      <div className="bg-primary-900 py-16 flex justify-center items-center">
        <Loader2 className="text-gold animate-spin" size={32} />
      </div>
    );
  }

  if (!verse) return null;

  return (
    <section className="relative min-h-[500px] md:min-h-[600px] flex items-center py-24 md:py-32 overflow-hidden">
      {/* Background Images */}
      <div className="absolute inset-0 z-0">
        <div className="hidden md:block h-full w-full relative">
          <Image
            src="/images/verses_bg_landscape.png"
            alt="Verse background"
            fill
            className="object-cover object-top"
            priority
          />
        </div>
        <div className="block md:hidden h-full w-full relative">
          <Image
            src="/images/verses_bg_portrait.png"
            alt="Verse background"
            fill
            className="object-cover object-top"
            priority
          />
        </div>
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>
      </div>

      {/* Top Right Logo */}
      <div className="absolute top-8 right-8 z-20 w-36 md:w-48 drop-shadow-xl">
        <Image 
          src="/images/varadharajapuram_logo.png" 
          alt="Church Logo" 
          width={225} 
          height={225} 
          className="object-contain"
        />
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <BookOpen size={20} className="text-gold" />
            <span className="text-gold font-semibold tracking-wide uppercase text-sm">
              {language === 'ta' ? 'இன்றைய வசனம்' : 'Verse of the Day'}
            </span>
          </div>
          <blockquote className="text-white text-2xl md:text-3xl font-serif leading-relaxed italic mb-4 drop-shadow-lg">
            "{language === 'ta' ? verse.ta : verse.en}"
          </blockquote>
          <cite className="text-gold font-bold text-xl not-italic drop-shadow-md">— {verse.ref}</cite>
          <div className="mt-8">
            <button
              onClick={downloadVerse}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gold text-church-dark font-bold text-sm hover:bg-gold-light transition-all transform hover:scale-105 shadow-xl"
            >
              <Download size={18} />
              {language === 'ta' ? 'படமாக பதிவிறக்கு' : 'Download as Image'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
