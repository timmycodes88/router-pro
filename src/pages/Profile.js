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

  //* Profile Functions
  const edit = () => setEditing(true)
  const save = () => {
    updatePreferences(newPreferences)
    setEditing(false)
  }
  const cancel = () => {
    setNewPreferences(preferences)
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
          {editing && <button onClick={cancel}>Cancel</button>}
        </>
      )}

      <div>
        <h2>Preferences</h2>
        <Preferences
          {...newPreferences}
          setNewPreferences={setNewPreferences}
          editing={editing}
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

/**
 *
 * @param {Object} props
 * @param {string} props.bgImg
 * @param {string} props.mood
 * @param {string} props.futureOccupation
 * @param {boolean} props.editing
 * @returns {JSX.Element} Preferences
 */
const Preferences = ({
  mood,
  futureOccupation,
  bgImg,
  setNewPreferences,
  editing,
}) => {
  const handleChange = e => {
    const { name, value } = e.target
    setNewPreferences(curr => ({ ...curr, [name]: value }))
  }

  if (editing)
    return (
      <PreferencesWrapper>
        <div>
          <Label htmlFor="mood">Mood: </Label>
          <Select name="mood" id="mood" value={mood} onChange={handleChange}>
            <option value="Happy">Happy</option>
            <option value="Excited">Excited</option>
            <option value="Blissed">Blissed</option>
            <option value="Ecstatic">Ecstatic</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="futureOccupation">Future Occupation: </Label>
          <Input
            type="text"
            name="futureOccupation"
            id="futureOccupation"
            value={futureOccupation}
            onChange={handleChange}
          />
        </div>
      </PreferencesWrapper>
    )

  return (
    <PreferencesWrapper>
      <div>{mood && <h5>Mood: {mood}</h5>}</div>
      <div>
        {futureOccupation && <h5>Future Occupation: {futureOccupation}</h5>}
      </div>
    </PreferencesWrapper>
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

//* Profile Styles
const Header = tw.header`flex justify-between items-center gap-4 px-10`
const PersonCard = tw.div`flex items-center gap-4`
const Columns = tw.div`flex justify-around mt-20`

//* Preferences Styles
const PreferencesWrapper = tw.div`flex gap-10`
const Label = tw.label`text-xl`
const Select = tw.select`border-2 border-neutral-400 rounded-xl bg-neutral-700 text-white`
const Input = tw.input``
