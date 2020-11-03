import React, { useState } from 'react'

import apiClient, { MainTodo } from '../apiClient'

interface IAddTodoProps {
  onAdd: (todo: MainTodo) => void
}

export default function AddTodo({ onAdd }: IAddTodoProps) {
  const [content, setContent] = useState('')

  async function handleSubmit(e: any) {
    e.preventDefault()

    const s = content.trim()
    if (s === '') {
      return
    }
    try {
      const res = await apiClient.getInstance().todosPost({
        content: s,
      })
      const todo = res.data
      onAdd(todo)
      setContent('')
    } catch (err) {}
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="field has-addons">
        <div className="control">
          <input
            className="input"
            type="text"
            name="content"
            placeholder="New TODO"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div className="control">
          <input type="submit" className="button is-info" value="Add" />
        </div>
      </div>
    </form>
  )
}
