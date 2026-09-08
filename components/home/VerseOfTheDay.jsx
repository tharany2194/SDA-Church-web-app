'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Download, BookOpen, Video, Loader2 } from 'lucide-react';
import useSWR from 'swr';
import api from '@/lib/api';

const fetcher = (url) => api.get(url).then((r) => r.data.data);

const BIBLE_VERSES = [
  { ref: 'John 3:16', refTa: 'யோவான் 3:16', en: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.', ta: 'தேவன் இந்த உலகத்தை மிகவும் நேசித்தார், அதனால் தம்முடைய ஒரே குமாரனை கொடுத்தார்.' },
  { ref: 'Psalm 23:1', refTa: 'சங்கீதம் 23:1', en: 'The Lord is my shepherd, I lack nothing.', ta: 'கர்த்தர் என் மேய்ப்பர்; எனக்கு குறைவு இராது.' },
  { ref: 'Philippians 4:13', refTa: 'பிலிப்பியர் 4:13', en: 'I can do all this through him who gives me strength.', ta: 'என்னை பலப்படுத்துகிற கிறிஸ்துவினால் எல்லாவற்றையும் செய்யக்கூடும்.' },
  { ref: 'Romans 8:28', refTa: 'ரோமர் 8:28', en: 'And we know that in all things God works for the good of those who love him.', ta: 'தேவனிடத்தில் அன்பு கூர்கிறவர்களுக்கு எல்லாம் நன்மைக்கு ஏதுவாக நடக்கிறது.' },
  { ref: 'Jeremiah 29:11', refTa: 'எரேமியா 29:11', en: 'For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you.', ta: 'உங்களுக்கு நான் நினைக்கும் நினைவுகளை அறிவேன்; அவைகள் தீமையல்ல, நன்மையாயிருக்கும்.' },
];

function drawVerseCanvas(canvas, ctx, bgImg, logoImg, verse, language) {
  // 1. Draw Background
  const canvasAspect = canvas.width / canvas.height;
  const imgAspect = bgImg.width > 0 && bgImg.height > 0 ? bgImg.width / bgImg.height : canvasAspect;
  let drawW, drawH, drawX, drawY;

  if (imgAspect > canvasAspect) {
    drawH = bgImg.height || canvas.height;
    drawW = (bgImg.height || canvas.height) * canvasAspect;
    drawX = ((bgImg.width || canvas.width) - drawW) / 2;
    drawY = 0;
  } else {
    drawW = bgImg.width || canvas.width;
    drawH = (bgImg.width || canvas.width) / canvasAspect;
    drawX = 0;
    drawY = 0;
  }
  if (bgImg.width > 0) {
    ctx.drawImage(bgImg, drawX, drawY, drawW, drawH, 0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // 2. Dark Overlay
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 3. Draw Logo with White Box (Top Right)
  const margin = canvas.width * 0.04;
  const boxWidth = canvas.width * 0.18; 
  const boxHeight = boxWidth / 2.25; 
  const boxX = canvas.width - boxWidth - margin;
  const boxY = margin;
  const cornerRadius = canvas.width * 0.015;

  ctx.save();
  ctx.fillStyle = '#ffffff';
  if (ctx.roundRect) {
     ctx.beginPath();
     ctx.roundRect(boxX, boxY, boxWidth, boxHeight, cornerRadius);
     ctx.fill();
  } else {
     ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
  }
  
  ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
  ctx.shadowBlur = 15;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 10;
  ctx.restore();

  if (logoImg.width > 0) {
    const logoAspect = logoImg.width / logoImg.height;
    const padding = boxWidth * 0.08;
    const availableW = boxWidth - (padding * 2);
    const availableH = boxHeight - (padding * 2);
    
    let finalLogoW = availableW;
    let finalLogoH = availableW / logoAspect;
    if (finalLogoH > availableH) {
       finalLogoH = availableH;
       finalLogoW = finalLogoH * logoAspect;
    }
    
    const logoX = boxX + padding + (availableW - finalLogoW) / 2;
    const logoY = boxY + padding + (availableH - finalLogoH) / 2;
    ctx.drawImage(logoImg, logoX, logoY, finalLogoW, finalLogoH);
  }

  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${canvas.width * 0.02}px sans-serif`;
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.shadowBlur = 4;
  ctx.fillText('Varadharajapuram', boxX + (boxWidth / 2), boxY + boxHeight + (canvas.height * 0.01));
  ctx.shadowBlur = 0;

  // 4. Draw Text
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  ctx.fillStyle = '#f39c12';
  ctx.font = `bold ${canvas.width * 0.025}px sans-serif`;
  ctx.fillText(language === 'ta' ? 'இன்றைய வசனம்' : 'VERSE OF THE DAY', canvas.width / 2, canvas.height * 0.1);

  ctx.fillStyle = '#ffffff';
  const fontSize = language === 'ta' ? canvas.width * 0.038 : canvas.width * 0.045;
  ctx.font = `italic ${fontSize}px Georgia`;
  
  const text = language === 'ta' ? verse.ta : verse.en;
  const maxWidth = canvas.width * 0.8;
  const words = text ? text.split(' ') : [];
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
  let startY = (canvas.height / 2) - ((lines.length - 1) * lineHeight / 2);
  const minStartY = canvas.height * 0.25;
  if (startY < minStartY) startY = minStartY;

  lines.forEach((line, i) => {
    let content = line;
    if (i === 0) content = `"${content}`;
    if (i === lines.length - 1) content = `${content}"`;
    ctx.fillText(content, canvas.width / 2, startY + (i * lineHeight));
  });

  ctx.fillStyle = '#d4af37';
  ctx.font = `bold ${canvas.width * 0.035}px Georgia`;
  const reference = language === 'ta' ? (verse.refTa || verse.ref) : verse.ref;
  ctx.fillText(`— ${reference}`, canvas.width / 2, startY + (lines.length * lineHeight) + (canvas.height * 0.05));

  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.font = `${canvas.width * 0.02}px sans-serif`;
  ctx.fillText('Seventh-day Adventist Church', canvas.width / 2, canvas.height * 0.92);
}

export default function VerseOfTheDay() {
  const { language } = useSelector((s) => s.ui);
  const { data: dynamicVerse } = useSWR('/verses/today', fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
    revalidateOnReconnect: false,
  });
  
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);

  // Derive active verse without intermediate state flashing on refresh
  const fallbackVerse = BIBLE_VERSES[new Date().getDate() % BIBLE_VERSES.length];
  const verse = dynamicVerse
    ? {
        ref: dynamicVerse.reference,
        refTa: dynamicVerse.referenceTa,
        en: dynamicVerse.contentEn,
        ta: dynamicVerse.contentTa,
        backgroundUrl: dynamicVerse.backgroundUrl || null,
        audioUrl: dynamicVerse.audioUrl || null,
      }
    : fallbackVerse;

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
    
    const targetBgUrl = verse.backgroundUrl ? verse.backgroundUrl : (isMobile ? '/images/verses_bg_portrait.png' : '/images/verses_bg_landscape.png');
    bgImg.src = targetBgUrl;
    logoImg.src = '/images/logo.png';

    let imagesLoaded = 0;
    const onImageLoad = () => {
      imagesLoaded++;
      if (imagesLoaded === 2) {
        drawVerseCanvas(canvas, ctx, bgImg, logoImg, verse, language);
        const link = document.createElement('a');
        link.download = `verse-${verse.ref.replace(/[:\s]/g, '-')}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
    };

    bgImg.onload = onImageLoad;
    logoImg.onload = onImageLoad;
    bgImg.onerror = () => {
      bgImg.onerror = null;
      bgImg.onload = onImageLoad;
      bgImg.src = isMobile ? '/images/verses_bg_portrait.png' : '/images/verses_bg_landscape.png';
    };
    logoImg.onerror = onImageLoad;
  };

  const downloadVideo = async () => {
    if (!verse || isGeneratingVideo) return;
    setIsGeneratingVideo(true);

    try {
      const canvas = document.createElement('canvas');
      const isMobile = window.innerWidth < 768;
      canvas.width = isMobile ? 1080 : 1920;
      canvas.height = isMobile ? 1920 : 1080;
      const ctx = canvas.getContext('2d');

      const bgImg = new window.Image();
      const logoImg = new window.Image();
      bgImg.crossOrigin = 'anonymous';
      logoImg.crossOrigin = 'anonymous';

      const targetBgUrl = verse.backgroundUrl ? verse.backgroundUrl : (isMobile ? '/images/verses_bg_portrait.png' : '/images/verses_bg_landscape.png');
      bgImg.src = targetBgUrl;
      logoImg.src = '/images/logo.png';

      await Promise.all([
        new Promise((res) => {
          bgImg.onload = res;
          bgImg.onerror = () => {
            bgImg.onerror = null;
            bgImg.onload = res;
            bgImg.src = isMobile ? '/images/verses_bg_portrait.png' : '/images/verses_bg_landscape.png';
          };
        }),
        new Promise((res) => { logoImg.onload = res; logoImg.onerror = res; })
      ]);

      drawVerseCanvas(canvas, ctx, bgImg, logoImg, verse, language);

      let audioStream = null;
      let audioElement = null;
      let audioCtx = null;

      if (verse.audioUrl) {
        try {
          audioElement = new Audio();
          audioElement.crossOrigin = 'anonymous';
          audioElement.src = verse.audioUrl;
          
          await new Promise((res) => {
            audioElement.oncanplaythrough = res;
            audioElement.onerror = res;
            setTimeout(res, 2500); // safety fallback timeout
          });

          const AudioContextClass = window.AudioContext || window.webkitAudioContext;
          if (AudioContextClass) {
            audioCtx = new AudioContextClass();
            const source = audioCtx.createMediaElementSource(audioElement);
            const dest = audioCtx.createMediaStreamDestination();
            source.connect(dest);
            source.connect(audioCtx.destination);
            audioStream = dest.stream;
          }
        } catch (audioErr) {
          console.warn('Audio setup fallback:', audioErr);
        }
      }

      const canvasStream = canvas.captureStream(30);
      const tracks = [...canvasStream.getVideoTracks()];
      if (audioStream && audioStream.getAudioTracks().length > 0) {
        tracks.push(...audioStream.getAudioTracks());
      }

      const combinedStream = new MediaStream(tracks);

      let mimeType = 'video/webm';
      if (typeof MediaRecorder !== 'undefined') {
        if (MediaRecorder.isTypeSupported('video/mp4;codecs=avc1')) {
          mimeType = 'video/mp4;codecs=avc1';
        } else if (MediaRecorder.isTypeSupported('video/mp4')) {
          mimeType = 'video/mp4';
        } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
          mimeType = 'video/webm;codecs=vp9';
        }
      }

      const recorder = new MediaRecorder(combinedStream, { mimeType });
      const chunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType });
        const isMp4 = mimeType.includes('mp4');
        const ext = isMp4 ? 'mp4' : 'webm';
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `verse-${verse.ref.replace(/[:\s]/g, '-')}.${ext}`;
        link.click();
        setIsGeneratingVideo(false);
        if (audioCtx) {
          try { audioCtx.close(); } catch (e) {}
        }
      };

      recorder.start();
      if (audioElement) {
        audioElement.currentTime = 0;
        audioElement.play().catch(() => {});
      }

      const videoDuration = 10000; // 10 seconds standard video short
      const startTime = Date.now();

      const renderInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        drawVerseCanvas(canvas, ctx, bgImg, logoImg, verse, language);

        if (elapsed >= videoDuration) {
          clearInterval(renderInterval);
          if (audioElement) {
            try { audioElement.pause(); } catch (e) {}
          }
          if (recorder.state !== 'inactive') {
            recorder.stop();
          }
        }
      }, 1000 / 30);

    } catch (err) {
      console.error('Video creation error:', err);
      setIsGeneratingVideo(false);
    }
  };

  if (!verse) return null;

  return (
    <section className="relative w-full pt-16 pb-10 md:pt-24 md:pb-16 bg-transparent overflow-hidden">
      <div className="w-[94%] sm:w-[95%] max-w-7xl mx-auto glow-card-container">
        {/* Animated Glow Border background */}
        <div className="glow-card-border" />
        
        {/* Card Content Body */}
        <div className="glow-card-content relative overflow-hidden flex flex-col items-center justify-center p-5 sm:p-10 md:p-16 lg:p-20 text-center min-h-[450px] md:min-h-[550px] w-full">
          
          {/* Card background image inside the card */}
          <div className="absolute inset-0 z-0">
            <div className="hidden md:block h-full w-full relative">
              <Image
                src={verse.backgroundUrl || "/images/verses_bg_landscape.png"}
                alt="Verse background"
                fill
                className="object-cover object-center"
                priority
                unoptimized={!!verse.backgroundUrl}
              />
            </div>
            <div className="block md:hidden h-full w-full relative">
              <Image
                src={verse.backgroundUrl || "/images/verses_bg_portrait.png"}
                alt="Verse background"
                fill
                className="object-cover object-center"
                priority
                unoptimized={!!verse.backgroundUrl}
              />
            </div>
            {/* Dark glassmorphic overlay inside card */}
            <div className="absolute inset-0 bg-black/55 backdrop-blur-[1px]"></div>
          </div>

          {/* Top Right Logo inside card (Hidden on mobile) */}
          <div className="hidden sm:flex absolute top-6 right-6 sm:top-8 sm:right-8 z-20 flex-col items-center gap-1 sm:gap-1.5 opacity-90 transition-opacity hover:opacity-100">
            <div className="relative w-20 h-9 sm:w-24 sm:h-10 md:w-32 md:h-14 lg:w-36 lg:h-16 rounded-lg sm:rounded-xl bg-white shadow-xl p-1">
              <div className="relative w-full h-full">
                <Image 
                  src="/images/logo.png" 
                  alt="Varatharajapuram SDA Church Logo" 
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            <span className="font-bold text-[10px] sm:text-xs md:text-sm leading-tight text-center tracking-wide text-white drop-shadow-md">
              Varadharajapuram
            </span>
          </div>

          {/* Text block (Relative z-10 for drawing above the inner image) */}
          <div className="relative z-10 w-full max-w-3xl flex flex-col items-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <BookOpen size={20} className="text-gold" />
              <span className="text-gold font-semibold tracking-wide uppercase text-sm sm:text-base">
                {language === 'ta' ? 'இன்றைய வசனம்' : 'Verse of the Day'}
              </span>
            </div>

            {/* Mobile Logo Centered below the verse of the day title */}
            <div className="flex sm:hidden flex-col items-center gap-1 mb-6 opacity-95">
              <div className="relative w-24 h-10 rounded-xl bg-white shadow-lg p-1">
                <div className="relative w-full h-full">
                  <Image 
                    src="/images/logo.png" 
                    alt="Varatharajapuram SDA Church Logo" 
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
              <span className="font-bold text-[11px] leading-tight text-center tracking-wide text-white drop-shadow-md">
                Varadharajapuram
              </span>
            </div>

            <blockquote className={`text-white font-serif leading-relaxed italic mb-5 drop-shadow-lg w-full px-2 sm:px-4 break-words ${language === 'ta' ? 'text-lg sm:text-2xl md:text-3xl' : 'text-xl sm:text-2xl md:text-3xl lg:text-4xl'}`}>
              "{language === 'ta' ? verse.ta?.replace(/^"+|"+$/g, '').trim() : verse.en?.replace(/^"+|"+$/g, '').trim()}"
            </blockquote>
            <cite className={`text-gold font-bold not-italic drop-shadow-md w-full px-2 break-words ${language === 'ta' ? 'text-base sm:text-xl' : 'text-lg sm:text-xl md:text-2xl'}`}>
              — {language === 'ta' ? (verse.refTa || verse.ref) : verse.ref}
            </cite>

            <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <button
                onClick={downloadVerse}
                className="inline-flex items-center gap-2 px-6 py-2.5 sm:px-8 sm:py-3.5 rounded-full bg-gold text-church-dark font-bold text-xs sm:text-sm hover:bg-gold-light transition-all transform hover:scale-105 shadow-xl cursor-pointer"
              >
                <Download size={18} />
                {language === 'ta' ? 'படமாக பதிவிறக்கு' : 'Download as Image'}
              </button>

              <button
                onClick={downloadVideo}
                disabled={isGeneratingVideo}
                className="inline-flex items-center gap-2 px-6 py-2.5 sm:px-8 sm:py-3.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs sm:text-sm hover:from-purple-500 hover:to-indigo-500 transition-all transform hover:scale-105 shadow-xl cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isGeneratingVideo ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    {language === 'ta' ? 'வீடியோ உருவாகிறது...' : 'Generating Video...'}
                  </>
                ) : (
                  <>
                    <Video size={18} />
                    {language === 'ta' ? 'வீடியோவாக பதிவிறக்கு' : 'Download as Video'}
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
