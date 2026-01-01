// import React from 'react'
// const counterslice= createSlice({
//   name: 'counter',
//   initialState: { value: 0 },
//   reducers: {
//     increment: (state) => {
//       state.value += 1
//     },
//     decrement: (state) => {
//       state.value -= 1
//     },
//     reset: (state) => {
//       state.value = 0
//     }
//   }
// })

import { count } from "console"

// export const { increment, decrement, reset } = counterslice.actions 

const counter = () => {
  return (
    <div>
        <h1>{count}</h1>
        <button onClick={() => increment()}>Increment</button>
        <button onClick={() => decrement()}>Decrement</button>
        <button onClick={() => reset()}>Reset</button>
    </div>
  )
}

addTodo:(state,actions)=>{
    sta
}
export default counter