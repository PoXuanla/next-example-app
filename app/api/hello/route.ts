import { NextApiRequest } from "next";
import { NextResponse } from "next/server";
import { limiter } from "../config/limiter";

export async function GET(req: NextApiRequest) {
  const remaining = await limiter.removeTokens(1);

  if (remaining < 0) {
    return new NextResponse(null, {
      status: 429,
      statusText: "Rate limit exceeded",
    });
  }

  console.log("remaining", remaining);
  return NextResponse.json({ message: "Hello, World1!" });
}
