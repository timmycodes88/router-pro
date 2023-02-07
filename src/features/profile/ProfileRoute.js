import { useActionData, useLoaderData, useSubmit } from "react-router-dom"
import ActivityAPI from "../../api/ActivityAPI"
import ProfileAPI from "../../api/ProfileAPI"
import StatsAPI from "../../api/StatsAPI"
import { Student } from "../../AppRoute"
import { isErrorResponse } from "../../utils/request"

/**
 *
 * @typedef {Object} Profile
 * @property {string} acellusID
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} name
 * @property {Stats} stats
 * @property {Post[]} activity
 * @property {string} [imageURL]
 * @property {Preferences} [preferences]
 *
 *
 *
 * @typedef {Object} Stats
 * @property {number} gpa
 * @property {number} gold
 * @property {number} silver
 * @property {number} bronze
 *
 *
 *
 * @typedef {Object} Preferences
 * @property {string} [mood]
 * @property {string} [futureOccupation]
 * @property {string} [bgImg]
 *
 *
 *
 * @typedef {Object} Post
 * @property {string} postID
 * @property {string} acellusID
 * @property {string} body
 * @property {number} [likes]
 * @property {Comment[]} [comments]
 *
 *
 *
 * @typedef {Object} Comment
 * @property {string} commentID
 * @property {string} body
 * @property {string} acellusID
 * @property {string} name
 * @property {string} [imageURL]
 */

/**@typedef {Profile | undefined} PROFILE */
let PROFILE //* This is the Global Profile Object

/**
 * This is the Profile Loader
 * @param {import("react-router-dom").LoaderFunctionArgs} props
 * @returns {Promise<{
 *   profile: Profile,
 *   isMyProfile: boolean
 * }>} Profile
 */
export async function profileLoader({ params: { acellusID } }) {
  //* Get the Student Object
  const student = await Student

  //* Check if it is the Student's Profile or Anothers
  const isMyProfile = acellusID ? acellusID === student.acellusID : true

  //* If the URL has an ID use it, else use the student's ID
  const requestAcellusID = acellusID ? acellusID : student.acellusID

  //* Get the initial Profile Response
  const profile = await ProfileAPI.get(requestAcellusID)

  //! Check for Errors
  if (isErrorResponse(profile)) throw new Error("Profile Not Found")

  //* Manipulate the Profile
  profile.name = `${profile.firstName} ${profile.lastName[0]}.`
  profile.preferences = profile.preferences || {}

  //* Get the ProfileAvatar, Stats & Activity
  const [imageURL, stats, activity] = await Promise.all([
    ProfileAPI.getProfileImg(requestAcellusID),
    StatsAPI.get(requestAcellusID),
    ActivityAPI.getUserPosts(requestAcellusID),
  ])

  //! Check for Errors
  if (isErrorResponse(imageURL)) throw new Error("Error getting Profile Image")
  if (isErrorResponse(stats)) throw new Error("Problem Fetching Stats")
  if (isErrorResponse(activity)) throw new Error("Problem Fetching Activity")

  //* Add the Profile URL to the Profile
  profile.imageURL = imageURL?.url

  //* Add the Stats to profile
  profile.stats = stats

  //* Add the Activity to profile
  if (activity?.posts)
    // Add the Name and Profile Image to each Post
    profile.activity = activity.posts
      //So I'm filtering out the post that don't match the acellusID because the API is returning all posts even when i query for one smh
      .filter(post => post.acellusID === profile.acellusID)
      .map(post => ({
        ...post,
        name: profile.name,
        imageURL: profile.imageURL,
      }))
  else profile.activity = []

  //* Set Profile as a Global Variable
  PROFILE = profile

  return { profile: PROFILE, isMyProfile }
}

//* ------------- Action Types -------------
const UPDATE_PREFERENCES = "UPDATE_PREFERENCES"
const LIKE_POST = "LIKE_POST"
const GET_COMMENTS = "GET_COMMENTS"
const ADD_COMMENT = "ADD_COMMENT"

/**
 * This is the Profile Action
 * @param {import("react-router-dom").ActionFunctionArgs} props
 * @returns {Promise<{profile: Profile}>}
 */
export async function profileAction({ request }) {
  const formData = await request.formData()

  /**
   * @typedef {Object} data
   * @property {UPDATE_PREFERENCES | LIKE_POST | GET_COMMENTS | ADD_COMMENT} type
   * @property {Preferences} [preferences]
   * @property {string} [postID]
   */
  const data = Object.fromEntries(formData.entries())
  console.log(data)
  switch (data.type) {
    case UPDATE_PREFERENCES:
      await updatePreferences(JSON.parse(data.preferences))
      break
    case LIKE_POST:
      await likePost(data.postID)
      break
    case ADD_COMMENT:
      await addComment(data.postID, data.message)
      break
    case GET_COMMENTS:
      await getComments(data.postID)
      break
    default:
      throw new Error("Invalid Action Type")
  }

  return { profile: PROFILE }
}

//* ------------- ACTION FUNCTIONS -------------
//* [ these are async functions that update PROFILE before it is returned in the ACTION ]

/**
 * Updates the Preferences to the Backend and Returns the Updated Preferences
 * @param {Preferences}
 * @returns {Promise<void>} Promise to Update PROFILE.preferences
 */
async function updatePreferences(preferences) {
  //! Make sure required args were provided
  if (!preferences) throw new Error("Need Preferences to run this type")
  //* Get the Student's ID
  const { acellusID } = await Student
  //* Update the Preferences
  const res = await ProfileAPI.updatePreferences(acellusID, { preferences })
  //! Check for Errors
  if (isErrorResponse(res)) throw new Error("Failed Updating Preferences")
  //* Update the Global Profile
  PROFILE.preferences = preferences
}

/**
 * Likes a Post on the backend and returns the updated Activity Array
 * @param {string} postID
 * @return {Promise<void>} Promise to Update PROFILE.activity
 */
async function likePost(postID) {
  //! Make sure required args were provided
  if (!postID) throw new Error("No Post ID Provided")
  //* Get the Student's ID
  const { acellusID } = await Student
  //* Like the Post
  const res = await ActivityAPI.patchLike(postID, { acellusID })
  //! Check for Errors
  if (isErrorResponse(res)) throw new Error("Failed Liking Post")
  //* Create a new Activity Array with the updated Post
  const activity = PROFILE.activity.map(post => {
    if (post.postID === postID) {
      post.likes = post.likes + 1
      post.liked = true
    }
    return post
  })
  //* Update the Global Profile
  PROFILE.activity = activity
}

/**
 * Adds a comment to a post, also refreshes the comments after it's posted and returns the updated activity array
 * @param {string} postID
 * @param {string} message
 * @returns {Promise<void>} Promise to post comment and update PROFILE.activity
 */
async function addComment(postID, message) {
  //! Make sure required args were provided
  if (!postID || !message)
    throw new Error("Must had a PostID and Message to add a Comment")
  //* Post the comment
  const res = await ActivityAPI.postComment({ postID, body: message })
  //! Check for Errors
  if (isErrorResponse(res)) throw new Error("Failed posting Comment")
  //* Refetch Comments for this post
  await getComments(postID)
}

/**
 * Get comments for a post and returns a new activity promise
 * @param {string} postID
 * @returns {Promise<void>} Promise to update LIBRARY.activity["postID"].comments
 */
async function getComments(postID) {
  //! Make sure required args were provided
  if (!postID) throw new Error("No Post ID Provided")

  //* Get Comments for Post
  const res = await ActivityAPI.getComments(postID)

  //! Check for Errors
  if (isErrorResponse(res)) throw new Error("Failed Fetching Comments")

  //* Add the Name and Profile Image to each Comment
  //Map over the comments and return array of promises (that will resolve to the comment with the name and imageURL)
  const commentPromises = res.comments.map(async comment => {
    // Get the Commenter's Profile and Image
    const [profile, imageURL] = await Promise.all([
      ProfileAPI.get(comment.acellusID),
      ProfileAPI.getProfileImg(comment.acellusID),
    ])

    //!Check for Errors
    if (isErrorResponse(profile))
      throw new Error("Failed Fetching Profile of Commenter")
    if (isErrorResponse(imageURL))
      throw new Error("Failed Fetching Profile Image of Commenter")

    // Manipulate the Comment with the Commenter's Name and Image
    comment.name = `${profile.firstName} ${profile.lastName[0]}`
    comment.imageURL = imageURL?.url

    return comment //This is a Promise that needs to be resolved
  })

  const newComments = await Promise.all(commentPromises)

  //* Create activity array of Profile with the Modified comments
  const activity = PROFILE.activity.map(post => {
    if (post.postID === postID) post.comments = newComments
    return post
  })

  //* Used to Update the Global Profile.activity
  PROFILE.activity = activity
}

//* ------------- FRONTEND HOOKS -------------

/**
 * Get Data for Profile Modal
 * @returns {{
 *   profile: Profile,
 *   isMyProfile: boolean
 * }} Profile
 */
export function useProfile() {
  const { profile: initialProfile, isMyProfile } = useLoaderData()
  const actionData = useActionData()

  return { profile: actionData?.profile || initialProfile, isMyProfile }
}

/**
 * @returns {{
 *  updatePreferences: (preferences: Preferences) => void
 *  loadComments: (postID: string) => void
 *  addComment: (postID: string, message: string) => void
 *  likePost: (postID: string) => void
 * }} Actions
 */
export function useProfileActions() {
  const submit = useSubmit()

  return {
    /**
     * Update the Profile Preferences, takes a Preferences Object
     * @param {Preferences} preferences
     */
    updatePreferences: preferences =>
      submit(
        { preferences: JSON.stringify(preferences), type: UPDATE_PREFERENCES },
        { method: "post" }
      ),
    /**
     * Append a Post's Comments to the Post based on it's Post ID
     * @param {string} postID
     */
    loadComments: postID =>
      submit({ postID, type: GET_COMMENTS }, { method: "post" }),
    /**
     * Post a Comment on a Post based on it's ID
     * @param {string} postID
     * @param {string} message
     */
    addComment: (postID, message) =>
      submit({ postID, message, type: ADD_COMMENT }, { method: "post" }),
    /**
     * Likes the Post based on it's Post ID
     * @param {string} postID
     */
    likePost: postID => submit({ postID, type: LIKE_POST }, { method: "post" }),
  }
}
