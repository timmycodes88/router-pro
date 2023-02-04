import { NavLink } from "react-router-dom"

export default function Home() {
  return (
    <>
      <h1>Home</h1>
      <NavLink to="/profile">Profile</NavLink>
    </>
  )
}
