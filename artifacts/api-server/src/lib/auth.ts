import crypto from "node:crypto";

const JWT_SECRET = process.env.SESSION_SECRET ?? "floracare-secret-key";

export function hashPassword(password: string): string {
  return crypto
    .createHmac("sha256", JWT_SECRET)
    .update(password)
    .digest("hex");
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

export function generateToken(userId: string, username: string): string {
  const payload = { userId, username, iat: Date.now() };
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(data)
    .digest("base64url");
  return `${data}.${sig}`;
}

export function verifyToken(token: string): { userId: string; username: string } | null {
  try {
    const [data, sig] = token.split(".");
    if (!data || !sig) return null;
    const expectedSig = crypto
      .createHmac("sha256", JWT_SECRET)
      .update(data)
      .digest("base64url");
    if (sig !== expectedSig) return null;
    const payload = JSON.parse(Buffer.from(data, "base64url").toString("utf8"));
    return { userId: payload.userId, username: payload.username };
  } catch {
    return null;
  }
}
