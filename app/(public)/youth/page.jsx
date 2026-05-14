export default function YouthPage() {
  const programs = [
    { name: 'Youth Sunday', time: 'Sunday 10:30 AM', description: 'A special Saturday service designed for teens featuring relevant messages, worship, and small group discussions.' },
    { name: 'Friday Night Live', time: 'Friday 7:00 PM', description: 'High-energy Friday night gatherings with worship, games, and a short message for youth aged 13–25.' },
    { name: 'Youth Bible Study', time: 'Wednesday 6:30 PM', description: 'In-depth Bible study groups for teenagers and young adults, exploring faith and life\'s big questions.' },
    { name: 'Community Service', time: 'Monthly Saturday', description: 'Monthly outreach projects where our youth serve the community, building character and compassion.' },
  ];

  const leaders = [
    { name: 'Pastor Joshua', role: 'Youth Pastor', img: null },
    { name: 'Priya Thomas', role: 'Youth Coordinator', img: null },
    { name: 'Daniel Kumar', role: 'Worship Leader', img: null },
  ];

  return (
    <section className="py-16 min-h-screen">
      <div className="container-custom">
        {/* Hero */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary-600 to-indigo-700 text-white text-center py-20 px-6 mb-16">
          <h1 className="text-4xl md:text-5xl font-black mb-4">Grace Youth</h1>
          <p className="text-primary-100 text-lg max-w-xl mx-auto mb-6">A place where young people belong, grow, and make a difference. Come as you are — leave transformed.</p>
          <a href="/contact" className="inline-flex px-7 py-3 bg-white text-primary-700 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
            Get Involved
          </a>
        </div>

        {/* Programs */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Youth Programs</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {programs.map((p) => (
              <div key={p.name} className="card p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-900 text-lg">{p.name}</h3>
                  <span className="text-xs text-primary-600 font-medium bg-primary-50 px-2.5 py-1 rounded-lg shrink-0 ml-2">{p.time}</span>
                </div>
                <p className="text-gray-600 text-sm">{p.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Leaders */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Youth Leadership</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
            {leaders.map((l) => (
              <div key={l.name} className="card p-6 text-center">
                <div className="w-20 h-20 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-2xl font-bold mx-auto mb-3">
                  {l.name.charAt(0)}
                </div>
                <h3 className="font-bold text-gray-900">{l.name}</h3>
                <p className="text-gray-500 text-sm">{l.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="card p-8 bg-primary-50 text-center border-primary-100">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Ready to Connect?</h2>
          <p className="text-gray-600 mb-4 max-w-lg mx-auto">Whether you&apos;re new to faith or have grown up in church, Grace Youth has a place for you. Come join us!</p>
          <a href="/contact" className="btn-primary inline-flex">Contact Youth Team</a>
        </div>
      </div>
    </section>
  );
}
