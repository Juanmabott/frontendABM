import React, { useEffect, useMemo, useState } from 'react'

const API_URL = 'https://abm-express.onrender.com/users'

// Utilidades UI simples (sin librerías externas)
function classNames(...cls) {
  return cls.filter(Boolean).join(' ')
}

function Badge({ children, tone = 'blue' }) {
  const tones = {
    blue: 'bg-blue-50 text-blue-700 ring-blue-200',
    green: 'bg-green-50 text-green-700 ring-green-200',
    gray: 'bg-gray-50 text-gray-700 ring-gray-200',
    red: 'bg-red-50 text-red-700 ring-red-200',
    amber: 'bg-amber-50 text-amber-700 ring-amber-200',
  }
  return (
    <span
      className={classNames(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset',
        tones[tone] || tones.blue
      )}
    >
      {children}
    </span>
  )
}

function Button({ children, variant = 'primary', className = '', ...props }) {
  const variants = {
    primary:
      'bg-blue-600 hover:bg-blue-700 text-white ring-blue-500 focus:ring-2 focus:ring-offset-2',
    secondary:
      'bg-gray-800 hover:bg-gray-900 text-white ring-gray-500 focus:ring-2 focus:ring-offset-2',
    ghost:
      'bg-transparent hover:bg-gray-50 text-gray-700 ring-gray-300 focus:ring-2',
    danger:
      'bg-red-600 hover:bg-red-700 text-white ring-red-500 focus:ring-2 focus:ring-offset-2',
    success:
      'bg-green-600 hover:bg-green-700 text-white ring-green-500 focus:ring-2 focus:ring-offset-2',
  }
  return (
    <button
      className={classNames(
        'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

function Input({ label, hint, className = '', ...props }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-2 block text-sm font-medium text-gray-800">{label}</span>
      )}
      <input
        className={classNames(
          'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200',
          className
        )}
        {...props}
      />
      {hint && <span className="mt-1 block text-xs text-gray-500">{hint}</span>}
    </label>
  )
}

function Card({ title, subtitle, right, children }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      {(title || right) && (
        <div className="flex items-center justify-between gap-2 border-b border-gray-200 px-6 py-4">
          <div>
            {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
          </div>
          {right}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  )
}

function Modal({ open, title, description, onClose, actions }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-gray-900/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">
        <h4 className="text-lg font-semibold text-gray-900">{title}</h4>
        {description && <p className="mt-2 text-sm text-gray-600">{description}</p>}
        <div className="mt-6 flex justify-end gap-3">{actions}</div>
      </div>
    </div>
  )
}

function EmptyState({ title, subtitle, cta }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
        <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6"><path d="M12 6v12m6-6H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
      </div>
      <h4 className="text-base font-semibold text-gray-900">{title}</h4>
      {subtitle && <p className="max-w-md text-sm text-gray-600">{subtitle}</p>}
      {cta}
    </div>
  )
}

export default function UsuariosABM() {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Crear
  const [nombre, setNombre] = useState('')
  const [puntos, setPuntos] = useState('')
  const [clase, setClase] = useState('');
  const [steamId, setSteamId] = useState('');          // NUEVO
  const [availableItems, setAvailableItems] = useState([]); // ya existente o añadir
  const [selectedItems, setSelectedItems] = useState([]);   // ahora [{id, progress}]
  const [editItemsProgress, setEditItemsProgress] = useState({}); // { itemId: progress }

  // Editar
  const [editId, setEditId] = useState(null)
  const [editNombre, setEditNombre] = useState('')
  const [editPuntos, setEditPuntos] = useState('')
  const [editClase, setEditClase] = useState('');
  const [editSteamId, setEditSteamId] = useState('');       // NUEVO
  const [editMultiplier, setEditMultiplier] = useState(1) // NUEVO

  // UI extra
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState('points') // 'name' | 'points'
  const [sortDir, setSortDir] = useState('desc') // 'asc' | 'desc'

  // Modal eliminar
  const [pendingDelete, setPendingDelete] = useState(null)

  // Selección múltiple
  const [selectedUserIds, setSelectedUserIds] = useState([]); // selección múltiple
  const [bulkDeltaPoints, setBulkDeltaPoints] = useState('');
  const [bulkClase, setBulkClase] = useState('');
  const [bulkAppendItem, setBulkAppendItem] = useState('');
  const [bulkAppendItemProgress, setBulkAppendItemProgress] = useState('0');
  const [bulkSetProgressItems, setBulkSetProgressItems] = useState([]); // [{item, progress}]

  // Para añadir item en edición individual
  const [editNewItemId, setEditNewItemId] = useState('');
  const [editNewItemProgress, setEditNewItemProgress] = useState('0');

  const fetchUsuarios = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(API_URL)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setUsuarios(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Error fetching usuarios:', err)
      setError('No se pudo cargar la lista. Verificá el servidor API.')
    } finally {
      setLoading(false)
    }
  }

  const fetchItems = async () => {
    try {
      const r = await fetch('https://abm-express.onrender.com/items');
      const data = await r.json();
      setAvailableItems(Array.isArray(data) ? data : []);
    } catch {
      // silencioso (opcional: console.warn('No se pudieron cargar items'))
    }
  }

  useEffect(() => {
    fetchUsuarios()
    fetchItems()                                                    // NUEVO
  }, [])

  const resetCreate = () => {
    setNombre('')
    setPuntos('')
    setClase('');           // NUEVO
    setSteamId('');
    setSelectedItems([])                                            // NUEVO
  }

  const toggleSelectItem = (id) => {
    setSelectedItems(prev => {
      const exists = prev.find(p => p.id === id);
      if (exists) return prev.filter(p => p.id !== id);
      return [...prev, { id, progress: 0 }];
    });
  };

  const updateSelectedItemProgress = (id, value) => {
    setSelectedItems(prev =>
      prev.map(p => p.id === id ? { ...p, progress: Math.max(0, Number(value) || 0) } : p)
    );
  };

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!nombre.trim()) return
    setSaving(true)
    try {
      const body = {
        name: nombre.trim(),
        points: parseInt(puntos || '0', 10) || 0,
        clase: clase.trim(),
        steamId: steamId.trim(),
        items: selectedItems.map(s => ({ item: s.id, progress: s.progress }))
      };
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error('Error al crear usuario')
      resetCreate()
      fetchUsuarios()
    } catch (err) {
      console.error('Error adding usuario:', err)
      setError('No se pudo crear el usuario.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Error al eliminar')
      setPendingDelete(null)
      fetchUsuarios()
    } catch (err) {
      console.error('Error deleting usuario:', err)
      setError('No se pudo eliminar el usuario.')
    }
  }

  const handleEdit = (usuario) => {
    setEditId(usuario._id)
    setEditNombre(usuario.name)
    setEditPuntos(usuario.points)
    setEditClase(usuario.clase || '');           // NUEVO
    setEditSteamId(usuario.steamId || ''); // NUEVO

    // Al entrar en edición de un usuario cargar progresos actuales
    const map = {};
    (usuario.items || []).forEach(en => {
      if (en.item?._id) map[en.item._id] = en.progress || 0;
    });
    setEditItemsProgress(map);
  }

  const cancelEdit = () => {
    setEditId(null)
    setEditNombre('')
    setEditPuntos('')
    setEditClase('');         // NUEVO
    setEditSteamId('');
    setEditMultiplier(1) // NUEVO
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch(`${API_URL}/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editNombre,
          points: parseInt(editPuntos || '0', 10) || 0,
          clase: editClase,
          steamId: editSteamId.trim(),
          items: Object.entries(editItemsProgress).map(([item, progress]) => ({ item, progress }))
        }),
      })
      if (!res.ok) throw new Error('Error al actualizar')
      cancelEdit()
      fetchUsuarios()
    } catch (err) {
      console.error('Error updating usuario:', err)
      setError('No se pudo actualizar el usuario.')
    } finally {
      setSaving(false)
    }
  }

  // Filtrar + ordenar en memoria
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = [...usuarios]
    if (q) {
      list = list.filter((u) =>
        String(u.name || '').toLowerCase().includes(q) || String(u.points || '').includes(q)
      )
    }
    list.sort((a, b) => {
      if (sortBy === 'name') {
        const an = String(a.name || '').toLowerCase()
        const bn = String(b.name || '').toLowerCase()
        return sortDir === 'asc' ? an.localeCompare(bn) : bn.localeCompare(an)
      } else {
        const ap = Number(a.points || 0)
        const bp = Number(b.points || 0)
        return sortDir === 'asc' ? ap - bp : bp - ap
      }
    })
    return list
  }, [usuarios, query, sortBy, sortDir])

  // Nuevo: helpers de rango (acumulativo desde Cadete)
  const rankDefs = useMemo(() => {
    const defs = [
      { name: 'Acólito', value: 20, cumulative: false },
      { name: 'Aprendiz', value: 30, cumulative: false },
      { name: 'Cadete', value: 40, cumulative: true },
      { name: 'Agente', value: 45, cumulative: true },
      { name: 'Preceptor', value: 50, cumulative: true },
      { name: 'Operador', value: 55, cumulative: true },
      { name: 'Centurión', value: 60, cumulative: true },
      { name: 'Inspector', value: 65, cumulative: true },
    ]
    let lastThreshold = 0
    return defs.map(r => {
      if (r.cumulative) {
        lastThreshold = lastThreshold + r.value
      } else {
        lastThreshold = r.value
      }
      return { ...r, threshold: lastThreshold }
    })
  }, [])

  // Ejemplo de umbrales resultantes:
  // Acólito: 20
  // Aprendiz: 30
  // Cadete: 70  (30 + 40)
  // Agente: 115 (70 + 45)
  // Preceptor: 165 (115 + 50)
  // Operador: 220 (165 + 55)
  // Centurión: 280 (220 + 60)
  // Inspector: 345 (280 + 65)

  const getRango = (pts) => {
    const p = Number(pts) || 0
    for (const r of rankDefs) {
      if (p <= r.threshold) return r.name
    }
    return rankDefs[rankDefs.length - 1].name
  }

  const rangoTone = (r) => {
    switch (r) {
      case 'Acólito': return 'gray'
      case 'Aprendiz': return 'blue'
      case 'Cadete': return 'green'
      case 'Agente': return 'amber'
      case 'Preceptor': return 'blue'
      case 'Operador': return 'green'
      case 'Centurión': return 'red'
      case 'Inspector': return 'red'
      default: return 'gray'
    }
  }

  const allFilteredSelected = filtered.length > 0 && filtered.every(u => selectedUserIds.includes(u._id));
  const toggleSelectUser = (id) => {
    setSelectedUserIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };
  const toggleSelectAllFiltered = () => {
    if (allFilteredSelected) {
      setSelectedUserIds(prev => prev.filter(id => !filtered.find(f => f._id === id)));
    } else {
      const idsToAdd = filtered.map(f => f._id).filter(id => !selectedUserIds.includes(id));
      setSelectedUserIds(prev => [...prev, ...idsToAdd]);
    }
  };

  const handleBulkApply = async () => {
    if (!selectedUserIds.length) return;
    setSaving(true);
    try {
      const payload = { ids: selectedUserIds };
      const dPoints = parseInt(bulkDeltaPoints, 10);
      if (!isNaN(dPoints) && dPoints !== 0) payload.deltaPoints = dPoints;
      if (bulkClase.trim()) payload.setClase = bulkClase.trim();
      if (bulkAppendItem) {
        payload.appendItems = [{ item: bulkAppendItem, progress: parseInt(bulkAppendItemProgress, 10) || 0 }];
      }
      if (bulkSetProgressItems.length) {
        payload.setProgressItems = bulkSetProgressItems.map(i => ({ item: i.item, progress: parseInt(i.progress, 10) || 0 }));
      }
      const res = await fetch('https://abm-express.onrender.com/users/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Bulk error');
      await fetchUsuarios();
      setSelectedUserIds([]);
      setBulkDeltaPoints('');
      setBulkClase('');
      setBulkAppendItem('');
      setBulkAppendItemProgress('0');
      setBulkSetProgressItems([]);
    } catch (err) {
      console.error('Error bulk apply', err);
      setError('No se pudieron aplicar cambios masivos');
    } finally {
      setSaving(false);
    }
  };

  const handleAddItemEdit = async () => {
    if (!editId || !editNewItemId) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/${editId}/items/append`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item: editNewItemId, progress: parseInt(editNewItemProgress, 10) || 0 })
      });
      if (!res.ok) throw new Error('Error append');
      const data = await res.json();
      // reconstruir editItemsProgress
      const map = {};
      (data.items || data.user?.items || []).forEach(en => {
        const it = en.item?._id || en.item;
        if (it) map[it] = en.progress || 0;
      });
      setEditItemsProgress(map);
      fetchUsuarios();
      setEditNewItemId('');
      setEditNewItemProgress('0');
    } catch (err) {
      console.error('Error añadiendo item', err);
      setError('No se pudo añadir item al usuario');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-screen-6xl space-y-2">
      {/* Encabezado */}
      <div className="relative overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-white p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Gestión de Usuarios</h2>
            <p className="mt-1 text-sm text-gray-600">Administra, busca y edita usuarios de tu sistema.</p>
          </div>
          <Badge tone={usuarios.length ? 'blue' : 'gray'}>
            {usuarios.length} {usuarios.length === 1 ? 'usuario' : 'usuarios'}
          </Badge>
        </div>
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-100/60 blur-3xl" />
      </div>

      {/* Acciones rápidas */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card title="Agregar Usuario" subtitle="Crear un registro nuevo">
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Nombre completo"
                placeholder="Ej: Juan Pérez"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
              <Input
                label="Puntos iniciales"
                type="number"
                min={0}
                placeholder="0"
                value={puntos}
                onChange={(e) => setPuntos(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Clase"
                placeholder="Ej: Guerrero"
                value={clase}
                onChange={(e) => setClase(e.target.value)}
              />
              <Input
                label="Steam ID64"
                placeholder="7656119..."
                value={steamId}
                onChange={(e) => setSteamId(e.target.value)}
                hint="Se usará para obtener el avatar (steamFoto)"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-800">
                Items (progreso opcional)
              </label>
              <div className="flex flex-col gap-2 max-h-52 overflow-auto rounded-lg border border-gray-300 p-2">
                {availableItems.map(it => {
                  const sel = selectedItems.find(s => s.id === it._id);
                  return (
                    <div
                      key={it._id}
                      className={`rounded border p-2 text-xs flex flex-col gap-1 ${
                        sel ? 'border-green-400 bg-green-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <button
                          type="button"
                          onClick={() => toggleSelectItem(it._id)}
                          className={`px-2 py-0.5 rounded font-medium ${
                            sel
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {sel ? 'Quitar' : 'Añadir'}
                        </button>
                        <span className="text-gray-700">{it.name}</span>
                        <span className="text-gray-500">max {it.maxProgress}</span>
                      </div>
                      {sel && (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min={0}
                            max={it.maxProgress}
                            value={sel.progress}
                            onChange={e => {
                              let v = Number(e.target.value);
                              if (!Number.isFinite(v) || v < 0) v = 0;
                              if (v > it.maxProgress) v = it.maxProgress;
                              updateSelectedItemProgress(it._id, v);
                            }}
                            className="w-20 rounded border border-gray-300 px-2 py-1 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          />
                          <div className="flex-1 h-2 bg-gray-200 rounded overflow-hidden">
                            <div
                              className="h-2 bg-green-500"
                              style={{ width: `${Math.min(100, (sel.progress / it.maxProgress) * 100)}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                {!availableItems.length && (
                  <span className="text-xs text-gray-500">No hay items disponibles</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button type="submit" disabled={saving}>
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none"><path d="M12 5v14m7-7H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                {saving ? 'Guardando…' : 'Agregar Usuario'}
              </Button>
              <Button type="button" variant="ghost" onClick={resetCreate}>
                Limpiar
              </Button>
            </div>
          </form>
        </Card>

        

        <Card title="Estadísticas" subtitle="Visión rápida" >
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div className="rounded-xl bg-gray-50 p-3">
              <dt className="text-gray-600">Promedio de puntos</dt>
              <dd className="mt-1 text-xl font-semibold text-gray-900">
                {usuarios.length
                  ? Math.round(
                      usuarios.reduce((acc, u) => acc + (Number(u.points) || 0), 0) / usuarios.length
                    )
                  : 0}
              </dd>
            </div>
            <div className="rounded-xl bg-gray-50 p-3">
              <dt className="text-gray-600">Top puntos</dt>
              <dd className="mt-1 text-xl font-semibold text-gray-900">
                {usuarios.length ? Math.max(...usuarios.map((u) => Number(u.points) || 0)) : 0}
              </dd>
            </div>
          </dl>
        </Card>
      </div>
      <Card title="Buscar & Ordenar" subtitle="Encontrá usuarios rápido">
          <div className="space-y-2">
            <Input
              label="Búsqueda"
              placeholder="Nombre o puntos…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="grid grid-cols-4 gap-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-800">Ordenar por</span>
                <select
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="points">Puntos</option>
                  <option value="name">Nombre</option>
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-800">Dirección</span>
                <select
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  value={sortDir}
                  onChange={(e) => setSortDir(e.target.value)}
                >
                  <option value="desc">Descendente</option>
                  <option value="asc">Ascendente</option>
                </select>
              </label>
            </div>
          </div>
        </Card>

      {/* Lista */}
      <Card title="Lista de Usuarios" subtitle="Editá en línea y gestioná acciones">
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-xl bg-gray-100" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No hay usuarios"
            subtitle="Agregá un nuevo usuario o modificá el filtro de búsqueda."
            cta={<Button onClick={fetchUsuarios} variant="secondary">Recargar</Button>}
          />
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <div className="max-h-[520px] overflow-auto">
              <table className="w-full text-left">
                <thead className="sticky top-0 z-10 bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-2 py-3">
                      <input type="checkbox" checked={allFilteredSelected} onChange={toggleSelectAllFiltered} />
                    </th>
                    <th className="px-6 py-3">Steam</th>
                    <th className="px-6 py-3">Nombre</th>
                    <th className="px-6 py-3">Clase</th>
                    <th className="px-6 py-3">Puntos</th>
                    <th className="px-6 py-3">Rango</th>
                    <th className="px-6 py-3">Items</th>
                    <th className="px-6 py-3 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filtered.map(usuario => {
                    const rangoActual = getRango(usuario.points)
                    const editRango = getRango(editPuntos)
                    return (
                      <tr key={usuario._id} className="hover:bg-gray-50">
                        <td className="px-2 py-4 align-top">
                          <input type="checkbox" checked={selectedUserIds.includes(usuario._id)} onChange={() => toggleSelectUser(usuario._id)} />
                        </td>

                        {/* Columna Steam (avatar + steamId) */}
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200 border border-gray-300">
                              {usuario.steamFoto ? (
                                usuario.steamId ? (
                                  <a
                                    href={`https://steamcommunity.com/profiles/${usuario.steamId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title="Ver perfil en Steam"
                                  >
                                    <img
                                      src={usuario.steamFoto}
                                      alt="avatar"
                                      className="h-full w-full object-cover"
                                      referrerPolicy="no-referrer"
                                    />
                                  </a>
                                ) : (
                                  <img
                                    src={usuario.steamFoto}
                                    alt="avatar"
                                    className="h-full w-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                )
                              ) : (
                                <div className="h-full w-full flex items-center justify-center text-[10px] text-gray-500">
                                  N/A
                                </div>
                              )}
                            </div>
                            {editId === usuario._id ? (
                              <input
                                type="text"
                                value={editSteamId}
                                onChange={e => setEditSteamId(e.target.value)}
                                className="w-40 rounded-md border border-gray-300 px-2 py-1 text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                placeholder="Steam ID64"
                              />
                            ) : null /* Ocultamos visualización directa del steamId */}
                          </div>
                        </td>

                        {/* Nombre (segundo ahora) */}
                        <td className="whitespace-nowrap px-6 py-4">
                          {editId === usuario._id ? (
                            <input
                              type="text"
                              value={editNombre}
                              onChange={(e) => setEditNombre(e.target.value)}
                              className="w-full rounded-md border border-gray-300 px-2 py-1 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            />
                          ) : (
                            <div className="text-sm font-medium text-gray-900">{usuario.name}</div>
                          )}
                        </td>

                        {/* Clase */}
                        <td className="whitespace-nowrap px-6 py-4">
                          {editId === usuario._id ? (
                            <input
                              type="text"
                              value={editClase}
                              onChange={(e) => setEditClase(e.target.value)}
                              className="w-full rounded-md border border-gray-300 px-2 py-1 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm"
                              placeholder="Clase"
                            />
                          ) : (
                            <span className="text-xs text-gray-700">{usuario.clase || '—'}</span>
                          )}
                        </td>

                        {/* Puntos */}
                        <td className="whitespace-nowrap px-6 py-4">
                          {editId === usuario._id ? (
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditPuntos(prev => {
                                      const n = Math.max(0, (parseInt(prev || '0', 10) || 0) - (parseInt(editMultiplier || 1, 10) || 1))
                                      return String(n)
                                    })
                                  }}
                                  className="h-8 w-8 rounded-md bg-red-600 text-white hover:bg-red-700 text-sm font-bold flex items-center justify-center"
                                >-</button>
                                <input
                                  type="number"
                                  min={0}
                                  value={editPuntos}
                                  onChange={(e) => setEditPuntos(e.target.value)}
                                  className="w-24 rounded-md border border-gray-300 px-2 py-1 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditPuntos(prev => {
                                      const n = (parseInt(prev || '0', 10) || 0) + (parseInt(editMultiplier || 1, 10) || 1)
                                      return String(n)
                                    })
                                  }}
                                  className="h-8 w-8 rounded-md bg-green-600 text-white hover:bg-green-700 text-sm font-bold flex items-center justify-center"
                                >+</button>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-gray-500">x</span>
                                <input
                                  type="number"
                                  min={1}
                                  value={editMultiplier}
                                  onChange={(e) => setEditMultiplier(e.target.value)}
                                  className="w-16 rounded-md border border-gray-300 px-2 py-1 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm"
                                  title="Multiplicador"
                                />
                              </div>
                            </div>
                          ) : (
                            <Badge tone="green">{usuario.points} pts</Badge>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {editId === usuario._id ? (
                            <Badge tone={rangoTone(editRango)}>{editRango}</Badge>
                          ) : (
                            <Badge tone={rangoTone(rangoActual)}>{rangoActual}</Badge>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {editId === usuario._id ? (
                            <div className="flex flex-col gap-2 max-w-sm">
                              {(usuario.items || []).map(en => {
                                const itemId = en.item?._id;
                                const max = en.item?.maxProgress ?? 100;
                                const val = editItemsProgress[itemId] ?? 0;
                                return (
                                  <div key={itemId} className="rounded border border-gray-200 p-2">
                                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                                      <span>{en.item?.name}</span>
                                      <span>{val}/{max}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <button
                                        type="button"
                                        onClick={() => setEditItemsProgress(m => ({
                                          ...m,
                                          [itemId]: Math.max(0, (m[itemId] || 0) - 1)
                                        }))}
                                        className="h-6 w-6 flex items-center justify-center rounded bg-red-500 text-white text-xs"
                                      >-</button>
                                      <input
                                        type="number"
                                        min={0}
                                        max={max}
                                        value={val}
                                        onChange={e => {
                                          let v = Number(e.target.value);
                                          if (!Number.isFinite(v) || v < 0) v = 0;
                                          if (v > max) v = max;
                                          setEditItemsProgress(m => ({ ...m, [itemId]: v }));
                                        }}
                                        className="w-16 rounded border border-gray-300 px-1 py-0.5 text-xs focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => setEditItemsProgress(m => {
                                          const nv = Math.min(max, (m[itemId] || 0) + 1);
                                          return { ...m, [itemId]: nv };
                                        })}
                                        className="h-6 w-6 flex items-center justify-center rounded bg-green-600 text-white text-xs"
                                      >+</button>
                                      <div className="flex-1 h-2 bg-gray-200 rounded overflow-hidden">
                                        <div
                                          className="h-2 bg-green-500"
                                          style={{ width: `${Math.min(100, (val / max) * 100)}%` }}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                              {(!usuario.items || !usuario.items.length) && (
                                <span className="text-xs italic text-gray-400">Sin items asignados</span>
                              )}
                              {/* Añadir nuevo item en edición individual */}
                              <div className="mt-2 p-2 rounded border border-dashed border-gray-300 bg-gray-50 flex flex-col gap-2">
                                <div className="text-[10px] uppercase tracking-wide font-semibold text-gray-600">Añadir item</div>
                                <div className="flex items-center gap-2">
                                  <select
                                    className="rounded border border-gray-300 px-2 py-1 text-xs"
                                    value={editNewItemId}
                                    onChange={e => setEditNewItemId(e.target.value)}
                                  >
                                    <option value="">-- Item --</option>
                                    {availableItems.filter(it => !(usuario.items || []).find(en => en.item?._id === it._id)).map(it => (
                                      <option key={it._id} value={it._id}>{it.name}</option>
                                    ))}
                                  </select>
                                  <input
                                    type="number"
                                    min={0}
                                    className="w-20 rounded border border-gray-300 px-2 py-1 text-xs"
                                    value={editNewItemProgress}
                                    onChange={e => setEditNewItemProgress(e.target.value)}
                                  />
                                  <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={handleAddItemEdit}
                                    disabled={!editNewItemId || saving}
                                  >Añadir</Button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col gap-1 max-w-sm">
                              {(usuario.items || []).map(en => {
                                const max = en.item?.maxProgress ?? 100;
                                const val = en.progress || 0;
                                return (
                                  <div key={en.item?._id} className="flex items-center gap-2 text-xs">
                                    <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 border border-gray-200">
                                      {en.item?.name}
                                    </span>
                                    <div className="flex-1 h-2 bg-gray-200 rounded overflow-hidden">
                                      <div
                                        className="h-2 bg-green-500"
                                        style={{ width: `${Math.min(100, (val / max) * 100)}%` }}
                                      />
                                    </div>
                                    <span className="text-gray-600">{val}/{max}</span>
                                  </div>
                                );
                              })}
                              {(!usuario.items || !usuario.items.length) && (
                                <span className="text-xs italic text-gray-400">Sin items</span>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-center">
                          {editId === usuario._id ? (
                            <div className="flex items-center justify-center gap-2">
                              <Button onClick={handleUpdate} variant="success" disabled={saving}>
                                Guardar
                              </Button>
                              <Button onClick={cancelEdit} variant="ghost">
                                Cancelar
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-2">
                              <Button onClick={() => handleEdit(usuario)} variant="primary">
                                Editar
                              </Button>
                              <Button onClick={() => setPendingDelete(usuario)} variant="danger">
                                Eliminar
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Card>

      {/* Modal de confirmación de eliminación */}
      <Modal
        open={!!pendingDelete}
        title="Eliminar usuario"
        description={
          pendingDelete
            ? `¿Seguro que querés eliminar a "${pendingDelete.name}"? Esta acción no se puede deshacer.`
            : ''
        }
        onClose={() => setPendingDelete(null)}
        actions={
          <>
            <Button variant="ghost" onClick={() => setPendingDelete(null)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={() => handleDelete(pendingDelete._id)}>
              Eliminar
            </Button>
          </>
        }
      />

      {/* Edición múltiple */}
      {selectedUserIds.length > 0 && (
        <Card title={`Edición Múltiple (${selectedUserIds.length})`} subtitle="Aplicar cambios a usuarios seleccionados" right={<Button variant="ghost" onClick={() => setSelectedUserIds([])}>Limpiar selección</Button>}>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input label="Delta puntos" placeholder="Ej: 10 o -5" value={bulkDeltaPoints} onChange={e => setBulkDeltaPoints(e.target.value)} />
              <Input label="Clase" placeholder="Nueva clase" value={bulkClase} onChange={e => setBulkClase(e.target.value)} />
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-800">Añadir Item</span>
                <div className="flex gap-2">
                  <select className="rounded-lg border border-gray-300 px-3 py-2 text-sm flex-1" value={bulkAppendItem} onChange={e => setBulkAppendItem(e.target.value)}>
                    <option value="">-- Item --</option>
                    {availableItems.map(it => <option key={it._id} value={it._id}>{it.name}</option>)}
                  </select>
                  <input type="number" min={0} className="w-24 rounded-lg border border-gray-300 px-2 py-2 text-sm" value={bulkAppendItemProgress} onChange={e => setBulkAppendItemProgress(e.target.value)} />
                </div>
              </label>
            </div>
            {/* Set progress items (opcional simple) */}
            <div className="p-3 rounded-xl border border-gray-200 bg-gray-50 space-y-2">
              <div className="text-xs font-semibold text-gray-700">Setear Progreso Items (opcional)</div>
              {bulkSetProgressItems.map((it, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs">
                  <select
                    className="border rounded px-2 py-1"
                    value={it.item}
                    onChange={e => setBulkSetProgressItems(arr => arr.map((x,i)=> i===idx?{...x,item:e.target.value}:x))}
                  >
                    <option value="">-- Item --</option>
                    {availableItems.map(ai => <option key={ai._id} value={ai._id}>{ai.name}</option>)}
                  </select>
                  <input
                    type="number"
                    min={0}
                    className="w-24 border rounded px-2 py-1"
                    value={it.progress}
                    onChange={e => setBulkSetProgressItems(arr => arr.map((x,i)=> i===idx?{...x,progress:e.target.value}:x))}
                  />
                  <button
                    type="button"
                    className="px-2 py-1 rounded bg-red-500 text-white"
                    onClick={() => setBulkSetProgressItems(arr => arr.filter((_,i)=> i!==idx))}
                  >X</button>
                </div>
              ))}
              <Button type="button" variant="ghost" onClick={() => setBulkSetProgressItems(arr => [...arr,{ item:'', progress:'0'}])}>Añadir fila</Button>
            </div>
            <div className="flex gap-3">
              <Button type="button" onClick={handleBulkApply} disabled={saving || !selectedUserIds.length}>Aplicar</Button>
              <Button type="button" variant="ghost" onClick={() => { setBulkDeltaPoints(''); setBulkClase(''); setBulkAppendItem(''); setBulkAppendItemProgress('0'); setBulkSetProgressItems([]); }}>Reset</Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
