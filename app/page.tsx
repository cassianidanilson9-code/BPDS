"use client";

import { useState, KeyboardEvent } from "react";

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
  const [editText, setEditText] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const textoLimpio = inputText.trim();
      if (textoLimpio === "") return;

      const nuevaTarea: Task = {
        id: Date.now(),
        text: textoLimpio,
      };

      setTareas((prev) => [...prev, nuevaTarea]);
      setInputText("");
    }
  };

  //entra en modo ediccion
  const startEditing = (task: Task) => {
    setEditingId(task.id);
    setEditText(task.text);
  };

  
  // guarda cambios 
  const saveEdit = (id: number) => {

    if (editingId !== id) return; // Evita guardar si no es la tarea que se está editando -nuevo

    if (editText.trim() !== "") {
      setTareas((prev) =>
        prev.map((t) => (t.id === id ? { ...t, text: editText.trim() } : t)),
      );
    }
    setEditingId(null);
  };

  // update - marcar-desenmarcar como completada (solo tacha)
  const toggleComplete = (id: number) => {
    setTareas((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  };

   // delete - ya no borra la tarea: la manda a la papelera -nuevo
  const handleDelete = (id: number) => {
    const tarea = tareas.find((t) => t.id === id);
    if (!tarea) return;

    if (editingId === id) setEditingId(null);

    setTareas((prev) => prev.filter((t) => t.id !== id));
    setdeletedTareas((prev) => [{ ...tarea, completed: false }, ...prev]);
  };

  // restaurar - devuelve la tarea de la papelera a las activas -nuevo
  const handleRestore = (id: number) => {
    const tarea = deletedtareas.find((t) => t.id === id);
    if (!tarea) return;

    setdeletedTareas((prev) => prev.filter((t) => t.id !== id));
    setTareas((prev) => [...prev, tarea]);
  };

  // borrar definitivo - saca la tarea de la papelera para siempre -nuevo
  const handleDeleteForever = (id: number) => {
    setdeletedTareas((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-6 bg-zinc-950 text-white">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Mis Tareas - Grupo CUC
        </h1>

        {/* input para crear una tarea nueva */}
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

        {/*listado de tareas*/}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-zinc-400">Tareas Activas</h2>
          {tareas.length === 0 ? (
            <p className="text-center text-zinc-500 text-sm">
              No hay tareas. Escribe algo y presiona Enter.
            </p>
          ) : (
            tareas.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 bg-zinc-800/50 border border-zinc-700/50 rounded-lg gap-2"
              >
                {editingId === task.id ? (
                  // modo ediccion input con autoguardado 
                  <div className="flex flex-1 gap-2 items-center">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveEdit(task.id);
                      }}
                      
                      // auto guardado al salir de campo  -nuevo
                      onBlur={() => saveEdit(task.id)}

                      className="flex-1 px-2 py-1 text-sm bg-zinc-700 border border-zinc-600 rounded text-white focus:outline-none"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => saveEdit(task.id)}
                      className="px-2 py-1 text-xs bg-green-600 hover:bg-green-500 rounded text-white font-medium"
                    >
                      Guardar
                    </button>
                  </div>
                ) : (
                  // modo normal checkbox texto acciones 
                  <>
                    <input
                      type="checkbox"
                      checked={task.completed ?? false}
                      onChange={() => toggleComplete(task.id)}
                      aria-label={`Marcar "${task.text}" como completada`}
                      className="h-4 w-4 accent-green-600"
                    />
                    <span
                      className={`text-sm break-all flex-1 ${
                        task.completed
                          ? "text-zinc-500 line-through"
                          : "text-zinc-200"
                      }`}
                    >
                      {task.text}
                    </span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => startEditing(task)}
                        className="px-2.5 py-1 text-xs bg-yellow-600 hover:bg-yellow-500 rounded text-white font-medium"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(task.id)}
                        className="px-2.5 py-1 text-xs bg-red-600 hover:bg-red-500 rounded text-white font-medium"
                      >
                        Eliminar
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
          <p className="text-xs text-zinc-500 pt-1">
            Total de tareas activas: {tareas.length}
          </p>
        </div>

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
                      onClick={() => handleDeleteForever(task.id)}
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
