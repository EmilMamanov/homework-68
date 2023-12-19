import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTodos, createTodo, updateTodoStatus, deleteTodo, selectTodos, selectCompleted, selectStatus, selectError } from './features/todos/todosSlice';
import './App.css';

const App: React.FC = () => {
    const dispatch = useDispatch();
    const todos = useSelector(selectTodos);
    const completed = useSelector(selectCompleted);
    const status = useSelector(selectStatus);
    const error = useSelector(selectError);

    const [newTodoTitle, setNewTodoTitle] = useState('');

    useEffect(() => {
        dispatch(fetchTodos());
    }, [dispatch]);

    const handleCreateTodo = async () => {
        if (newTodoTitle.trim() !== '') {
            try {
                await dispatch(createTodo(newTodoTitle.trim()));
                setNewTodoTitle('');
            } catch (error) {
                console.error('Failed to create todo:', error);
            }
        }
    };

    const handleUpdateTodoStatus = async (id: string, status: boolean) => {
        try {
            await dispatch(updateTodoStatus({ id, status }));
            await dispatch(fetchTodos());
        } catch (error) {
            console.error('Failed to update todo status:', error);
        }
    };

    const handleDeleteTodo = async (id: string, status: boolean) => {
        try {
            await dispatch(deleteTodo({ id, status }));
            await dispatch(fetchTodos());
        } catch (error) {
            console.error('Failed to delete todo:', error);
        }
    };

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (status === 'failed') {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>Todo List</h1>
            <div>
                <h2>Uncompleted</h2>
                <ul>
                    {todos.map((todo) => (
                        <li key={`uncompleted-${todo.id}`}>
                            <input
                                type="checkbox"
                                checked={todo.status}
                                onChange={() => handleUpdateTodoStatus(todo.id, !todo.status)}
                            />
                            {todo.title}{' '}
                            <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h2>Completed</h2>
                <ul>
                    {completed.map((todo) => (
                        <li key={`completed-${todo.id}`}>
                            <input
                                type="checkbox"
                                checked={todo.status}
                                onChange={() => handleUpdateTodoStatus(todo.id, !todo.status)}
                            />
                            {todo.title}{' '}
                            <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <input type="text" value={newTodoTitle} onChange={(e) => setNewTodoTitle(e.target.value)} />
                <button onClick={handleCreateTodo}>Create Todo</button>
            </div>
        </div>
    );
};

export default App;