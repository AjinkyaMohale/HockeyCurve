import React, { useState } from 'react';
import './App.css';

function App() {
  // State to manage tasks
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  // Handle form submission
  const handleAddTask = (e) => {
    e.preventDefault();

    // Form validation
    if (!title || !description) {
      setError('Title and Description are required!');
      return;
    }

    setError('');
    
    const newTask = {
      id: tasks.length + 1,
      title: title,
      description: description
    };

    setTasks([...tasks, newTask]);  // Add new task to the list
    setTitle('');  // Clear form fields
    setDescription('');
  };

  // Handle delete functionality
  const handleDeleteTask = (id) => {
    const filteredTasks = tasks.filter(task => task.id !== id);
    setTasks(filteredTasks);
  };

  return (
    <div className="App">
      <h1>Task List</h1>
      
      {/* Task form */}
      <form onSubmit={handleAddTask} className="task-form">
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

        {error && <p className="error">{error}</p>}
        
        <button type="submit" className="add-button">Add Task</button>
      </form>

      {/* Task list display */}
      <div className="task-list">
        {tasks.length > 0 ? tasks.map((task) => (
          <div key={task.id} className="task-item">
            <div>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
            </div>
            <button onClick={() => handleDeleteTask(task.id)} className="delete-button">Delete</button>
          </div>
        )) : (
          <p>No tasks available. Add some tasks!</p>
        )}
      </div>
    </div>
  );
}

export default App;
