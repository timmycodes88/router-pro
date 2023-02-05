const URL = "http://localhost:3001/"

/**
 *
 * @param {string} endpoint
 * @param {Object} options
 * @returns {Promise<any>}
 */
export default async function request(endpoint, options) {
  const res = await fetch(URL + endpoint, options)
  if (!res.ok) return res.status

  let data = await res.json()

  if (Array.isArray(data)) data = data[0]

  return data
}

/**
 *
 * @param {string} endpoint
 * @param {Object} params
 * @returns {Promise<any>}
 */
export const get = async (endpoint, params) => {
  if (params) {
    const paramsString = Object.keys(params)
      .map(key => `${key}=${params[key]}`)
      .join("&")
    endpoint += `?${paramsString}`
  }
  return await request(endpoint, { method: "GET" })
}

/**
 *
 * @param {string} endpoint
 * @param {Object} body
 * @returns {Promise<any>}
 */
export const post = async (endpoint, body) => {
  return await request(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
}

/**
 *
 * @param {string} endpoint
 * @param {Object} params
 * @param {Object} body
 * @returns {Promise<any>}
 */
export const patch = async (endpoint, id, body) => {
  endpoint += `/${id}`

  return await request(endpoint, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
}
