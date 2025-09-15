import React, { useEffect, useState } from 'react';

const API_URL = 'https://abm-express.onrender.com/items';

export default function ItemsABM() {
  const [items, setItems] = useState([]);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [editId, setEditId] = useState(null);
  const [editNombre, setEditNombre] = useState('');
  const [editDescripcion, setEditDescripcion] = useState('');
  const [maxProgress, setMaxProgress] = useState(100);
  const [editMaxProgress, setEditMaxProgress] = useState(100);

  const fetchItems = async () => {
    try {
      const res = await fetch(API_URL);
      setItems(await res.json());
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: nombre,
          description: descripcion,
          maxProgress: Number(maxProgress)
        })
      });
      setNombre('');
      setDescripcion('');
      setMaxProgress(100);
      fetchItems();
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setEditNombre(item.name);
    setEditDescripcion(item.description);
    setEditMaxProgress(item.maxProgress ?? 100);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${API_URL}/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editNombre,
          description: editDescripcion,
          maxProgress: Number(editMaxProgress)
        })
      });
      setEditId(null);
      setEditNombre('');
      setEditDescripcion('');
      setEditMaxProgress(100);
      fetchItems();
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Gestión de Items</h2>
            <p className="text-gray-600 mt-1">Administra el catálogo de items</p>
          </div>
          <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </div>
        </div>
        
        {/* Formulario de agregar */}
        <div className="bg-green-50 border border-green-100 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Agregar Nuevo Item</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del item
                </label>
                <input
                  type="text"
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                  placeholder="Ej: Producto XYZ"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                />
              </div>
              {/* descripción */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <input
                  type="text"
                  value={descripcion}
                  onChange={e => setDescripcion(e.target.value)}
                  placeholder="Descripción del item"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* máximo progreso */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Máximo Progreso
                </label>
                <input
                  type="number"
                  min={1}
                  value={maxProgress}
                  onChange={e => setMaxProgress(e.target.valueAsNumber || 1)}  // FIX
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors text-sm"
                  placeholder="100"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition-colors focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Agregar Item
            </button>
          </form>
        </div>

        {/* Tabla de items */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Lista de Items</h3>
          </div>
          
          {items.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              No hay items registrados
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descripción
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Máx. Progreso
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editId === item._id ? (
                          <input
                            type="text"
                            value={editNombre}
                            onChange={e => setEditNombre(e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                          />
                        ) : (
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {editId === item._id ? (
                          <input
                            type="text"
                            value={editDescripcion}
                            onChange={e => setEditDescripcion(e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                          />
                        ) : (
                          <div className="text-sm text-gray-600">{item.description}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {editId === item._id ? (
                          <input
                            type="number"
                            min={1}
                            value={editMaxProgress}
                            onChange={e => setEditMaxProgress(e.target.valueAsNumber || 1)} // FIX
                            className="w-28 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-sm"
                          />
                        ) : (
                          <div className="text-sm text-gray-700">{item.maxProgress}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {editId === item._id ? (
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={handleUpdate}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                            >
                              Guardar
                            </button>
                            <button
                              onClick={() => setEditId(null)}
                              className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm transition-colors"
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => handleEdit(item)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDelete(item._id)}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                            >
                              Eliminar
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}