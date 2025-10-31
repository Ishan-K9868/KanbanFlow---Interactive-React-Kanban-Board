# KanbanFlow

Interactive React-based Kanban board with drag-and-drop task management, free-positioning columns, and real-time editing capabilities.

## Features

- **Free-Positioning Lists**: Drag and place task columns anywhere on the screen
- **Drag & Drop Cards**: Move tasks between lists and reorder within lists
- **Real-Time Editing**: Click-to-edit functionality for both cards and list titles
- **Task Completion**: Interactive checkboxes to mark tasks as complete/incomplete
- **Dynamic List Management**: Create, edit, and delete lists with confirmation
- **Responsive Design**: Clean, modern interface with smooth animations
- **State Persistence**: Redux-powered state management for reliable data handling

## Tech Stack

- **React 19** - Modern React with latest features
- **Redux Toolkit** - Efficient state management
- **@dnd-kit** - Modern drag-and-drop library
- **Vite** - Fast build tool and development server
- **CSS3** - Custom styling with gradients and animations

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd kanban-app
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

### Managing Lists
- **Create New List**: Click the "+ Create New List" button in the header
- **Move Lists**: Click and drag any list title to reposition it anywhere on the screen
- **Edit List Title**: Click the pencil (✏️) button next to the list title
- **Delete List**: Click the red × button (confirms before deletion)

### Managing Cards
- **Add Cards**: Click "+ Add a card" button in any list
- **Edit Cards**: Click the pencil (✏️) button on any card
- **Move Cards**: Drag cards between lists or reorder within the same list
- **Complete Tasks**: Click the checkbox to mark tasks as done/undone
- **Visual Feedback**: Completed tasks show strikethrough text and grayed background

### Keyboard Shortcuts
- **Enter**: Save changes when editing
- **Escape**: Cancel editing without saving

## Project Structure

```
src/
├── components/
│   ├── Board.jsx          # Main board container with drag-and-drop context
│   ├── List.jsx           # Individual list/column component
│   └── Card.jsx           # Task card component
├── features/
│   └── board/
│       └── boardSlice.js  # Redux slice for state management
├── app/
│   └── store.js           # Redux store configuration
├── App.jsx                # Root application component
├── App.css                # Global styles
├── index.css              # Base styles and CSS reset
└── main.jsx               # Application entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## State Management

The application uses Redux Toolkit with a normalized state structure:

```javascript
{
  cards: {
    'card-id': { id, content, completed }
  },
  lists: {
    'list-id': { id, title, cardIds, position: { x, y } }
  },
  listOrder: ['list-1', 'list-2', 'list-3']
}
```

## Acknowledgments

- Built with modern React and Redux Toolkit
- Drag-and-drop powered by @dnd-kit