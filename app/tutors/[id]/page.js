import Navbar from '@/components/Navbar';
import Background3D from '@/components/Background3D';

// Dynamic SEO Metadata Generation
export async function generateMetadata({ params }) {
  // In a real scenario, fetch tutor data from WordPress API
  // const tutor = await fetch(`.../wp-json/ngt/v1/tutors/${params.id}`).then(r => r.json());
  const tutorId = params.id;
  
  return {
    title: `Tutor Profile ${tutorId} | NextGen Tutors`,
    description: `Book a tutoring session with our highly rated expert. Find your perfect tutor in South Africa.`,
    openGraph: {
      title: `Tutor Profile ${tutorId} | NextGen Tutors`,
      description: 'Expert online tutoring for South African students.',
      images: ['/nextgentutors-logo.png'],
    },
  };
}

export default function TutorProfile({ params }) {
  return (
    <main className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Background3D />
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
      </div>
      <Navbar />
      <section style={{ flex: 1, padding: '140px 24px 60px' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="glass" style={{ padding: '40px', textAlign: 'center' }}>
            <h2>Tutor {params.id} Profile</h2>
            <p style={{ color: 'var(--text-muted)' }}>Dynamic SEO has been configured for this Headless Tutor Page.</p>
            <a href={`/booking/${params.id}`} className="btn btn-primary" style={{ marginTop: '24px', display: 'inline-block' }}>Book Session Now</a>
          </div>
        </div>
      </section>
    </main>
  );
}
