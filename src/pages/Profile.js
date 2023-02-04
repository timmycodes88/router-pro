import { NavLink } from "react-router-dom"
import ActivityFeed from "../features/profile/components/ActivityFeed"
import { useProfile } from "../features/profile/ProfileRoute"

export default function Profile() {
  const profile = useProfile()

  const { firstName, lastName, profileImg } = profile
  // const { bgImg, mood, futureOccuation } = profile.preferences
  const { gpa, gold, silver, bronze } = profile.stats
  const { posts } = profile.activity

  return (
    <div>
      <NavLink to="/">Home</NavLink>
      <h1>Profile</h1>
      <p>{`${firstName} ${lastName[0]}`}</p>
      <img src={profileImg} alt="Tim V" />
      <div>
        <h2>Stats</h2>
        <p>GPA: {gpa}</p>
        <p>Gold: {gold} pieces</p>
        <p>Silver: {silver} pieces</p>
        <p>Bronze: {bronze} pieces</p>
      </div>
      <div>
        <h2>Posts</h2>
        <ActivityFeed posts={posts} />
      </div>
    </div>
  )
}
