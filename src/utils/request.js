const URL = "http://localhost:3001/"

export default async function request(endpoint, options) {
  const res = await fetch(URL + endpoint, options)
  if (!res.ok) return res.status

  let data = await res.json()

  if (Array.isArray(data)) data = data[0]

  return data
}

export const get = async (endpoint, params) => {
  if (params) {
    const paramsString = Object.keys(params)
      .map(key => `${key}=${params[key]}`)
      .join("&")
    endpoint += `?${paramsString}`
  }
  return await request(endpoint, { method: "GET" })
}

export const post = async (endpoint, body) => {
  return await request(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
}
