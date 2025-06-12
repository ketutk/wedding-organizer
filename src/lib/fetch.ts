export async function FetchData(url: string, method: string, body?: any, query?: Record<string, any>) {
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  const options: RequestInit = {
    method,
    headers: {
      Accept: "application/json",
      // Only set Content-Type manually for JSON. For FormData, let the browser handle it.
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
    },
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
  };

  // Append query parameters if provided
  if (query) {
    const queryString = new URLSearchParams(
      Object.entries(query).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null) {
          acc[key] = String(value);
        }
        return acc;
      }, {} as Record<string, string>)
    ).toString();

    url += `?${queryString}`;
  }

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error || "Fetch failed");
    }

    return data;
  } catch (error) {
    console.log("Fetch error:", error);
    throw error;
  }
}
