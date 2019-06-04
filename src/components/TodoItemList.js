import React from 'react';
import TodoItem from './TodoItem';

const sameTodos = (prevProps, nextProps)=>{
  return prevProps.todos === nextProps.todos;
}

const TodoItemList = ({todos, onToggle, onRemove})=>{

  const todoList = todos.map(
    (todo) => (
      <TodoItem
        {...todo}
        onToggle={onToggle}
        onRemove={onRemove}
        key={todo.id}
      />
    )
  );

  return (
    <div>
      {todoList}    
    </div>
  );
}

export default React.memo(TodoItemList, sameTodos);