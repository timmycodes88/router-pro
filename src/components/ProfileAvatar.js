import React from "react"
import tw from "twin.macro"

export default function ProfileAvatar({ url, name }) {
  if (url) return <ImageAvatar url={url} name={name} />
  const initials = name
    .split(" ")
    .map(i => i[0])
    .join("")
  return <InitialsAvatar initials={initials} />
}

const ImageAvatar = ({ url, name }) => <Image src={url} alt={name} />
const Image = tw.img`w-32 h-32 rounded-full border-2`

const InitialsAvatar = ({ initials }) => <Circle>{initials}</Circle>
const Circle = tw.div`bg-red-500 text-white w-32 h-32 rounded-full flex items-center text-center`
