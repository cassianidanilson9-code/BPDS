"use client";

import { useState, KeyboardEvent } from "react";

interface Task {
  id: number;
  text: string;
  completed?: boolean;
}

export default function TodoApp() {
  const [tareas, setTareas] = useState<Task[]>([]);
  const [inputText, setInputText] = useState("");

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

  // delete  - eliminar tarea -nuevo
  const handleDelete = (id: number) => {
    setTareas((prev) => prev.filter((task) => task.id !== id));
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
        </div>
      </div>
    </main>
  );
}
