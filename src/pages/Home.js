import { NavLink } from "react-router-dom"

export default function Home() {
  return (
    <>
      <h1>Home</h1>
      <NavLink to="/profile">My Profile</NavLink>
      <NavLink to="/profile/2">Bill's Profile</NavLink>
      <NavLink to="/profile/3">Sarah's Profile</NavLink>
    </>
  )
}
