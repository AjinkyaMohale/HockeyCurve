import React, { useReducer, useState } from 'react';
import './App.css';

// Reducer function to handle state transitions
function taskReducer(state, action) {
  switch (action.type) {
    case 'ADD_TASK':
      return [...state, action.payload];
    case 'DELETE_TASK':
      return state.filter(task => task.id !== action.payload);
    case 'EDIT_TASK':
      return state.map(task => task.id === action.payload.id ? action.payload : task);
    case 'TOGGLE_TASK':
      return state.map(task => task.id === action.payload ? { ...task, completed: !task.completed } : task);
    default:
      return state;
  }
}

function App() {
  // Use useReducer for managing tasks
  const [tasks, dispatch] = useReducer(taskReducer, []);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Low');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [editingTask, setEditingTask] = useState(null);

  // Validate title uniqueness and due date
  const isTitleUnique = (title) => !tasks.some(task => task.title === title);
  const isFutureDate = (date) => new Date(date) >= new Date(new Date().toISOString().split('T')[0]);

  // Handle form submission for adding or editing a task
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !description || !dueDate) {
      setError('All fields are required!');
      return;
    }

    if (!isTitleUnique(title) && !editingTask) {
      setError('Title must be unique!');
      return;
    }

    if (!isFutureDate(dueDate)) {
      setError('Due date must be today or in the future!');
      return;
    }

    setError('');

    if (editingTask) {
      dispatch({
        type: 'EDIT_TASK',
        payload: { ...editingTask, title, description, dueDate, priority }
      });
      setEditingTask(null);
    } else {
      dispatch({
        type: 'ADD_TASK',
        payload: { id: tasks.length + 1, title, description, dueDate, priority, completed: false }
      });
    }

    // Clear form fields
    setTitle('');
    setDescription('');
    setDueDate('');
    setPriority('Low');
  };

  // Handle task deletion
  const handleDeleteTask = (id) => dispatch({ type: 'DELETE_TASK', payload: id });

  // Handle task editing
  const handleEditTask = (task) => {
    setTitle(task.title);
    setDescription(task.description);
    setDueDate(task.dueDate);
    setPriority(task.priority);
    setEditingTask(task);
  };

  // Handle task completion toggle
  const handleToggleTask = (id) => dispatch({ type: 'TOGGLE_TASK', payload: id });

  // Filter tasks by search query
  const filteredTasks = tasks.filter(task => task.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="App">
      <h1>Task List</h1>

      {/* Task form */}
      <form onSubmit={handleSubmit} className="task-form">
        <div>
          <label htmlFor="title">Title:</label>
          <input 
            type="text" 
            id="title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
          />
        </div>

        <div>
          <label htmlFor="description">Description:</label>
          <textarea 
            id="description" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
          />
        </div>

        <div>
          <label htmlFor="dueDate">Due Date:</label>
          <input 
            type="date" 
            id="dueDate" 
            value={dueDate} 
            onChange={(e) => setDueDate(e.target.value)} 
          />
        </div>

        <div>
          <label htmlFor="priority">Priority:</label>
          <select 
            id="priority" 
            value={priority} 
            onChange={(e) => setPriority(e.target.value)}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        {error && <p className="error">{error}</p>}

        <button type="submit" className="add-button">
          {editingTask ? 'Update Task' : 'Add Task'}
        </button>
      </form>

      {/* Search bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Task list */}
      <div className="task-list">
        {filteredTasks.length > 0 ? filteredTasks.map((task) => (
          <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
            <div>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p><strong>Due Date:</strong> {task.dueDate}</p>
              <p><strong>Priority:</strong> {task.priority}</p>
            </div>
            <div className="task-actions">
              <button onClick={() => handleToggleTask(task.id)} className="toggle-button">
                {task.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
              </button>
              <button onClick={() => handleEditTask(task)} className="edit-button">Edit</button>
              <button onClick={() => handleDeleteTask(task.id)} className="delete-button">Delete</button>
            </div>
          </div>
        )) : (
          <p>No tasks available.</p>
        )}
      </div>
    </div>
  );
}

export default App;
