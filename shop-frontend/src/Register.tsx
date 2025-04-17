import { useState } from 'react';

function Register() {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async () => {
    const { firstname, lastname, email, password } = formData;

    if (!firstname || !lastname || !email || !password) {
      setMessage('❌ Alla fält måste fyllas i!');
      return;
    }

    try {
      const res = await fetch('https://ecommerce-api-new.vercel.app/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem('token', data.token); // ✅ Spara JWT-token
        setMessage('✅ Konto skapat! Loggar in...');
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      } else {
        setMessage(data.message || '❌ Kunde inte skapa konto.');
      }
    } catch (err) {
      console.error('Register error:', err);
      setMessage('❌ Något gick fel vid registrering.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '2rem' }}>
      <h2>📝 Skapa konto</h2>
      {message && (
        <div
          style={{
            backgroundColor: '#fff3cd',
            color: '#856404',
            padding: '10px',
            marginBottom: '1rem',
            borderRadius: '5px',
          }}
        >
          {message}
        </div>
      )}
      <input
        type="text"
        name="firstname"
        placeholder="Förnamn"
        value={formData.firstname}
        onChange={handleChange}
        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
      />
      <input
        type="text"
        name="lastname"
        placeholder="Efternamn"
        value={formData.lastname}
        onChange={handleChange}
        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
      />
      <input
        type="email"
        name="email"
        placeholder="E-postadress"
        value={formData.email}
        onChange={handleChange}
        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
      />
      <input
        type="password"
        name="password"
        placeholder="Lösenord"
        value={formData.password}
        onChange={handleChange}
        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
      />
      <button
        onClick={handleRegister}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        🧾 Skapa konto
      </button>
    </div>
  );
}

export default Register;

