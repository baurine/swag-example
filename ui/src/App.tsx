import React, { useEffect, useState } from 'react'

import apiClient, { MainTodo } from './apiClient'
import AddTodo from './components/AddTodo'
import TodoItem from './components/TodoItem'

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

  function handleAddOrUpdateTodo(todo: MainTodo) {
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
    <section className="section">
      <div className="container" style={{ maxWidth: 300 }}>
        <AddTodo onAdd={handleAddOrUpdateTodo} />

        <div style={{ marginTop: 16 }}>
          {Object.values(todosMap).map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onUpdate={handleAddOrUpdateTodo}
              onDelete={handleDeleteTodo}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default App
