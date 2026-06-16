export default function HistoryPage() {
  const milestones = [
    { year: '1985', title: 'Founding', description: 'SDA Church Varadharajapuram was established by Pastor James Alexander and a group of 4 families with a vision to serve the Tamil community in the city.' },
    { year: '1992', title: 'First Building', description: 'After years of meeting in homes and rented halls, the congregation built its first dedicated worship hall with 200 seats.' },
    { year: '1999', title: 'Youth Ministry Launch', description: 'The SDA   Youth Ministry was formed, creating a vibrant space for teenagers and young adults to grow in faith.' },
    { year: '2005', title: 'Community Outreach', description: 'Launched the Grace Care Centre, providing food, education support, and counseling to underprivileged families in the community.' },
    { year: '2012', title: 'New Sanctuary', description: 'The congregation grew and a new 800-seat sanctuary was constructed, along with dedicated children\'s ministry and fellowship halls.' },
    { year: '2018', title: 'Digital Ministry', description: 'Began live streaming Sunday services on YouTube, reaching Tamil-speaking believers across the globe.' },
    { year: '2023', title: 'Church Today', description: 'Today, Grace Community Church serves over 1,200 members across three weekly services, with active outreach, youth, and children\'s ministries.' },
  ];

  return (
    <section className="pt-20 pb-16 min-h-screen">
      <div className="container-custom max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="page-title">Our History</h1>
          <p className="page-subtitle">Nearly four decades of faith, growth, and community service</p>
        </div>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary-200" />
          <div className="space-y-10">
            {milestones.map((m, i) => (
              <div key={m.year} className="relative flex gap-6">
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-sm z-10 shadow-md">
                  {m.year}
                </div>
                <div className="flex-1 card p-5 mt-2">
                  <h3 className="font-bold text-gray-900 text-lg mb-1">{m.title}</h3>
                  <p className="text-gray-600">{m.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Closing */}
        <div className="mt-16 text-center card p-8 bg-gradient-to-br from-primary-600 to-primary-700 text-white">
          <h2 className="text-2xl font-bold mb-3">Built on Faith, Growing in Love</h2>
          <p className="text-primary-100 max-w-xl mx-auto">Our story is still being written — and we invite you to be a part of what God is doing in and through Grace Community Church.</p>
          <a href="/contact" className="inline-flex mt-5 px-6 py-2.5 bg-white text-primary-700 rounded-xl font-semibold text-sm hover:bg-gray-100 transition-colors">Join Our Community</a>
        </div>
      </div>
    </section>
  );
}
