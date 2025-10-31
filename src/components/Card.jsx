import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { editCard, toggleCardComplete } from '../features/board/boardSlice'

const Card = ({ card, isDragging = false }) => {
  const dispatch = useDispatch()
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(card.content)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ 
    id: card.id,
    disabled: isEditing
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging || isSortableDragging ? 0.5 : 1,
  }

  const handleEditClick = (e) => {
    e.stopPropagation()
    setIsEditing(true)
    setEditContent(card.content)
  }

  const handleCheckboxChange = (e) => {
    e.stopPropagation()
    dispatch(toggleCardComplete({ cardId: card.id }))
  }

  const handleSave = () => {
    if (editContent.trim() && editContent.trim() !== card.content) {
      dispatch(editCard({ cardId: card.id, content: editContent.trim() }))
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditContent(card.content)
    setIsEditing(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  if (isEditing) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="card card-editing"
      >
        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          autoFocus
          className="card-edit-textarea"
        />
      </div>
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`card ${isDragging || isSortableDragging ? 'card-dragging' : ''} ${card.completed ? 'card-completed' : ''}`}
    >
      <div className="card-content">
        <input
          type="checkbox"
          checked={card.completed}
          onChange={handleCheckboxChange}
          className="card-checkbox"
          onClick={(e) => e.stopPropagation()}
        />
        <span 
          {...listeners}
          className={`card-text ${card.completed ? 'card-text-completed' : ''}`}
          title="Drag to move card"
        >
          {card.content}
        </span>
        <button 
          className="edit-card-button"
          onClick={handleEditClick}
          title="Edit card"
        >
          ✏️
        </button>
      </div>
    </div>
  )
}

export default Card