import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  cards: {
    'card-1': { id: 'card-1', content: 'Design the application', completed: false },
    'card-2': { id: 'card-2', content: 'Set up Redux store', completed: false },
    'card-3': { id: 'card-3', content: 'Implement drag and drop', completed: false },
    'card-4': { id: 'card-4', content: 'Style the components', completed: true },
    'card-5': { id: 'card-5', content: 'Add card creation functionality', completed: false },
    'card-6': { id: 'card-6', content: 'Test the application', completed: true }
  },
  lists: {
    'list-1': { 
      id: 'list-1', 
      title: 'To Do', 
      cardIds: ['card-1', 'card-2', 'card-5'],
      position: { x: 50, y: 100 }
    },
    'list-2': { 
      id: 'list-2', 
      title: 'In Progress', 
      cardIds: ['card-3'],
      position: { x: 370, y: 100 }
    },
    'list-3': { 
      id: 'list-3', 
      title: 'Done', 
      cardIds: ['card-4', 'card-6'],
      position: { x: 690, y: 100 }
    }
  },
  listOrder: ['list-1', 'list-2', 'list-3']
}

const generateCardId = () => {
  return `card-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
}

const generateListId = () => {
  return `list-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
}

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    addCard: (state, action) => {
      const { listId, content } = action.payload
      
      const newCardId = generateCardId()
      
      state.cards[newCardId] = {
        id: newCardId,
        content: content.trim(),
        completed: false
      }
      
      if (state.lists[listId]) {
        state.lists[listId].cardIds.push(newCardId)
      }
    },
    
    moveCard: (state, action) => {
      const { source, destination, draggableId } = action.payload
      
      const sourceList = state.lists[source.droppableId]
      const destinationList = state.lists[destination.droppableId]
      
      if (!sourceList || !destinationList) return
      
      sourceList.cardIds.splice(source.index, 1)
      
      destinationList.cardIds.splice(destination.index, 0, draggableId)
    },
    
    moveList: (state, action) => {
      const { source, destination, draggableId } = action.payload
      
      state.listOrder.splice(source.index, 1)
      
      state.listOrder.splice(destination.index, 0, draggableId)
    },
    
    editCard: (state, action) => {
      const { cardId, content } = action.payload
      
      if (state.cards[cardId]) {
        state.cards[cardId].content = content.trim()
      }
    },
    
    toggleCardComplete: (state, action) => {
      const { cardId } = action.payload
      
      if (state.cards[cardId]) {
        state.cards[cardId].completed = !state.cards[cardId].completed
      }
    },
    
    addList: (state, action) => {
      const { title } = action.payload
      
      const newListId = generateListId()
      
      const existingLists = Object.values(state.lists)
      const newPosition = existingLists.length > 0 
        ? { x: 50 + (existingLists.length * 320), y: 100 }
        : { x: 50, y: 100 }
      
      state.lists[newListId] = {
        id: newListId,
        title: title.trim(),
        cardIds: [],
        position: newPosition
      }
      
      state.listOrder.push(newListId)
    },
    
    editListTitle: (state, action) => {
      const { listId, title } = action.payload
      
      if (state.lists[listId]) {
        state.lists[listId].title = title.trim()
      }
    },
    
    deleteList: (state, action) => {
      const { listId } = action.payload
      
      if (state.lists[listId]) {
        state.lists[listId].cardIds.forEach(cardId => {
          delete state.cards[cardId]
        })
        
        delete state.lists[listId]
        
        state.listOrder = state.listOrder.filter(id => id !== listId)
      }
    },
    
    updateListPosition: (state, action) => {
      const { listId, position } = action.payload
      
      if (state.lists[listId]) {
        state.lists[listId].position = position
      }
    }
  }
})

export const { addCard, moveCard, moveList, editCard, toggleCardComplete, addList, editListTitle, deleteList, updateListPosition } = boardSlice.actions
export default boardSlice.reducer