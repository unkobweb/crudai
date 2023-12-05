import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"

export const AITerminal = () => {
  const [request, setRequest] = useState("")

  const queryClient = useQueryClient()

  function speakToAI() {
    fetch("http://localhost:3333/users/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        request
      })
    }).then(async () => {
      console.log("Request sent")
      queryClient.invalidateQueries({queryKey: ["users"]})
    })
  }

  return (
    <>
      <h2>Request : {request}</h2>
      <input type="text" value={request} onChange={e => setRequest(e.target.value)} />
      <button onClick={() => speakToAI()}>Send</button>
    </>
  )
}