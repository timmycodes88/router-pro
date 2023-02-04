import { Suspense } from "react"
import { Outlet } from "react-router-dom"
import tw, { css, styled } from "twin.macro"

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Outlet />
    </Suspense>
  )
}

const Loading = () => (
  <SpinnerWrapper>
    <span class="loader"></span>
  </SpinnerWrapper>
)
const SpinnerWrapper = styled.div(() => [
  tw`flex justify-center items-center fixed inset-0 w-screen h-screen`,
  css`
    .loader {
      width: 48px;
      height: 48px;
      border: 5px solid #fff333;
      border-bottom-color: #ff3d00;
      border-radius: 50%;
      display: inline-block;
      box-sizing: border-box;
      animation: rotation 1s linear infinite;
    }

    @keyframes rotation {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  `,
])
