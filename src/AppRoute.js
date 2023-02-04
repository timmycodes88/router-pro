import StudentAPI from "./api/StudentAPI"

export let Student

export async function appLoader() {
  Student = StudentAPI.get()
  const student = await Student
  return { student }
}
