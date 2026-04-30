import * as jose from "jose";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "local-dev-secret-change-in-prod"
);

export async function signSessionToken(claim: { unionId: string; clientId: string }) {
  return new jose.SignJWT(claim)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifySessionToken(token: string) {
  try {
    const { payload } = await jose.jwtVerify(token, secret);
    return payload as { unionId: string; clientId: string };
  } catch {
    return null;
  }
}
