import { useLoaderData } from "react-router-dom"
import ActivityAPI from "../../api/ActivityAPI"
import ProfileAPI from "../../api/ProfileAPI"
import StatsAPI from "../../api/StatsAPI"
import { Student } from "../../AppRoute"

export async function profileLoader({ params: { acellusID } }) {
  const student = await Student

  //* If ID use it, else use the student's ID
  const requestAcellusID = acellusID ? acellusID : student.acellusID

  //* Get the Profile
  let profile = await ProfileAPI.get(requestAcellusID)
  profile.name = `${profile.firstName} ${profile.lastName[0]}`

  //! Check for Errors

  //* Get the Profile URL
  let profileImg = await ProfileAPI.getProfileImg(requestAcellusID)

  //! Check for Errors

  //* Add the Profile URL to the Profile
  profile.profileImg = profileImg.url

  //* Get the Stats & Activity
  const [stats, activity] = await Promise.all([
    StatsAPI.get(requestAcellusID),
    ActivityAPI.getUserPosts(requestAcellusID),
  ])

  //! Check for Errors

  //* Add the Stats & Activity to the Profile
  profile.stats = stats
  profile.activity = activity

  return profile
}

export function useProfile() {
  const profile = useLoaderData()

  return profile
}
