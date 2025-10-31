import { useState, useRef, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import { addCard, editListTitle, deleteList } from '../features/board/boardSlice'
import Card from './Card'

const List = ({ list, cards, onPositionChange }) => {
  const dispatch = useDispatch()
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editTitle, setEditTitle] = useState(list.title)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const listRef = useRef(null)

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: list.id,
  })

  const handleAddCard = () => {
    const content = window.prompt('Enter card content:')
    if (content && content.trim()) {
      dispatch(addCard({ listId: list.id, content: content.trim() }))
    }
  }

  const handleTitleEdit = (e) => {
    e.stopPropagation()
    setIsEditingTitle(true)
    setEditTitle(list.title)
  }

  const handleTitleSave = () => {
    if (editTitle.trim() && editTitle.trim() !== list.title) {
      dispatch(editListTitle({ listId: list.id, title: editTitle.trim() }))
    }
    setIsEditingTitle(false)
  }

  const handleTitleCancel = () => {
    setEditTitle(list.title)
    setIsEditingTitle(false)
  }

  const handleTitleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleTitleSave()
    } else if (e.key === 'Escape') {
      handleTitleCancel()
    }
  }

  const handleDeleteList = () => {
    if (window.confirm(`Are you sure you want to delete the "${list.title}" list? This will also delete all cards in it.`)) {
      dispatch(deleteList({ listId: list.id }))
    }
  }

  const handleMouseDown = (e) => {
    if (isEditingTitle) return
    
    const rect = listRef.current.getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
    setIsDragging(true)
  }

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return
      
      const newPosition = {
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      }
      
      const maxX = window.innerWidth - 300
      const maxY = window.innerHeight - 200
      
      newPosition.x = Math.max(0, Math.min(newPosition.x, maxX))
      newPosition.y = Math.max(0, Math.min(newPosition.y, maxY))
      
      onPositionChange(list.id, newPosition)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragOffset, list.id, onPositionChange])

  const cardIds = cards.map(card => card.id)

  return (
    <div
      ref={listRef}
      className={`list ${isDragging ? 'list-dragging' : ''}`}
      style={{
        position: 'absolute',
        left: list.position.x,
        top: list.position.y,
        cursor: isDragging ? 'grabbing' : 'default'
      }}
    >
      <div className="list-header">
        {isEditingTitle ? (
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={handleTitleKeyDown}
            onBlur={handleTitleSave}
            autoFocus
            className="list-title-input"
          />
        ) : (
          <div 
            className="list-title"
            onMouseDown={handleMouseDown}
            title="Drag to move list"
            style={{ cursor: 'grab' }}
          >
            {list.title}
          </div>
        )}
        <div className="list-header-buttons">
          <button 
            className="edit-list-button"
            onClick={handleTitleEdit}
            title="Edit list title"
          >
            ✏️
          </button>
          <button 
            className="delete-list-button"
            onClick={handleDeleteList}
            title="Delete list"
          >
            ×
          </button>
        </div>
      </div>
      
      <div 
        ref={setDroppableRef} 
        className={`list-cards ${isOver ? 'list-cards-dragging-over' : ''}`}
      >
        <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
          {cards.map((card) => (
            <Card key={card.id} card={card} />
          ))}
          {cards.length === 0 && (
            <div className="empty-list-drop-zone">
              Drop cards here
            </div>
          )}
        </SortableContext>
      </div>
      
      <button className="add-card-button" onClick={handleAddCard}>
        + Add a card
      </button>
    </div>
  )
}

export default List