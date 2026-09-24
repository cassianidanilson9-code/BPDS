'use client';

import { useState, KeyboardEvent, useEffect } from 'react';

interface Task {
  id: number;
  text: string;
  completed?: boolean;
}

export default function TodoApp() {
  const [tareas, setTareas] = useState<Task[]>([]);

  const [deletedtareas, setdeletedTareas] = useState<Task[]>([]);

  const [inputText, setInputText] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const savedTareas = localStorage.getItem('cuc_tareas');
      if (savedTareas) setTareas(JSON.parse(savedTareas));

      const savedDeleted = localStorage.getItem('cuc_deletedtareas');
      if (savedDeleted) setdeletedTareas(JSON.parse(savedDeleted));
    } catch (e) {
      console.error("Error al cargar datos del localStorage", e);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem('cuc_tareas', JSON.stringify(tareas));
  }, [tareas, mounted]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem('cuc_deletedtareas', JSON.stringify(deletedtareas));
  }, [deletedtareas, mounted]);

  if (!mounted) {
    return null;
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const textoLimpio = inputText.trim();
      if (textoLimpio === '') return;

      const nuevaTarea: Task = {
        id: Date.now(),
        text: textoLimpio,
      };

      setTareas((prev) => [...prev, nuevaTarea]);
      setInputText('');
    }
  };

  const startEditing = (task: Task) => {
    setEditingId(task.id);
    setEditText(task.text);
  };

  const saveEdit = (id: number) => {
    if (editingId !== id) return;

    if (editText.trim() !== '') {
      setTareas((prev) =>
        prev.map((t) => (t.id === id ? { ...t, text: editText.trim() } : t))
      );
    }
    setEditingId(null);
  };

  const toggleComplete = (id: number) => {
    setTareas((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleDelete = (id: number) => {
    const taskToDelete = tareas.find((t) => t.id === id);
    if (!taskToDelete) return;
    setTareas((prev) => prev.filter((task) => task.id !== id));
    setdeletedTareas((prev) => [{ ...taskToDelete, completed: false }, ...prev]);
  };

  const handleRestore = (id: number) => {
    const taskToRestore = deletedtareas.find((t) => t.id === id);
    if (!taskToRestore) return;
    setdeletedTareas((prev) => prev.filter((task) => task.id !== id));
    setTareas((prev) => [...prev, taskToRestore]);
  };

  const handlePermanentDelete = (id: number) => {
    setdeletedTareas((prev) => prev.filter((task) => task.id !== id));
  };

  const completadas = tareas.filter((t) => t.completed).length;

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-6 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-white">
      <div className="w-full max-w-md bg-zinc-900/70 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6 shadow-2xl shadow-black/40 mt-10">

        {/* Header */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-3 shadow-lg shadow-indigo-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Mis Tareas
          </h1>
          <p className="text-xs text-zinc-500 mt-1">Grupo CUC</p>
        </div>

        {/* Input */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe una tarea y presiona Enter..."
              className="w-full px-4 py-3 bg-zinc-800/80 border border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white placeholder-zinc-500 text-sm transition-all"
            />
          </div>
        </div>

        {/* Tareas activas */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Tareas Activas</h2>
            {tareas.length > 0 && (
              <span className="text-[11px] text-zinc-500">
                {completadas}/{tareas.length} completadas
              </span>
            )}
          </div>

          {tareas.length === 0 ? (
            <div className="py-8 text-center border border-dashed border-zinc-800 rounded-xl">
              <p className="text-sm text-zinc-500">
                No hay tareas todavía
              </p>
              <p className="text-xs text-zinc-600 mt-1">
                Escribe algo arriba y presiona Enter
              </p>
            </div>
          ) : (
            tareas.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 bg-zinc-800/50 hover:bg-zinc-800/80 border border-zinc-700/50 rounded-xl gap-2 transition-colors"
              >
                {editingId === task.id ? (
                  <div className="flex flex-1 gap-2 items-center">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEdit(task.id);
                      }}
                      onBlur={() => saveEdit(task.id)}
                      className="flex-1 px-3 py-1.5 text-sm bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => saveEdit(task.id)}
                      className="px-3 py-1.5 text-xs bg-green-600 hover:bg-green-500 rounded-lg text-white font-medium transition-colors"
                    >
                      Guardar
                    </button>
                  </div>
                ) : (
                  <>
                    <label className="flex items-center flex-1 gap-3 cursor-pointer min-w-0">
                      <input
                        type="checkbox"
                        checked={task.completed ?? false}
                        onChange={() => toggleComplete(task.id)}
                        aria-label={`Marcar "${task.text}" como completada`}
                        className="h-4 w-4 accent-indigo-500 shrink-0 cursor-pointer"
                      />
                      <span
                        className={`text-sm break-all ${
                          task.completed
                            ? 'text-zinc-500 line-through'
                            : 'text-zinc-200'
                        }`}
                      >
                        {task.text}
                      </span>
                    </label>
                    <div className="flex gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => startEditing(task)}
                        aria-label="Editar tarea"
                        className="px-2.5 py-1.5 text-xs bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-lg font-medium transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(task.id)}
                        aria-label="Eliminar tarea"
                        className="px-2.5 py-1.5 text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg font-medium transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}

          {tareas.length > 0 && (
            <p className="text-xs text-zinc-600 pt-1 text-center">
              Total de tareas activas: {tareas.length}
            </p>
          )}
        </div>

        {/* Papelera */}
        <div className="mt-6 pt-5 border-t border-zinc-800/80 space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-zinc-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                  <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
                Papelera
              </span>
              <span className="px-2 py-0.5 text-[10px] font-medium bg-zinc-800 text-zinc-400 rounded-full">
                {deletedtareas.length}
              </span>
            </div>
          </div>

          {deletedtareas.length === 0 ? (
            <div className="py-4 text-center border border-dashed border-zinc-800/60 rounded-xl">
              <p className="text-xs text-zinc-600">No hay elementos eliminados</p>
            </div>
          ) : (
            <div className="space-y-2">
              {deletedtareas.map((task) => (
                <div
                  key={task.id}
                  className="group flex items-center justify-between p-3 bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-800/60 rounded-xl transition-all gap-3"
                >
                  <span className="text-sm text-zinc-500 line-through truncate flex-1 font-light">
                    {task.text}
                  </span>
                  <div className="flex items-center gap-1.5 opacity-90 group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => handleRestore(task.id)}
                      className="px-2.5 py-1 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors font-medium"
                    >
                      Restaurar
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePermanentDelete(task.id)}
                      className="px-2.5 py-1 text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors font-medium"
                    >
                      Borrar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
