import React from 'react'
import apiClient, { MainTodo } from './apiClient'

interface ITodoItemProps {
  todo: MainTodo
  onUpdate: (todo: MainTodo) => void
  onDelete: (todoId: string) => void
}

export default function TodoItem({ todo, onUpdate, onDelete }: ITodoItemProps) {
  async function handleCheck(event: any) {
    const checked = event.target.checked
    try {
      await apiClient.getInstance().todosIdPut(todo.id!, {
        content: todo.content,
        done: checked,
      })
      onUpdate({ ...todo })
    } catch (err) {}
  }

  async function handleDelete() {
    try {
      await apiClient.getInstance().todosIdDelete(todo.id!)
      onDelete(todo.id!)
    } catch (err) {}
  }

  return (
    <div>
      <label>
        <input
          type="checkbox"
          onChange={handleCheck}
          defaultChecked={todo.done}
        ></input>
        <span>{todo.content}</span>
      </label>
      <button onClick={handleDelete}>remove</button>
    </div>
  )
}
