import React, { useEffect, useState } from 'react';
import { getTodos, getUser } from './api';
import TodoList from './components/TodoList/TodoList';
import TodoFilter from './components/TodoFilter/TodoFilter';
import TodoModal from './components/TodoModal/TodoModal';
import Loader from './components/Loader/Loader';

// Визначаємо тип для Todo
interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

// Визначаємо тип для User
interface User {
  id: number;
  name: string;
}

const App = () => {
  const [todos, setTodos] = useState<Todo[]>([]); // Вказуємо тип для todos
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]); // Вказуємо тип для filteredTodos
  const [loading, setLoading] = useState<boolean>(true); // Вказуємо тип для loading
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null); // Вказуємо тип для selectedTodo
  const [user, setUser] = useState<User | null>(null); // Вказуємо тип для user
  const [query, setQuery] = useState<string>(''); // Вказуємо тип для query
  const [statusFilter, setStatusFilter] = useState<string>('all'); // Вказуємо тип для statusFilter

  // Функція фільтрації
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const filterTodos = (status: string, query: string) => {
    let filtered = todos;

    if (status === 'completed') {
      filtered = filtered.filter(todo => todo.completed);
    } else if (status === 'active') {
      filtered = filtered.filter(todo => !todo.completed);
    }

    if (query) {
      filtered = filtered.filter(todo =>
        todo.title.toLowerCase().includes(query.toLowerCase()),
      );
    }

    setFilteredTodos(filtered);
  };

  // Завантажуємо todos
  useEffect(() => {
    const fetchTodos = async () => {
      setLoading(true);
      const todosData = await getTodos();

      setTodos(todosData);
      setFilteredTodos(todosData);
      setLoading(false);
    };

    fetchTodos();
  }, []);

  // Завантажуємо користувача
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const userData = await getUser(1); // замінити на реальний ID користувача

      setUser(userData);
      setLoading(false);
    };

    fetchUser();
  }, []);

  // Обробка фільтрації за заголовком
  const handleFilterByTitle = (newQuery: string) => {
    setQuery(newQuery); // Оновлюємо стан query
    filterTodos(statusFilter, newQuery); // Використовуємо нову змінну newQuery
  };

  // Обробка фільтрації за статусом
  const handleFilterByStatus = (status: string) => {
    setStatusFilter(status);
    filterTodos(status, query); // Використовуємо query з state
  };

  // Показ модального вікна
  const handleShowTodoModal = (todo: Todo) => {
    setSelectedTodo(todo);
  };

  // Закриття модального вікна
  const handleCloseModal = () => {
    setSelectedTodo(null);
  };

  return (
    <div>
      {loading ? <Loader /> : null}

      {user && <h1>Welcome, {user.name}</h1>}

      <TodoFilter
        onFilterByTitle={handleFilterByTitle}
        onFilterByStatus={handleFilterByStatus}
        query={query}
      />

      <TodoList todos={filteredTodos} onShowTodoModal={handleShowTodoModal} />

      {selectedTodo && (
        <TodoModal todo={selectedTodo} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default App;
