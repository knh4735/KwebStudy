import React from 'react';
import './TodoItem.css';

const sameChecked = (prevProps, nextProps)=>{
  return prevProps.checked === nextProps.checked;
}

const TodoItem = ({ id, text, checked, onToggle, onRemove })=>{
  return (
    <div className="todo-item" onClick={() => onToggle(id)}>
      <div className="remove" onClick={(e) => {
          e.stopPropagation(); // onToggle 이 실행되지 않도록 함
          onRemove(id)}
      }>
        &times;
      </div>
      <div className={`todo-text ${checked && 'checked'}`}>
        <div>{id} : {text}</div>
      </div>
      {checked && (<div className="check-mark">✓</div>)}
    </div>
  );
}

export default React.memo(TodoItem, sameChecked);