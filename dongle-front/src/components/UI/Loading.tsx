'use client'

const Loading = ({heightType="h-screen"}: any) => {
  return (
    <div className={"flex items-center justify-center " + heightType}>
      <span className="loading loading-ring loading-lg"></span>
    </div>
  )
}

export default Loading