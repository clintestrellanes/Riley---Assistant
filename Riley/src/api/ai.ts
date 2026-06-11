export default async function AIResponse(user_query: string) {
  const ai = await fetch("http://localhost:8000/think", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user_query })
  })
  const response = await ai.json()
  console.log(response)
}