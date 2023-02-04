import { get } from "../utils/request"

const Endpoint = "profile"

const ProfileAPI = {
  get: acellusID => get(Endpoint, { acellusID }),
  getProfileImg: acellusID => get(Endpoint + "-img", { acellusID }),
}

export default ProfileAPI
