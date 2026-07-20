const BASE_URL = (import.meta.env.PUBLIC_BASE_URL ?? "").replace(/\/$/, "")

type ApiEnvelope<T> = {
  data: T
}

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

/**
 * Shared fetch helper for API calls against PUBLIC_BASE_URL.
 * Unwraps the `{ data }` envelope returned by the backend.
 */
export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  if (!BASE_URL) {
    throw new Error("PUBLIC_BASE_URL is not configured")
  }

  const url = `${BASE_URL}/${path.replace(/^\//, "")}`
  const response = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.headers ?? {}),
    },
  })

  if (!response.ok) {
    throw new ApiError(
      response.status,
      `Request failed: ${response.status} ${response.statusText}`,
    )
  }

  const payload = (await response.json()) as ApiEnvelope<T>
  return payload.data
}
