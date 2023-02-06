import { useRouteLoaderData } from "react-router-dom"
import { get } from "./utils/request"

/**
 * @typedef {Object} Student
 * @property {string} acellusID
 * @property {string} firstName
 * @property {string} lastName
 */

/** @type {Promise<Student>} */
export let Student

export async function appLoader() {
  Student = get("student")
  const student = await Student
  return { student }
}

export const useAppRouteData = () => useRouteLoaderData("app")
