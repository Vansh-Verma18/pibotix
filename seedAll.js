const mongoose = require('mongoose');
const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
const mongoUriLine = envFile.split('\n').find(line => line.startsWith('MONGODB_URI='));
process.env.MONGODB_URI = mongoUriLine ? mongoUriLine.replace('MONGODB_URI=', '').trim().replace(/^"|'/, '').replace(/"|'$/, '') : '';

async function seedAll() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection;
    
    // Helper arrays for dummy generation
    const users = ['john.doe@example.com', 'jane.smith@example.com', 'marketing@example.com'];
    const statuses = ['Pending', 'In Progress', 'Completed', 'Rejected'];
    
    // --- 1. Seed Leads ---
    // (Already seeded in previous run)

    // --- 2. Seed Contact Requests ---
    // (Already seeded in previous run)

    // --- 3. Seed Consultations ---
    // (Already seeded in previous run)

    // --- 4. Seed Services ---
    const services = [
      { title: 'Custom Web Development', slug: 'custom-web-development', description: 'Enterprise grade web applications built with Next.js and Node.', icon: 'Code', isActive: true, createdAt: new Date() },
      { title: 'Cloud Infrastructure', slug: 'cloud-infrastructure', description: 'AWS and Azure cloud migration and management.', icon: 'Cloud', isActive: true, createdAt: new Date() },
      { title: 'Cybersecurity Audit', slug: 'cybersecurity-audit', description: 'Comprehensive penetration testing and security review.', icon: 'Shield', isActive: true, createdAt: new Date() },
      { title: 'SEO Optimization', slug: 'seo-optimization', description: 'Improve your search rankings and organic traffic.', icon: 'TrendingUp', isActive: false, createdAt: new Date() }
    ];
    await db.collection('services').insertMany(services);
    console.log(`Seeded ${services.length} Services`);

    // --- 5. Seed Testimonials ---
    const testimonials = [
      { clientName: 'Tony Stark', company: 'Stark Industries', role: 'CEO', content: 'They completely revolutionized our internal AI systems. Brilliant work.', rating: 5, isPublished: true, createdAt: new Date() },
      { clientName: 'Steve Rogers', company: 'Shield', role: 'Director', content: 'Reliable, secure, and always on time. Highly recommended for defense contracts.', rating: 5, isPublished: true, createdAt: new Date() },
      { clientName: 'Natasha Romanoff', company: 'Independent Consultant', role: 'Security Expert', content: 'Their penetration testing caught vulnerabilities we never knew existed.', rating: 4, isPublished: true, createdAt: new Date() }
    ];
    await db.collection('testimonials').insertMany(testimonials);
    console.log(`Seeded ${testimonials.length} Testimonials`);

    // --- 6. Seed Case Studies ---
    const caseStudies = [
      { title: 'Stark Industries AI Overhaul', slug: 'stark-ai', client: 'Stark Industries', industry: 'Defense / Tech', summary: 'Upgraded legacy systems to modern AI infrastructure.', challenges: 'Extremely tight security requirements.', solutions: 'Custom trained LLMs deployed on-premise.', results: '400% increase in processing speed.', isPublished: true, createdAt: new Date() },
      { title: 'Daily Planet Digital Migration', slug: 'daily-planet-migration', client: 'Daily Planet', industry: 'Media', summary: 'Migrated 50 years of archives to the cloud.', challenges: 'Massive data volume.', solutions: 'AWS S3 Glacier combined with active querying.', results: 'Zero data loss, 50% reduced hosting costs.', isPublished: true, createdAt: new Date() }
    ];
    await db.collection('casestudies').insertMany(caseStudies);
    console.log(`Seeded ${caseStudies.length} Case Studies`);

    // --- 7. Seed Team Members ---
    const teamMembers = [
      { name: 'Vansh Soni', role: 'Lead Architect', bio: 'Full-stack developer with 10 years of experience.', email: 'vansh@example.com', linkedIn: 'linkedin.com/in/vansh', isActive: true, createdAt: new Date() },
      { name: 'Alex Rivera', role: 'UI/UX Designer', bio: 'Creates stunning, accessible user interfaces.', email: 'alex@example.com', linkedIn: 'linkedin.com/in/alexr', isActive: true, createdAt: new Date() },
      { name: 'Sam Chen', role: 'DevOps Engineer', bio: 'Keeps the servers running and deployments smooth.', email: 'sam@example.com', linkedIn: 'linkedin.com/in/samc', isActive: true, createdAt: new Date() }
    ];
    await db.collection('teammembers').insertMany(teamMembers);
    console.log(`Seeded ${teamMembers.length} Team Members`);

    // --- 8. Seed Blog Posts ---
    const blogPosts = [
      { title: 'The Future of Next.js 15', slug: 'future-of-nextjs-15', excerpt: 'What to expect in the newest major release of React\'s favorite framework.', content: 'Full content goes here...', author: 'Vansh Soni', category: 'Technology', tags: ['React', 'Next.js', 'Frontend'], isPublished: true, views: 1450, createdAt: new Date() },
      { title: 'Why MongoDB is Perfect for Startups', slug: 'mongodb-for-startups', excerpt: 'How NoSQL databases provide the flexibility startups need.', content: 'Full content goes here...', author: 'Sam Chen', category: 'Database', tags: ['MongoDB', 'Backend', 'Startups'], isPublished: true, views: 890, createdAt: new Date() },
      { title: 'Designing for Accessibility in 2026', slug: 'accessibility-2026', excerpt: 'Top trends in UI design that ensure everyone can use your apps.', content: 'Full content goes here...', author: 'Alex Rivera', category: 'Design', tags: ['UI/UX', 'A11y', 'Design'], isPublished: false, views: 0, createdAt: new Date() }
    ];
    await db.collection('blogposts').insertMany(blogPosts);
    console.log(`Seeded ${blogPosts.length} Blog Posts`);

    console.log('\n✅ All modules seeded successfully! You can now browse the admin panel.');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

seedAll();
