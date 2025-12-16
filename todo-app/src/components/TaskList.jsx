import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useTasks } from '../contexts/TaskContext';
import TaskItem from './TaskItem';

const TaskList = () => {
  const { getFilteredTasks, reorderTasks, tasks } = useTasks();
  const filteredTasks = getFilteredTasks();

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(tasks);
    const sourceIndex = items.findIndex(t => t.id === result.draggableId);
    const [reorderedItem] = items.splice(sourceIndex, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    reorderTasks(items);
  };

  if (filteredTasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
          No tasks found
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Add a new task or adjust your filters
        </p>
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="tasks">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`space-y-3 ${snapshot.isDraggingOver ? 'bg-blue-50 dark:bg-blue-900/10 rounded-lg' : ''}`}
          >
            {filteredTasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <TaskItem task={task} isDragging={snapshot.isDragging} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default TaskList;
