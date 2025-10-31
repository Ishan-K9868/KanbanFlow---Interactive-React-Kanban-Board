import { useDispatch } from 'react-redux'
import { addList } from './features/board/boardSlice'
import './App.css'
import Board from './components/Board'

function App() {
  const dispatch = useDispatch()

  const handleCreateNewList = () => {
    const title = window.prompt('Enter new list title:')
    if (title && title.trim()) {
      dispatch(addList({ title: title.trim() }))
    }
  }

  return (
    <div className="app">
      <div className="app-header">
        <h1 className="app-title">KanbanFlow</h1>
        <button className="create-list-button" onClick={handleCreateNewList}>
          + Create New List
        </button>
      </div>
      <Board />
    </div>
  )
}

export default App
