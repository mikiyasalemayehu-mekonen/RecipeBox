import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL ;

export async function POST(request: Request) {
  try {
    // Convert FormData or JSON to URLSearchParams
    // Convert FormData or JSON to URLSearchParams
    let formParams: URLSearchParams;
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const json = await request.json();
      formParams = new URLSearchParams(json);
    } else {
      const formData = await request.formData();
      formParams = new URLSearchParams(formData as any);
    }

    const response = await fetch(`${API_URL}/api/user/token/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formParams,
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: response.status });
    }

    const data = await response.json();

    cookies().set("token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
