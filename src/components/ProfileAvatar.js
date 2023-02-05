import React from "react"
import tw, { styled } from "twin.macro"

export default function ProfileAvatar({ size, url, name }) {
  if (url) return <ImageAvatar url={url} name={name} size={size} />
  const initials = name
    .split(" ")
    .map(i => i[0])
    .join("")
  return <InitialsAvatar initials={initials} size={size} />
}

const ImageAvatar = ({ size, url, name }) => (
  <Image size={size} src={url} alt={name} />
)
const Image = styled.img(({ size }) => [
  tw`w-20 h-20 rounded-full border-2`,
  size === "s" && tw`w-10 h-10`,
])

const InitialsAvatar = ({ size, initials }) => (
  <Circle size={size}>{initials}</Circle>
)
const Circle = styled.div(({ size }) => [
  tw`bg-red-500 text-white text-3xl w-20 h-20 rounded-full flex items-center justify-center text-center`,
  size === "s" && tw`w-10 h-10 text-xl`,
])
