import { NavLink } from "react-router-dom"
import tw from "twin.macro"
import ProfileAvatar from "../components/ProfileAvatar"
import ActivityFeed from "../features/profile/components/ActivityFeed"
import { useProfile } from "../features/profile/ProfileRoute"

export default function Profile() {
  const profile = useProfile()

  const { name, profileImg } = profile
  // const { bgImg, mood, futureOccuation } = profile.preferences
  const { gpa, gold, silver, bronze } = profile.stats
  const { posts } = profile.activity

  return (
    <div>
      <NavLink to="/">Home</NavLink>
      <h1>Profile</h1>
      <PersonCard>
        <ProfileAvatar url={profileImg} name={name} />
        <h3>{name}</h3>
      </PersonCard>

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

const PersonCard = tw.div`flex items-center gap-4`
