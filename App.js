import React, {useState, useCallback} from 'react';
import Form from './components/Form';
import TodoItemList from './components/TodoItemList';
import TodoListTemplate from './components/TodoListTemplate';

let id = 3;

const App = ()=>{
  const [input, setInput] = useState('');
  const [todos, setTodos] = useState([
    { id: 0, text: ' 리액트 소개0', checked: false },
    { id: 1, text: ' 리액트 소개1', checked: true },
    { id: 2, text: ' 리액트 소개2', checked: false }
  ]);

  const handleChange = useCallback(e => {
    setInput(e.target.value);
  }, []);

  const handleCreate = useCallback(() => {
    setInput('');
    setTodos(todos => 
      todos.concat({
        id: id++,
        text: input,
        checked: false
      })
    );
  }, [input]);

  const handleKeyPress = useCallback(e => {
    // 눌려진 키가 Enter 면 handleCreate 호출
    if(e.key === 'Enter') 
      handleCreate();
  }, [input]);

  const handleToggle = useCallback(id => {
    // 파라미터로 받은 id 를 가지고 몇번째 아이템인지 찾습니다.
    setTodos(todos=>{
      const index = todos.findIndex(todo => todo.id === id);

      const selected = todos[index]; // 선택한 객체
  
      const nextTodos = [...todos]; // 배열을 복사
  
      // 기존의 값들을 복사하고, checked 값을 덮어쓰기
      nextTodos[index] = { 
        ...selected, 
        checked: !selected.checked
      };

      return nextTodos;
    });
  }, []);

  const handleRemove = useCallback(id => {
    setTodos(todos => todos.filter(todo => todo.id !== id));
  }, []);

  return (
    <TodoListTemplate form={(
      <Form 
        value={input}
        onKeyPress={handleKeyPress}
        onChange={handleChange}
        onCreate={handleCreate}
      />
    )}>
      <TodoItemList todos={todos} onToggle={handleToggle} onRemove={handleRemove} />
    </TodoListTemplate>
  );
}

export default App;
