"use client";
import { useEffect, useState } from 'react';
import { PlaidLink } from 'react-plaid-link';

export default function PlaidHome() {
  const [linkToken, setLinkToken] = useState(null);

  useEffect(() => {
    // Fetch the link_token from your API route
    const fetchLinkToken = async () => {
      const response = await fetch('/api/plaid');
      const data = await response.json();
      setLinkToken(data.link_token);
    };

    fetchLinkToken();
  }, []);

  const handleOnSuccess = async (public_token: string) => {
    // Send the public token to your API to exchange for an access token
    const response = await fetch('/api/plaid', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ public_token }),
    });

    const data = await response.json();
    console.log('Access Token:', data.access_token);  // Use access token as needed
  };

  if (!linkToken) return <p>Loading...</p>;

  return (
    <div>
      <h1>Connect Bank Account</h1>
      <PlaidLink
        token={linkToken}
        onSuccess={handleOnSuccess}
        onExit={(error, metadata) => {
          if (error) {
            console.error('Error:', error);
          }
          console.log('Exit:');
        }}
      >
        Connect your bank
      </PlaidLink>
    </div>
  );
}