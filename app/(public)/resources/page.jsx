export default function ResourcesPage() {
  const resources = [
    { title: 'Bible Study Guide', description: 'Weekly study materials for small groups and individuals.', type: 'PDF', href: '#' },
    { title: 'Prayer Journal Template', description: 'A structured journal to record prayer requests and answered prayers.', type: 'PDF', href: '#' },
    { title: 'Children\'s Ministry Materials', description: 'Activities and lessons for children aged 4–12.', type: 'Pack', href: '#' },
    { title: 'Worship Chord Charts', description: 'Chord sheets for our worship team and musicians.', type: 'PDF', href: '#' },
    { title: 'Membership Application', description: 'Ready to make this your church home? Download the form.', type: 'Form', href: '#' },
    { title: 'Volunteer Handbook', description: 'Guidelines and information for all church volunteers.', type: 'Guide', href: '#' },
  ];

  return (
    <section className="pt-20 pb-16 min-h-screen bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-8">
          <h1 className="page-title">Resources</h1>
          <p className="page-subtitle">Helpful materials for your spiritual growth and ministry</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource) => (
            <div key={resource.title} className="card p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-gray-900">{resource.title}</h3>
                <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full shrink-0 ml-2">{resource.type}</span>
              </div>
              <p className="text-gray-500 text-sm mb-4">{resource.description}</p>
              <a href={resource.href} className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1">
                Download →
              </a>
            </div>
          ))}
        </div>

        <div className="mt-12 card p-8 bg-primary-50 border-primary-100">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Need Something Else?</h2>
          <p className="text-gray-600 mb-4">If you need a specific resource or material, please contact the church office and we&apos;ll be happy to help.</p>
          <a href="/contact" className="btn-primary inline-flex">Contact Us</a>
        </div>
      </div>
    </section>
  );
}
