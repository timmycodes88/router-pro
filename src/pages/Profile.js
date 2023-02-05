import { useState } from "react"
import { NavLink } from "react-router-dom"
import tw, { styled, css } from "twin.macro"
import ProfileAvatar from "../components/ProfileAvatar"
import ActivityFeed from "../features/profile/components/ActivityFeed"
import { useProfile, useProfileActions } from "../features/profile/ProfileRoute"

export default function Profile() {
  //* Get the Profile Data & Actions
  const { profile, isMyProfile } = useProfile()
  const { updatePreferences } = useProfileActions()

  //* Destructure the Profile Data
  const { name, profileImg, preferences, stats, activity } = profile

  //* State for Edit Mode
  const [editing, setEditing] = useState(false)

  //* State for Holding the New Preferences
  const [newPreferences, setNewPreferences] = useState(preferences)

  console.log(newPreferences)

  //* Profile Functions
  const edit = () => setEditing(true)
  const save = () => {
    updatePreferences(newPreferences)
    setEditing(false)
  }

  return (
    <ProfileWrapper bgImg={preferences.bgImg}>
      <Header>
        <PersonCard>
          <ProfileAvatar url={profileImg} name={name} />
          <h3>{name}</h3>
        </PersonCard>
        {!isMyProfile && <button>Follow</button>}
        <h1>Profile</h1>
        <NavLink to="/">Home</NavLink>
      </Header>

      {isMyProfile && (
        <>
          <button onClick={editing ? save : edit}>
            {editing ? "Save" : "Edit"}
          </button>
        </>
      )}

      <div>
        <h2>Preferences</h2>
        <Preferences
          {...newPreferences}
          setNewPreferences={setNewPreferences}
        />
      </div>
      <Columns>
        <div>
          <h2>Posts</h2>
          <ActivityFeed activity={activity} />
        </div>
        <div>
          <h2>Stats</h2>
          <Stats {...stats} />
        </div>
      </Columns>
    </ProfileWrapper>
  )
}

const Preferences = ({ mood, futureOccupation, setNewPreferences }) => {
  const handleChange = e => {
    const { name, value } = e.target
    setNewPreferences(curr => ({ ...curr, [name]: value }))
  }

  return (
    <>
      {mood && <p>Mood: {mood}</p>}
      {futureOccupation && <p>Future Occupation: {futureOccupation}</p>}
    </>
  )
}

const Stats = ({ gpa, gold, silver, bronze }) => (
  <>
    <p>GPA: {gpa}</p>
    <p>Gold: {gold} pieces</p>
    <p>Silver: {silver} pieces</p>
    <p>Bronze: {bronze} pieces</p>
  </>
)

const ProfileWrapper = styled.div(({ bgImg }) => [
  tw`h-screen`,
  bgImg && tw`text-white`,
  css`
    background-image: url(${bgImg});
    background-size: cover;
    background-position: center;
  `,
])

const Header = tw.header`flex justify-between items-center gap-4 px-10`

const PersonCard = tw.div`flex items-center gap-4`

const Columns = tw.div`flex justify-around`
