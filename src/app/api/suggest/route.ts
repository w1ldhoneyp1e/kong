import { NextRequest, NextResponse } from "next/server"

const YANDEX_SUGGEST_URL = "https://suggest.yandex.ru/suggest-ya"

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim()
  if (!q) {
    return NextResponse.json({ suggestions: [] })
  }

  try {
    const url = `${YANDEX_SUGGEST_URL}?part=${encodeURIComponent(q)}&uil=ru&v=4&sn=5&lr=84`
    const res = await fetch(url, {
      headers: { "Accept": "application/json, text/plain, */*" },
      next: { revalidate: 0 },
    })
    const text = await res.text()

    let suggestions: string[] = []
    const lines = text.split("\n").filter(Boolean)
    if (lines.length >= 2) {
      try {
        const second = JSON.parse(lines[1]) as unknown
        if (Array.isArray(second) && second.length > 0) {
          if (typeof second[0] === "string") {
            suggestions = (second as string[]).slice(0, 10)
          } else {
            suggestions = second
              .filter((item): item is string[] => Array.isArray(item) && typeof item[0] === "string")
              .map((item) => item[0])
              .slice(0, 10)
          }
        }
      } catch {
        suggestions = []
      }
    }

    return NextResponse.json({ suggestions })
  } catch {
    return NextResponse.json({ suggestions: [] })
  }
}
