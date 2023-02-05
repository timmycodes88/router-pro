import { useLoaderData, useSubmit } from "react-router-dom"
import ActivityAPI from "../../api/ActivityAPI"
import ProfileAPI from "../../api/ProfileAPI"
import StatsAPI from "../../api/StatsAPI"
import { Student } from "../../AppRoute"

/**
 *
 * @param {{ params: { acellusID: string | undefined } }} props
 * @param {import("react-router-dom").RouteComponentProps["request"]["params"]} props.request.params
 * @returns {{
 *   profile: Profile,
 *   isMyProfile: boolean
 * }} Profile
 */
export async function profileLoader({ params: { acellusID } }) {
  //* Get the Student Object
  const student = await Student

  //* Check if it is the Student's Profile or Anothers
  const isMyProfile = acellusID ? acellusID === student.acellusID : true

  //* If the URL has an ID use it, else use the student's ID
  const requestAcellusID = acellusID ? acellusID : student.acellusID

  //* Get the Profile
  let profile = await ProfileAPI.get(requestAcellusID)

  //! Check for Errors

  //* Manipulate the Profile
  profile.name = `${profile.firstName} ${profile.lastName[0]}`
  profile.preferences = profile.preferences || {}

  //* Get the Profile URL
  let profileImg = await ProfileAPI.getProfileImg(requestAcellusID)

  //! Check for Errors

  //* Add the Profile URL to the Profile
  profile.profileImg = profileImg?.url

  //* Get the Stats & Activity
  const [stats, activity] = await Promise.all([
    StatsAPI.get(requestAcellusID),
    ActivityAPI.getUserPosts(requestAcellusID),
  ])

  //! Check for Errors

  //* Add the Stats & Activity to the Profile
  profile.stats = stats
  profile.activity = activity?.posts || []

  return { profile, isMyProfile }
}

/**
 *
 * @param {{ request: { method: 'PATCH', formData: () => Promise<FormData> } }} props
 * @returns {Promise<string | null>}
 */
export async function profileAction({ request }) {
  const formData = await request.formData()
  const data = Object.fromEntries(formData.entries())

  switch (request.method) {
    case "PATCH":
      //* Get the Preferences Object from the Request Data
      const { acellusID } = await Student
      await ProfileAPI.updatePreferences(acellusID, data)
      return "success"
    default:
      return null
  }
}

/**
 *
 * @typedef {Object} Profile
 * @property {string} acellusID
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} name
 * @property {{
 * gpa: number | '-',
 * gold: number,
 * silver: number,
 * bronze: number,
 * }} stats
 * @property {{
 * posts: {
 * postID: string,
 * title: string,
 * body: string,
 * likes: number
 * }[]
 * }} activity
 * @property {string} [profileImg]
 * @property {Object} [preferences]
 * @property {string} [preferences.mood]
 * @property {string} [preferences.futureOccupation]
 * @property {string} [preferences.bgImg]
 *
 *
 * @returns {{
 *   profile: Profile,
 *   isMyProfile: boolean
 * }} Profile
 */
export function useProfile() {
  const { profile, isMyProfile } = useLoaderData()

  return { profile, isMyProfile }
}

/**
 * @typedef {Object} Preferences
 * @property {string} [mood]
 * @property {string} [futureOccupation]
 * @property {string} [bgImg]
 *
 * @returns {{
 *  updatePreferences: (preferences: Preferences) => void
 * }} Actions
 */
export function useProfileActions() {
  const submit = useSubmit()

  return {
    //* Update the Profile Preferences, takes a Preferences Object
    updatePreferences: preferences => submit(preferences, { method: "patch" }),
  }
}

/**
 * @typedef {import("react-router-dom").RouteComponentProps["request"]} Request
 */
