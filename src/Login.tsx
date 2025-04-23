import { useState } from 'react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async () => {
    try {
      const res = await fetch('https://ecommerce-api-o9lhq0kcc-warmness-travels-projects.vercel.app/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        // ✅ SPARA JWT-token i localStorage
        localStorage.setItem('token', data.token);

        setMessage('✅ Inloggning lyckades!');
        setTimeout(() => {
          window.location.href = '/'; // 🏠 Skicka till startsidan eller dashboard
        }, 1000);
      } else {
        setMessage('❌ Felaktig e-post eller lösenord.');
        console.error(data);
      }
    } catch (err) {
      console.error('Login error:', err);
      setMessage('❌ Något gick fel vid inloggning.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '2rem' }}>
      <h2>🔐 Logga in</h2>

      {message && (
        <div
          style={{
            backgroundColor: message.includes('✅') ? '#d4edda' : '#f8d7da',
            color: message.includes('✅') ? '#155724' : '#721c24',
            padding: '10px',
            marginBottom: '1rem',
            borderRadius: '5px',
          }}
        >
          {message}
        </div>
      )}

      <input
        type="email"
        placeholder="E-post"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
      />
      <input
        type="password"
        placeholder="Lösenord"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
      />
      <button
        onClick={handleLogin}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Logga in
      </button>
    </div>
  );
}

export default Login;
