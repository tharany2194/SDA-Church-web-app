'use client';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';

const t = {
  en: {
    title: 'Contact Us',
    subtitle: "We would love to hear from you. Reach out and we'll respond as soon as possible.",
    getInTouch: 'Get in Touch',
    addressLabel: 'Address',
    addressVal: '332J+4FP, Varadharajapuram, Poonamallee, Tamil Nadu 600123, India.',
    phoneLabel: 'Phone',
    emailLabel: 'Email',
    serviceTimes: 'Service Times',
    saturdayService: 'Saturday Service',
    saturdayServiceTime: '7:30 AM',
    fridayPrayer: 'Friday Prayer',
    fridayPrayerTime: '7:00 PM',
    youthMeeting: 'Saturday Evening Youth Meeting',
    youthMeetingTime: '6:00 PM',
    sendMessage: 'Send a Message',
    nameLabel: 'Name',
    namePlaceholder: 'Your name',
    emailLabel: 'Email',
    emailPlaceholder: 'your@email.com',
    subjectLabel: 'Subject',
    subjectPlaceholder: 'Subject',
    messageLabel: 'Message',
    messagePlaceholder: 'Your message...',
    sending: 'Sending...',
    sendMessageBtn: 'Send Message',
    successMsg: 'Message sent! We will get back to you soon.',
    validationError: 'All fields are compulsory and must be entered.',
    emailFormatError: 'Please enter a valid email address (e.g., name@gmail.com).',
  },
  ta: {
    title: 'தொடர்பு கொள்ள',
    subtitle: 'நாங்கள் உங்களிடமிருந்து கேட்க விரும்புகிறோம். எங்களைத் தொடர்பு கொள்ளுங்கள், நாங்கள் விரைவில் பதிலளிப்போம்.',
    getInTouch: 'தொடர்பு கொள்ள',
    addressLabel: 'முகவரி',
    addressVal: '332J+4FP, வரதராஜபுரம், பூந்தமல்லி, தமிழ்நாடு 600123, இந்தியா.',
    phoneLabel: 'தொலைபேசி',
    emailLabel: 'மின்னஞ்சல்',
    serviceTimes: 'ஆராதனை நேரங்கள்',
    saturdayService: 'சனிக்கிழமை ஆராதனை',
    saturdayServiceTime: 'காலை 7:30',
    fridayPrayer: 'வெள்ளிக்கிழமை ஜெபம்',
    fridayPrayerTime: 'மாலை 7:00',
    youthMeeting: 'சனிக்கிழமை மாலை இளைஞர் கூட்டம்',
    youthMeetingTime: 'மாலை 6:00',
    sendMessage: 'செய்தி அனுப்பவும்',
    nameLabel: 'பெயர்',
    namePlaceholder: 'உங்கள் பெயர்',
    emailLabel: 'மின்னஞ்சல்',
    emailPlaceholder: 'உங்கள் மின்னஞ்சல் முகவரி',
    subjectLabel: 'பொருள்',
    subjectPlaceholder: 'பொருள்',
    messageLabel: 'செய்தி',
    messagePlaceholder: 'உங்கள் செய்தி...',
    sending: 'அனுப்பப்படுகிறது...',
    sendMessageBtn: 'செய்தி அனுப்புக',
    successMsg: 'செய்தி அனுப்பப்பட்டது! நாங்கள் விரைவில் உங்களைத் தொடர்புகொள்வோம்.',
    validationError: 'அனைத்து புலங்களும் கட்டாயமாகும், அவை பூர்த்தி செய்யப்பட வேண்டும்.',
    emailFormatError: 'தயவுசெய்து சரியான மின்னஞ்சல் முகவரியை உள்ளிடவும் (எ.கா., name@gmail.com).',
  }
};

export default function ContactPage() {
  const { language = 'en' } = useSelector((s) => s.ui) || {};
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nameVal = form.name.trim();
    const emailVal = form.email.trim();
    const subjectVal = form.subject.trim();
    const messageVal = form.message.trim();

    if (!nameVal || !emailVal || !subjectVal || !messageVal) {
      toast.error(t[language].validationError);
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(emailVal)) {
      toast.error(t[language].emailFormatError);
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.post('/contact', {
        name: nameVal,
        email: emailVal,
        subject: subjectVal,
        message: messageVal,
      });

      if (response.data?.success) {
        toast.success(t[language].successMsg);
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        toast.error(response.data?.message || 'Failed to send message.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-20 pb-16">
      <div className="container-custom">
        <h1 className="page-title">{t[language].title}</h1>
        <p className="page-subtitle">{t[language].subtitle}</p>

        <div className="flex flex-col gap-12 w-full mx-auto">
          {/* Contact Info */}
          <div className="card p-6">
            <h2 className="text-xl font-bold mb-6 text-gray-900">{t[language].getInTouch}</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <ul className="space-y-5">
                <li className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                    <MapPin size={18} className="text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{t[language].addressLabel}</p>
                    <p className="text-gray-600 text-sm">{t[language].addressVal}</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                    <Phone size={18} className="text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{t[language].phoneLabel}</p>
                    <a href="tel:+919962589089" className="text-primary-600 text-sm hover:underline">+91 99625 89089</a>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                    <Mail size={18} className="text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{t[language].emailLabel}</p>
                    <a href="mailto:varadharajapuramsdachurch@gmail.com" className="text-primary-600 text-sm hover:underline break-all">varadharajapuramsdachurch@gmail.com</a>
                  </div>
                </li>
              </ul>

              {/* Service Times */}
              <div className="p-5 bg-primary-50 rounded-2xl h-fit">
                <h3 className="font-bold text-primary-900 mb-3">{t[language].serviceTimes}</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex flex-wrap lg:justify-between gap-1">
                    <span>{t[language].saturdayService}</span>
                    <span className="font-medium text-primary-800">{t[language].saturdayServiceTime}</span>
                  </li>
                  <li className="flex flex-wrap lg:justify-between gap-1">
                    <span>{t[language].fridayPrayer}</span>
                    <span className="font-medium text-primary-800">{t[language].fridayPrayerTime}</span>
                  </li>
                  <li className="flex flex-wrap lg:justify-between gap-1">
                    <span>{t[language].youthMeeting}</span>
                    <span className="font-medium text-primary-800">{t[language].youthMeetingTime}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="card p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-900">{t[language].sendMessage}</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t[language].nameLabel}</label>
                <input
                  className="input"
                  placeholder={t[language].namePlaceholder}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t[language].emailLabel}</label>
                <input
                  type="email"
                  className="input"
                  placeholder={t[language].emailPlaceholder}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t[language].subjectLabel}</label>
              <input
                className="input"
                placeholder={t[language].subjectPlaceholder}
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t[language].messageLabel}</label>
              <textarea
                className="input resize-none"
                rows={5}
                placeholder={t[language].messagePlaceholder}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn-primary w-full gap-2" disabled={submitting}>
              <Send size={16} />
              {submitting ? t[language].sending : t[language].sendMessageBtn}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
