'use client';
import { useSelector } from 'react-redux';

export default function AboutPage() {
  const { language } = useSelector((s) => s.ui);

  return (
    <div className="relative bg-white min-h-screen pt-20 pb-12">
      {/* Hero Parallax Section */}
      <section className="pt-4 pb-12 flex items-center">
        <div className="container-custom">
          <div 
            className="relative overflow-hidden p-8 md:p-16 curve-tl-br shadow-2xl parallax-section"
            style={{ backgroundImage: "url('/images/parallax_img1.jpg')" }}
          >
            {/* Dark overlay inside the inner box */}
            <div className="absolute inset-0 bg-black/60 z-0" />

            <div className="relative z-10">
              <div className="grid md:grid-cols-2 gap-12 items-start">
                {/* Left Column: Headings & Mission text */}
                <div>
                  <h1 className="section-title !text-white !text-left mb-4">
                    {language === 'ta' ? 'எங்களைப் பற்றி' : 'About Us'}
                  </h1>
                  <p className="section-subtitle !text-white/80 !text-left !mx-0 mb-12">
                    {language === 'ta' 
                      ? 'எங்கள் கதை, நோக்கம் மற்றும் எங்களை உருவாக்கிய மக்கள்.'
                      : 'Our story, mission, and the people who make us who we are.'}
                  </p>

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
                </div>

                {/* Right Column: Our Church Card */}
                <div className="bg-white/10 rounded-3xl p-6 md:p-6 pb-2 border border-white/10 backdrop-blur-sm">
                  <h3 className="font-bold text-white mb-4 text-xl uppercase tracking-widest text-center">
                    {language === 'ta' ? 'எங்கள் சபை' : 'Our Church'}
                  </h3>
                  
                  <div className="relative pt-2 max-w-[400px] md:max-w-[450px] mx-auto">
                    {/* Hanging Rod */}
                    <div className="absolute top-2 left-[-16px] right-[-16px] h-2 md:h-2.5 bg-gradient-to-r from-gray-900 via-gray-600 to-gray-900 border border-gray-950 rounded-full shadow-2xl z-0 flex items-center justify-between">
                      {/* Left Finial */}
                      <div className="w-3 h-5 md:w-4 md:h-6 bg-gradient-to-br from-gray-600 to-gray-900 rounded-l-full shadow-md -translate-x-1 border border-gray-800" />
                      {/* Right Finial */}
                      <div className="w-3 h-5 md:w-4 md:h-6 bg-gradient-to-br from-gray-600 to-gray-900 rounded-r-full shadow-md translate-x-1 border border-gray-800" />
                    </div>

                    {/* 3 Banners */}
                    <div className="flex justify-center gap-[6px] md:gap-2 h-[300px] sm:h-[350px] md:h-[400px] relative z-10 px-2 group/banners pb-6">
                      {/* Image 1 */}
                      <div className="flex-1 relative shadow-[0_10px_20px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-500 ease-out hover:-translate-y-2 hover:scale-[1.05] origin-center rounded-t-none rounded-b-md border-t border-black/50 hover:z-50 hover:shadow-[0_20px_40px_rgba(0,0,0,0.7)] cursor-pointer group">
                        <img src="/images/church-img1.jpeg" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Our Church 1" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none opacity-60 group-hover:opacity-10 transition-opacity duration-500" />
                        <div className="absolute inset-0 shadow-[inset_0_6px_8px_rgba(0,0,0,0.6)] pointer-events-none" />
                        <div className="absolute inset-0 border border-white/0 group-hover:border-white/20 rounded-b-md pointer-events-none transition-colors duration-500" />
                      </div>

                      {/* Image 2 */}
                      <div className="flex-1 relative shadow-[0_10px_20px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-500 ease-out hover:-translate-y-2 hover:scale-110 origin-center rounded-t-none rounded-b-md border-t border-black/50 hover:z-50 hover:shadow-[0_20px_40px_rgba(0,0,0,0.8)] cursor-pointer group z-20">
                        <img src="/images/church_img2.jpeg" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Our Church 2" />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70 pointer-events-none opacity-60 group-hover:opacity-10 transition-opacity duration-500" />
                        <div className="absolute inset-0 shadow-[inset_0_6px_8px_rgba(0,0,0,0.6)] pointer-events-none" />
                        <div className="absolute inset-0 border border-white/0 group-hover:border-white/20 rounded-b-md pointer-events-none transition-colors duration-500" />
                      </div>

                      {/* Image 3 */}
                      <div className="flex-1 relative shadow-[0_10px_20px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-500 ease-out hover:-translate-y-2 hover:scale-[1.05] origin-center rounded-t-none rounded-b-md border-t border-black/50 hover:z-50 hover:shadow-[0_20px_40px_rgba(0,0,0,0.7)] cursor-pointer group">
                        <img src="/images/church_img3.jpeg" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Our Church 3" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none opacity-60 group-hover:opacity-10 transition-opacity duration-500" />
                        <div className="absolute inset-0 shadow-[inset_0_6px_8px_rgba(0,0,0,0.6)] pointer-events-none" />
                        <div className="absolute inset-0 border border-white/0 group-hover:border-white/20 rounded-b-md pointer-events-none transition-colors duration-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Section - Parallax Background */}
      <section className="py-12">
        <div className="container-custom">
          <div 
            className="relative overflow-hidden p-8 md:p-12 curve-tl-br shadow-2xl parallax-section"
            style={{ backgroundImage: "url('/images/parallax_img2.jpg')" }}
          >
            {/* Dark overlay inside the inner box */}
            <div className="absolute inset-0 bg-black/60 z-0" />

            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-12 text-center text-white">
                {language === 'ta' ? 'சபை தலைமை' : 'Church Leadership'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {[
                  { name: 'Pastor. James Alexander', role: 'Senior Pastor', desc: '25 years of ministry' },
                  { name: 'Dr. Jebaseeli Sudha', role: 'Associate Pastor', desc: 'Youth & Family Ministry' },
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
        </div>
      </section>
    </div>
  );
}
