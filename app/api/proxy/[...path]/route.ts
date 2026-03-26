import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function proxyRequest(request: NextRequest, { params }: { params: { path: string[] } }) {
  if (!API_URL) {
    console.error("NEXT_PUBLIC_API_URL is not set");
    return new NextResponse("API URL not configured", { status: 500 });
  }

  const url = new URL(request.url);
  const searchParams = url.searchParams.toString();

  // Strip the /api/proxy prefix so /api/proxy/recipe/ingredients -> /recipe/ingredients
  let backendPath = url.pathname.replace(/^\/api\/proxy/, "");
  if (!backendPath.endsWith("/")) {
    backendPath += "/";
  }

  // Django API is served under /api/
  const backendUrl = `${API_URL}/api${backendPath}${searchParams ? `?${searchParams}` : ""}`;

  const token = cookies().get("token")?.value;
  const headers = new Headers(request.headers);

  // We always talk to our own backend, no need for browser-origin CORS here
  headers.delete("host");

  if (token) {
    headers.set("Authorization", `Token ${token}`);
  }

  console.log(`[PROXY] Handling ${request.method} ${backendUrl}`);
  console.log(`[PROXY] Token extracted from cookies:`, token ? "EXISTS" : "MISSING");

  try {
    const response = await fetch(backendUrl, {
      method: request.method,
      headers,
      body: request.method !== "GET" && request.method !== "HEAD" ? await request.arrayBuffer() : undefined,
      redirect: "manual",
    });

    const responseHeaders = new Headers(response.headers);
    responseHeaders.set("Access-Control-Allow-Origin", "*");

    // Node.js fetch automatically decompresses bodies, but preserves the original headers.
    // This mismatch causes Z_DATA_ERROR / Content-Decoding failures in the browser.
    // We must strip them before passing the decompressed stream back to the client.
    responseHeaders.delete("content-encoding");
    responseHeaders.delete("content-length");

    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
