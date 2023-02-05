import { useState } from "react"
import tw from "twin.macro"
import EmptyState from "../../../components/EmptyState"
import ProfileAvatar from "../../../components/ProfileAvatar"
import { useProfileActions } from "../ProfileRoute"

export default function ActivityFeed({ activity }) {
  if (!activity.length)
    return <EmptyState title="No posts yet" message="Check back later!" />

  return (
    <Feed>
      {activity.map(post => (
        <Post key={post.postID} {...post} />
      ))}
    </Feed>
  )
}

const Post = ({ postID, name, body, likes, comments }) => {
  const { loadComments, likePost } = useProfileActions()

  //* State for Showing Comments
  const [commentsOpen, setCommentsOpen] = useState(false)

  //* Functions
  const like = () => likePost(postID)
  const showComments = () => {
    if (!comments) loadComments(postID)
    setCommentsOpen(true)
  }
  const hideComments = () => setCommentsOpen(false)

  return (
    <PostWrapper onClick={commentsOpen ? hideComments : showComments}>
      <PostHeader>{name}</PostHeader>
      <PostBody>{body}</PostBody>
      <PostFooter>likes: {likes}</PostFooter>
      <button onClick={like}>Like</button>
      <Comments>
        {commentsOpen &&
          comments?.map(({ commentID, body, name, imageURL }) => (
            <CommentCard key={commentID}>
              <span>
                <ProfileAvatar size="s" url={imageURL} name={name} />
                <h5>{name}</h5>
              </span>
              <p>{body}</p>
            </CommentCard>
          ))}
      </Comments>
    </PostWrapper>
  )
}

const Feed = tw.div`flex flex-col items-center justify-center w-full h-full`
const PostWrapper = tw.div`cursor-pointer w-64  p-4 border border-gray-300 rounded`
const PostHeader = tw.div`flex items-center justify-between`
const PostBody = tw.div`mt-4`
const PostFooter = tw.div`mt-4`
const Comments = tw.div`mt-4 flex flex-col gap-2`
const CommentCard = tw.div`flex items-center gap-4 justify-between bg-amber-100 p-2 rounded`
