import Navbar from '@/components/Navbar';
import Background3D from '@/components/Background3D';

export async function generateMetadata({ params }) {
  const tutor = await getTutor(params.id);
  if (!tutor) {
    return {
      title: 'Tutor Not Found | NextGen Tutors',
      description: 'Tutor profile not found.',
    };
  }

  return {
    title: `${tutor.name} | NextGen Tutors`,
    description: tutor.bio || `Book a session with ${tutor.name}.`,
    openGraph: {
      title: `${tutor.name} | NextGen Tutors`,
      description: tutor.bio || `Expert tutoring in ${tutor.subjects?.join(', ')}.`,
      images: [tutor.image || '/nextgentutors-logo.png'],
    },
  };
}

async function getTutor(id) {
  const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || '';
  if (!baseUrl) return null;

  try {
    const res = await fetch(`${baseUrl}/tutors/${id}`, { next: { revalidate: 120 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function TutorProfile({ params }) {
  const tutor = await getTutor(params.id);

  const initials = tutor
    ? `${tutor.firstName?.[0] || ''}${tutor.lastName?.[0] || ''}`.toUpperCase()
    : '?';

  return (
    <main className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Background3D />
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>
      <Navbar />
      <section style={{ flex: 1, padding: '140px 24px 60px' }}>
        <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
          {tutor ? (
            <div className="glass" style={{ padding: '40px' }}>
              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                <div
                  style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    background: 'var(--ngt-accent-soft)',
                    color: 'var(--ngt-accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1.8rem',
                  }}
                  aria-hidden="true"
                >
                  {initials}
                </div>
                <div style={{ flex: '1' }}>
                  <h1 style={{ marginBottom: '10px' }}>{tutor.name}</h1>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '12px' }}>{tutor.bio || ''}</p>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    {(tutor.subjects || []).map((subject) => (
                      <span
                        key={subject}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '999px',
                          background: 'var(--ngt-accent-soft)',
                          color: 'var(--ngt-accent)',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                        }}
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '18px', marginTop: '28px', flexWrap: 'wrap' }}>
                <div>
                  <strong>{tutor.rating ?? 'N/A'}</strong>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Rating</div>
                </div>
                <div>
                  <strong>{tutor.reviews ?? 0}</strong>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Reviews</div>
                </div>
                <div>
                  <strong>{tutor.sessions ?? 0}</strong>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sessions</div>
                </div>
                <div>
                  <strong>R{tutor.rate ?? '—'}</strong>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/ hour</div>
                </div>
              </div>
              <a href={`/booking/${params.id}`} className="btn btn-primary" style={{ marginTop: '28px', display: 'inline-block' }}>
                Book Session Now
              </a>
            </div>
          ) : (
            <div className="glass" style={{ padding: '40px', textAlign: 'center' }}>
              <h2>Tutor {params.id} Profile</h2>
              <p style={{ color: 'var(--text-muted)' }}>
                No WordPress backend configured yet. Activate <strong>NextGen Tutors API</strong> and set
                <code style={{ color: 'var(--ngt-accent)' }}>NEXT_PUBLIC_WORDPRESS_API_URL</code>.
              </p>
              <a href="/tutors" className="btn btn-primary" style={{ marginTop: '24px', display: 'inline-block' }}>
                Back to Tutors
              </a>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
