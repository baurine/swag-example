import React from 'react'

import apiClient, { MainTodo } from '../apiClient'

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
      onUpdate({ ...todo, done: checked })
    } catch (err) {}
  }

  async function handleDelete() {
    try {
      await apiClient.getInstance().todosIdDelete(todo.id!)
      onDelete(todo.id!)
    } catch (err) {}
  }

  return (
    <div
      style={{
        padding: 8,
        marginBottom: 8,
        border: '1px solid #ccc',
        borderRadius: 4,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <label className="checkbox" style={{ flex: 1 }}>
        <input type="checkbox" onChange={handleCheck} checked={todo.done} />
        &nbsp;&nbsp;
        <span style={{ textDecoration: todo.done ? 'line-through' : 'none' }}>
          {todo.content}
        </span>
      </label>
      <button className="button is-small" onClick={handleDelete}>
        remove
      </button>
    </div>
  )
}
