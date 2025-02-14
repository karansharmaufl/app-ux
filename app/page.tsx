import { getTokens } from "next-firebase-auth-edge";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { clientConfig, serverConfig } from "../firebaseConfig";
import HomePage from "./home/page";

export default async function Home() {
  const tokens = await getTokens(await cookies(), {
    apiKey: clientConfig.apiKey,
    cookieName: serverConfig.cookieName,
    cookieSignatureKeys: serverConfig.cookieSignatureKeys,
    serviceAccount: serverConfig.serviceAccount,
  });

  if (!tokens) {
    notFound();
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 absolute inset-0 bg-gradient-to-r from-blue-500 via-white-500 to-red-500">
        <HomePage email={tokens?.decodedToken.email} phoneNumber={tokens?.decodedToken.phone_number}/>;
    </main>
  );
}