import { get } from "../utils/request"

const Endpoint = "activity"

const ActivityAPI = {
  getAll: () => get(Endpoint),
  getUserPosts: acellusID => get(Endpoint, { acellusID }),
}

export default ActivityAPI
