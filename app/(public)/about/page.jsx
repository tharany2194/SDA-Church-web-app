export const metadata = { title: 'About Us', description: 'Learn about Grace Church - our mission, vision, and leadership.' };

export default function AboutPage() {
  return (
    <div className="py-16">
      <div className="container-custom">
        <h1 className="section-title">About Us</h1>
        <p className="section-subtitle">Our story, mission, and the people who make us who we are.</p>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-2xl font-bold mb-4 text-church-dark">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Grace Church exists to glorify God by making disciples of Jesus Christ in our community and around the world.
              We are committed to worship, fellowship, discipleship, ministry, and evangelism.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Founded on the principles of love, grace, and truth, our church has been a beacon of hope for over 50 years,
              serving families across generations.
            </p>
          </div>
          <div className="bg-primary-50 rounded-2xl p-8">
            <h3 className="font-bold text-primary-800 mb-4 text-xl">Our Core Values</h3>
            <ul className="space-y-3">
              {['Biblical Authority', 'Authentic Worship', 'Loving Community', 'Servant Leadership', 'Kingdom Impact'].map((v) => (
                <li key={v} className="flex items-center gap-3 text-gray-700">
                  <span className="w-2 h-2 rounded-full bg-primary-600 shrink-0" />
                  {v}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Leadership */}
        <div>
          <h2 className="text-2xl font-bold mb-8 text-center text-church-dark">Church Leadership</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { name: 'Rev. Samuel Paul', role: 'Senior Pastor', desc: '25 years of ministry' },
              { name: 'Dr. Mary John', role: 'Associate Pastor', desc: 'Youth & Family Ministry' },
              { name: 'Deacon Thomas', role: 'Church Elder', desc: 'Community Outreach' },
            ].map((leader) => (
              <div key={leader.name} className="card p-6 text-center">
                <div className="w-20 h-20 rounded-full bg-primary-100 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-3xl text-primary-600">👤</span>
                </div>
                <h3 className="font-bold text-gray-900">{leader.name}</h3>
                <p className="text-primary-600 text-sm font-medium">{leader.role}</p>
                <p className="text-gray-500 text-sm mt-1">{leader.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
