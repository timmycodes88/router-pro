import { get } from "../utils/request"

const Endpoint = "stats"

const StatsAPI = {
  get: acellusID => get(Endpoint, { acellusID }),
}

export default StatsAPI
