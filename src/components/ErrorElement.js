import React from "react"
import { NavLink, useRouteError } from "react-router-dom"
import tw from "twin.macro"

export default function ErrorElement() {
  const error = useRouteError()

  return (
    <ErrorWrapper>
      <h1>{error.message || "Oops! Something went wrong."}</h1>
      <NavLink to="/">Go back Home</NavLink>
    </ErrorWrapper>
  )
}

const ErrorWrapper = tw.div`w-fit p-4 text-center fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-neutral-800 text-white`
