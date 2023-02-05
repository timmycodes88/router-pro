import StudentAPI from "./api/StudentAPI"

/**
 * @typedef {Object} Student
 * @property {string} acellusID
 * @property {string} firstName
 * @property {string} lastName
 */

/** @type {Promise<Student>} */
export let Student

export async function appLoader() {
  Student = StudentAPI.get()
  const student = await Student
  return { student }
}
