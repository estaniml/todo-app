import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX, faPenToSquare, faCheck } from '@fortawesome/free-solid-svg-icons'
import Title from './components/Title';

function App() {

  const [textInput, setTextInput] = useState('');
  const [todos, setTodos] = useState(() => {
    const todos = localStorage.getItem('todosList');
    return todos ? JSON.parse(todos) : [];
  });
  const [edit, setEdit] = useState({});

  useEffect(() => {
    const obtenerLS = () => {
      const todosLS = JSON.parse(localStorage.getItem('todosList')) ?? [];
      setTodos(todosLS) ;
    }
    obtenerLS();
  }, [])

  useEffect(() => {
    localStorage.setItem('todosList', JSON.stringify(todos));
    
  }, [todos])

  useEffect(() => {
    if(Object.keys(edit).length > 0) {
      setTextInput(edit.textInput);
    }
  }, [edit])
  

  const handleSubmit = e => {
    e.preventDefault();

    if(textInput.trim() === '') {
      return;
    }

    if(edit.id){
      const updatedTodos = todos.map( todo => {
        if(todo.id === edit.id) {
          return { ...todo, textInput: textInput }
        }
        return todo;
      })
      setTodos(updatedTodos);
      setEdit({});
    } else {
      setTodos([
        ...todos, 
        {textInput, completed: false, id: Date.now()}
      ]);
    }
    setTextInput('');
  }

  
  const handleDelete = index => {
    const deleteTodo = todos.filter( todo => todo.id !== index);
    setTodos(deleteTodo);
  }
  
  const handleDone = index => {
    const doneTodo = todos.map( todo => todo.id === index ? {...todo, completed: !todo.completed} : todo);
    setTodos(doneTodo);
  }
  
  return (
    <div className="container">
      <Title />
      <form
        className='form'
        onSubmit={handleSubmit}
      >
        <input 
          autoFocus
          className='input'
          type="text" 
          placeholder="Write your objective..." 
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
        />  
        <button 
          type="submit">
          { edit.id ? 'Edit' : 'new'}
        </button>
      </form>
      <div className='list'>
        <ul className='ullist'>
          {todos.map((todo) => (
            <li 
              key={todo.id}
              className={todo.completed ? 'done' : ''}
            >
              <p>{todo.textInput}</p>
              <FontAwesomeIcon 
                icon={faCheck} 
                onClick={() => handleDone(todo.id)}
                style={{
                  cursor: 'pointer',
                }}
              />
              <FontAwesomeIcon icon={faPenToSquare} 
                onClick={() => setEdit(todo)}
                style={{
                  cursor: 'pointer',
                }}
              />
              <FontAwesomeIcon 
                icon={faX} 
                onClick={() => handleDelete(todo.id)}
                style={{
                  cursor: 'pointer',
                }}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
      
  )
}

export default App
