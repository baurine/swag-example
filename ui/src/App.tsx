import React, { useEffect, useState } from 'react'
import apiClient, { MainTodo } from './apiClient'
import './App.css'
import TodoItem from './TodoItem'

function convertArrToMap(todos: MainTodo[]): Record<string, MainTodo> {
  return todos.reduce((accu, cur) => {
    accu[cur.id!] = cur
    return accu
  }, {} as Record<string, MainTodo>)
}

function App() {
  const [todosMap, setTodosMap] = useState<Record<string, MainTodo>>({})

  useEffect(() => {
    async function getTodos() {
      try {
        const res = await apiClient.getInstance().todosGet()
        setTodosMap(convertArrToMap(res.data))
      } catch (err) {}
    }
    getTodos()
  }, [])

  async function handleSubmit(e: any) {
    e.preventDefault()

    const data = new FormData(e.target)
    const content = data.get('content') as string
    if (content.trim() === '') {
      return
    }
    try {
      const res = await apiClient.getInstance().todosPost({
        content,
      })
      const todo = res.data
      setTodosMap({
        ...todosMap,
        [todo.id!]: todo,
      })
    } catch (err) {}
  }

  function handleUpdateTodo(todo: MainTodo) {
    setTodosMap({
      ...todosMap,
      [todo.id!]: todo,
    })
  }

  function handleDeleteTodo(todoId: string) {
    const newTodos = { ...todosMap }
    delete newTodos[todoId]
    setTodosMap(newTodos)
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" name="content" />
        <input type="submit" value="submit" />
      </form>
      {Object.values(todosMap).map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onUpdate={handleUpdateTodo}
          onDelete={handleDeleteTodo}
        />
      ))}
    </div>
  )
}

export default App
