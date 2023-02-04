import EmptyState from "../../../components/EmptyState"

export default function ActivityFeed({ posts }) {
  if (!posts.length)
    return <EmptyState title="No posts yet" message="Check back later!" />

  return (
    <ul>
      {posts.map(({ postID, title, body, likes }) => (
        <li key={postID}>
          <h4>Title: {title}</h4>
          <p>{body}</p>
          <p>likes: {likes}</p>
        </li>
      ))}
    </ul>
  )
}
