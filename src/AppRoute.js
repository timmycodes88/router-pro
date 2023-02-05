/**
 * @typedef {Object} Student
 * @property {string} acellusID
 * @property {string} firstName
 * @property {string} lastName
 */

import { get } from "./utils/request"

/** @type {Promise<Student>} */
export let Student

export async function appLoader() {
  Student = get("student")
  const student = await Student
  return { student }
}
