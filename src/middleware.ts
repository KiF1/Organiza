import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { origin } = new URL(request.url);
  const cookie = request.cookies.get("user-logged")?.value;

  if (!cookie) {
    return NextResponse.redirect(origin, {
      headers: {
        "Set-Cookie": `redirectTo=${request.url}; Path=/; HttOnly; max-age=20;`,
      },
    });
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/dashboard/:path*",
};
