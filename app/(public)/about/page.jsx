'use client';
import { useSelector } from 'react-redux';

export default function AboutPage() {
  const { language } = useSelector((s) => s.ui);

  return (
    <div className="relative">
      {/* Hero Parallax Section */}
      <section 
        className="py-24 parallax-section min-h-[60vh] flex items-center"
        style={{ backgroundImage: "url('/images/parallax_img1.jpg')" }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60" />

        <div className="container-custom relative z-10">
          <div className="bg-white/10 backdrop-blur-md p-8 md:p-16 curve-tl-br border border-white/20 shadow-2xl">
            <h1 className="section-title !text-white !text-left mb-4">
              {language === 'ta' ? 'எங்களைப் பற்றி' : 'About Us'}
            </h1>
            <p className="section-subtitle !text-white/80 !text-left !mx-0 mb-12">
              {language === 'ta' 
                ? 'எங்கள் கதை, நோக்கம் மற்றும் எங்களை உருவாக்கிய மக்கள்.'
                : 'Our story, mission, and the people who make us who we are.'}
            </p>

            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-white">
                  {language === 'ta' ? 'எங்கள் நோக்கம்' : 'Our Mission'}
                </h2>
                <p className="text-white/90 leading-relaxed text-lg">
                  {language === 'ta'
                    ? 'பைபிள் அடிப்படையிலான போதனை, இதயப்பூர்வமான வழிபாடு மற்றும் இரக்கமுள்ள சேவையின் மூலம் மக்களை இயேசு கிறிஸ்துவுடன் அன்பான உறவுக்கு அழைத்துச் செல்வதே எங்கள் நோக்கம். ஒரு செவன்த்-டே அட்வென்டிஸ்ட் திருச்சபையாக, ஓய்வுநாளைப் பரிசுத்தமாக ஆசரிப்பதன் மூலமும், கிறிஸ்துவின் விரைவில் வருகையின் நம்பிக்கையைப் பகிர்ந்துகொள்வதன் மூலமும் நாம் கடவுளைக் கனப்படுத்துகிறோம்.'
                    : 'Our mission is to lead people into a loving relationship with Jesus Christ through Bible-centered teaching, heartfelt worship, and compassionate service. As a Seventh-day Adventist church, we honor God by keeping the Sabbath holy and sharing the hope of Christ’s soon return.'}
                </p>
                <p className="text-white/90 leading-relaxed text-lg">
                  {language === 'ta'
                    ? 'கிருபையில் வளரும், சத்தியத்தில் வாழும் மற்றும் கடவுளின் அன்பை உலகிற்கு பிரதிபலிக்கும் விசுவாசம் நிறைந்த சமூகத்தை உருவாக்க நாங்கள் கடமைப்பட்டுள்ளோம்.'
                    : 'We are committed to building a faith-filled community that grows in grace, lives in truth, and reflects God’s love to the world.'}
                </p>
              </div>

              <div className="bg-white/10 rounded-3xl p-8 border border-white/10">
                <h3 className="font-bold text-white mb-6 text-xl uppercase tracking-widest">
                  {language === 'ta' ? 'எங்கள் முக்கிய மதிப்புகள்' : 'Our Core Values'}
                </h3>
                <ul className="space-y-4">
                  {(language === 'ta' 
                    ? ['வேத அதிகாரம்', 'உண்மையான வழிபாடு', 'அன்பான சமூகம்', 'சேவை தலைமை', 'ராஜ்ய தாக்கம்']
                    : ['Biblical Authority', 'Authentic Worship', 'Loving Community', 'Servant Leadership', 'Kingdom Impact']
                  ).map((v) => (
                    <li key={v} className="flex items-center gap-4 text-white/90 group">
                      <span className="w-2.5 h-2.5 rounded-full bg-primary-400 group-hover:scale-125 transition-transform" />
                      <span className="text-lg font-medium">{v}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Section - Parallax Background */}
      <section 
        className="py-24 parallax-section"
        style={{ backgroundImage: "url('/images/parallax_img2.jpg')" }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60" />

        <div className="container-custom relative z-10">
          <div className="bg-white/10 backdrop-blur-md p-8 md:p-12 curve-tl-br border border-white/20 shadow-2xl">
            <h2 className="text-3xl font-bold mb-12 text-center text-white">
              {language === 'ta' ? 'சபை தலைமை' : 'Church Leadership'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {[
                { name: 'Rev. Samuel Paul', role: 'Senior Pastor', desc: '25 years of ministry' },
                { name: 'Dr. Mary John', role: 'Associate Pastor', desc: 'Youth & Family Ministry' },
                { name: 'Deacon Thomas', role: 'Church Elder', desc: 'Community Outreach' },
              ].map((leader) => (
                <div key={leader.name} className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 text-center border border-white/10 hover:bg-white/20 transition-all hover:-translate-y-2 group">
                  <div className="w-24 h-24 rounded-full bg-white/10 mx-auto mb-6 flex items-center justify-center border border-white/20 group-hover:border-primary-400 transition-colors">
                    <span className="text-4xl text-white group-hover:scale-110 transition-transform">👤</span>
                  </div>
                  <h3 className="font-bold text-white text-xl mb-1">{leader.name}</h3>
                  <p className="text-primary-400 text-sm font-bold uppercase tracking-wider mb-3">{leader.role}</p>
                  <p className="text-white/70 text-base">{leader.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
