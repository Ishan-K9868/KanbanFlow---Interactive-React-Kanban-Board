import { useSelector, useDispatch } from "react-redux";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useState } from "react";
import { moveCard, updateListPosition } from "../features/board/boardSlice";
import List from "./List";
import Card from "./Card";

const Board = () => {
  const { cards, lists, listOrder } = useSelector((state) => state.board);
  const dispatch = useDispatch();
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleListDrag = (listId, newPosition) => {
    dispatch(updateListPosition({ listId, position: newPosition }));
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;

    if (!over || !active) return;

    const activeId = active.id;
    const overId = over.id;

    let sourceListId = null;
    for (const [listId, list] of Object.entries(lists)) {
      if (list.cardIds.includes(activeId)) {
        sourceListId = listId;
        break;
      }
    }

    let destinationListId = null;
    if (lists[overId]) {
      destinationListId = overId;
    } else if (cards[overId]) {
      for (const [listId, list] of Object.entries(lists)) {
        if (list.cardIds.includes(overId)) {
          destinationListId = listId;
          break;
        }
      }
    }

    if (
      sourceListId &&
      destinationListId &&
      sourceListId !== destinationListId
    ) {
      const sourceIndex = lists[sourceListId].cardIds.indexOf(activeId);
      let destinationIndex = lists[destinationListId].cardIds.length;

      if (cards[overId]) {
        destinationIndex = lists[destinationListId].cardIds.indexOf(overId);
      }

      dispatch(
        moveCard({
          source: { droppableId: sourceListId, index: sourceIndex },
          destination: {
            droppableId: destinationListId,
            index: destinationIndex,
          },
          draggableId: activeId,
        })
      );
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    let sourceListId = null;
    let sourceIndex = -1;
    for (const [listId, list] of Object.entries(lists)) {
      const cardIndex = list.cardIds.indexOf(activeId);
      if (cardIndex !== -1) {
        sourceListId = listId;
        sourceIndex = cardIndex;
        break;
      }
    }

    if (!sourceListId) return;

    let destinationListId = null;
    let destinationIndex = 0;

    if (lists[overId]) {
      destinationListId = overId;
      destinationIndex = lists[overId].cardIds.length;
    } else if (cards[overId]) {
      for (const [listId, list] of Object.entries(lists)) {
        const cardIndex = list.cardIds.indexOf(overId);
        if (cardIndex !== -1) {
          destinationListId = listId;
          destinationIndex = cardIndex;

          if (sourceListId === destinationListId && sourceIndex < cardIndex) {
            destinationIndex = cardIndex;
          } else if (
            sourceListId === destinationListId &&
            sourceIndex > cardIndex
          ) {
            destinationIndex = cardIndex;
          } else {
            destinationIndex = cardIndex + 1;
          }
          break;
        }
      }
    }

    if (!destinationListId) return;

    if (
      sourceListId === destinationListId &&
      sourceIndex !== destinationIndex
    ) {
      dispatch(
        moveCard({
          source: { droppableId: sourceListId, index: sourceIndex },
          destination: {
            droppableId: destinationListId,
            index: destinationIndex,
          },
          draggableId: activeId,
        })
      );
    }
  };

  const activeCard = activeId && cards[activeId] ? cards[activeId] : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="board">
        {listOrder.map((listId) => {
          const list = lists[listId];
          const listCards = list.cardIds
            .map((cardId) => cards[cardId])
            .filter(Boolean);

          return (
            <List
              key={list.id}
              list={list}
              cards={listCards}
              onPositionChange={handleListDrag}
            />
          );
        })}
      </div>

      <DragOverlay>
        {activeCard ? <Card card={activeCard} isDragging /> : null}
      </DragOverlay>
    </DndContext>
  );
};

export default Board;
