import { get } from "../utils/request"

const Endpoint = "student"

const StudentAPI = {
  get: params => get(Endpoint, params),
}

export default StudentAPI
