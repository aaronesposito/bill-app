


export default async function checkSession() {
  const res = await fetch('http://prometheus:5040/auth/me', {
    method: 'GET',
    credentials: 'include', // <-- CRITICAL
  });

  const data = await res.json();
  // After we fix /auth/me to already use loggedIn/user:
  return {
    loggedIn: data.loggedIn,
    user: data.user,
  };
}