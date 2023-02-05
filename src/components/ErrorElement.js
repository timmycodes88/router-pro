import React from "react"
import { NavLink, useRouteError } from "react-router-dom"

export default function ErrorElement() {
  const error = useRouteError()

  return (
    <div>
      <h1>{error.message || "Oops! Something went wrong."}</h1>
      <NavLink to="/">Go back Home</NavLink>
    </div>
  )
}
