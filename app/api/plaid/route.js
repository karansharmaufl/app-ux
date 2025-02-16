// pages/api/plaid.js
const { PlaidApi, Configuration, PlaidEnvironments, Products, CountryCode } = require('plaid');
import { NextResponse } from 'next/server';
 
const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox, // Or 'production' or 'sandbox'
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
    }
  }
});

const plaidClient = new PlaidApi(configuration);

export const GET = async () => {
  try {
    // Create a link token for the Plaid Link flow
    const response = await plaidClient.linkTokenCreate({
      user: { client_user_id: 'unique_user_id' }, // This can be any unique user identifier
      client_name: 'Plaid Next.js App',
      products: [Products.Auth, Products.Transactions], // Specify what information you need
      country_codes: [CountryCode.Us],
      language: 'en',
    });
    return NextResponse.json({ link_token: response.data.link_token }, {status: 200});
  } catch (error) {
    console.log("Error:", error)
    return NextResponse.json({ error: error.message }, {status: 500});
  }
}

export const POST = async (request) => {
  try {
    const body = await request.json()
    const { public_token } = body;
    // Exchange the public token for an access token
    const response = await plaidClient.itemPublicTokenExchange({ public_token });
    const { access_token, item_id } = response.data;

    // Send the access token to the frontend or save it in your DB for later use
    return NextResponse.json({ access_token, item_id }, {status: 200});
  } catch (error) {
    console.log("Error:", error)
    return NextResponse.json({ error: error.message }, {status: 500});
  }
}

export const OPTIONS = async (req) => {
  return NextResponse.json({status: 200});
}
