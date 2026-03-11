export function EmailTemplate({ name, email, date, message }) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <div style={{ backgroundColor: '#0D0D0D', color: '#ffffff', padding: '30px', borderRadius: '12px' }}>
        <h1 style={{ color: '#C45D3E', fontSize: '28px', marginBottom: '10px' }}>
          New Contact Form Submission
        </h1>
        <p style={{ color: '#ffffff', opacity: 0.7, marginBottom: '30px' }}>
          You have received a new inquiry from your photography studio website.
        </p>
        
        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)', padding: '20px', borderRadius: '8px', marginBottom: '15px' }}>
          <h3 style={{ color: '#D4A853', marginTop: 0, fontSize: '16px' }}>Contact Information</h3>
          <p style={{ margin: '8px 0' }}><strong>Name:</strong> {name}</p>
          <p style={{ margin: '8px 0' }}><strong>Email:</strong> <a href={`mailto:${email}`} style={{ color: '#C45D3E' }}>{email}</a></p>
          {date && <p style={{ margin: '8px 0' }}><strong>Event Date:</strong> {date}</p>}
        </div>

        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)', padding: '20px', borderRadius: '8px' }}>
          <h3 style={{ color: '#D4A853', marginTop: 0, fontSize: '16px' }}>Message</h3>
          <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', margin: 0 }}>{message}</p>
        </div>

        <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', color: 'rgba(255, 255, 255, 0.5)', fontSize: '12px' }}>
          <p>This email was sent from the NM Studios contact form.</p>
        </div>
      </div>
    </div>
  );
}
