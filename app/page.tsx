'use client';

import { useState } from 'react';

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

export default function TodoApp() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputText, setInputText] = useState('');

  // LÓGICA DE CREATE: Guarda al presionar Enter y limpia el input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputText.trim() !== '') {
      e.preventDefault();
      const newTask: Task = {
        id: Date.now(),
        text: inputText.trim(),
        completed: false,
      };
      setTasks([...tasks, newTask]);
      setInputText('');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-6 bg-zinc-950 text-white">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl">
        <h1 className="text-2xl font-bold mb-4 text-center">Mis Tareas - Grupo</h1>

        {/* INPUT DE CREACIÓN */}
        <div className="mb-6">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe una tarea y presiona Enter..."
            className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-zinc-400"
          />
        </div>

        {/* AQUÍ ES TU PARTE: LISTAR LAS TAREAS CON .map() */}
        <div className="space-y-3">
          {tasks.length === 0 ? (
            <p className="text-center text-zinc-500 text-sm">No hay tareas. Escribe algo y presiona Enter.</p>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 bg-zinc-800/50 border border-zinc-700/50 rounded-lg"
              >
                <span className="text-sm text-zinc-200">{task.text}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}