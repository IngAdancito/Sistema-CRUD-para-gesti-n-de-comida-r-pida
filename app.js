// ============================================================
// FastFood Manager - Sistema CRUD
// Persistencia: localStorage
// ============================================================

const DB_KEYS = { productos: 'ff_productos', clientes: 'ff_clientes' };

const db = {
  load(key) {
    try { return JSON.parse(localStorage.getItem(key)) || []; }
    catch { return []; }
  },
  save(key, data) { localStorage.setItem(key, JSON.stringify(data)); },
  nextId(arr) { return arr.length ? Math.max(...arr.map(x => x.id)) + 1 : 1; }
};

let productos = db.load(DB_KEYS.productos);
let clientes  = db.load(DB_KEYS.clientes);

// ===== UTILIDADES =====
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);
const fmt = (n) => '$' + Number(n).toFixed(2);

function toast(msg, type = '') {
  const t = $('#toast');
  t.textContent = msg;
  t.className = 'toast show ' + type;
  setTimeout(() => t.className = 'toast', 2500);
}

// ===== TABS =====
$$('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    $$('.tab-btn').forEach(b => b.classList.remove('active'));
    $$('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    $('#' + btn.dataset.tab).classList.add('active');
  });
});

// ===== MODAL HELPERS =====
function openModal(id) { $('#' + id).classList.add('show'); }
function closeModal(id) { $('#' + id).classList.remove('show'); }

document.addEventListener('click', (e) => {
  if (e.target.matches('[data-close]')) {
    e.target.closest('.modal').classList.remove('show');
  }
  if (e.target.classList.contains('modal')) {
    e.target.classList.remove('show');
  }
});

// ============================================================
// PRODUCTOS - CRUD
// ============================================================
function renderProductos() {
  const filtroNombre = $('#buscar-producto').value.toLowerCase();
  const filtroCat = $('#filtro-categoria').value;
  const tbody = $('#tabla-productos');

  const lista = productos.filter(p =>
    p.nombre.toLowerCase().includes(filtroNombre) &&
    (!filtroCat || p.categoria === filtroCat)
  );

  if (!lista.length) {
    tbody.innerHTML = '<tr><td colspan="7" class="empty">No hay productos registrados</td></tr>';
    return;
  }

  tbody.innerHTML = lista.map(p => `
    <tr>
      <td>${p.id}</td>
      <td><strong>${p.nombre}</strong></td>
      <td>${p.categoria}</td>
      <td>${fmt(p.precio)}</td>
      <td>${p.stock}</td>
      <td>${p.descripcion || '-'}</td>
      <td class="actions-cell">
        <button class="btn btn-sm btn-secondary" onclick="editarProducto(${p.id})">Editar</button>
        <button class="btn btn-sm btn-danger" onclick="eliminarProducto(${p.id})">Borrar</button>
      </td>
    </tr>
  `).join('');
}

$('#btn-nuevo-producto').addEventListener('click', () => {
  $('#form-producto').reset();
  $('#producto-id').value = '';
  $('#titulo-modal-producto').textContent = 'Nuevo Producto';
  openModal('modal-producto');
});

window.editarProducto = function(id) {
  const p = productos.find(x => x.id === id);
  if (!p) return;
  $('#producto-id').value = p.id;
  $('#producto-nombre').value = p.nombre;
  $('#producto-categoria').value = p.categoria;
  $('#producto-precio').value = p.precio;
  $('#producto-stock').value = p.stock;
  $('#producto-descripcion').value = p.descripcion || '';
  $('#titulo-modal-producto').textContent = 'Editar Producto';
  openModal('modal-producto');
};

window.eliminarProducto = function(id) {
  if (!confirm('¿Eliminar este producto?')) return;
  productos = productos.filter(p => p.id !== id);
  db.save(DB_KEYS.productos, productos);
  renderProductos();
  toast('Producto eliminado', 'success');
};

$('#form-producto').addEventListener('submit', (e) => {
  e.preventDefault();
  const id = $('#producto-id').value;
  const data = {
    nombre: $('#producto-nombre').value.trim(),
    categoria: $('#producto-categoria').value,
    precio: parseFloat($('#producto-precio').value),
    stock: parseInt($('#producto-stock').value, 10),
    descripcion: $('#producto-descripcion').value.trim()
  };

  if (id) {
    const idx = productos.findIndex(p => p.id === parseInt(id, 10));
    productos[idx] = { ...productos[idx], ...data };
    toast('Producto actualizado', 'success');
  } else {
    productos.push({ id: db.nextId(productos), ...data });
    toast('Producto creado', 'success');
  }

  db.save(DB_KEYS.productos, productos);
  closeModal('modal-producto');
  renderProductos();
});

$('#buscar-producto').addEventListener('input', renderProductos);
$('#filtro-categoria').addEventListener('change', renderProductos);

// ============================================================
// CLIENTES - CRUD
// ============================================================
function renderClientes() {
  const filtro = $('#buscar-cliente').value.toLowerCase();
  const tbody = $('#tabla-clientes');

  const lista = clientes.filter(c =>
    c.nombre.toLowerCase().includes(filtro) ||
    c.telefono.includes(filtro)
  );

  if (!lista.length) {
    tbody.innerHTML = '<tr><td colspan="6" class="empty">No hay clientes registrados</td></tr>';
    return;
  }

  tbody.innerHTML = lista.map(c => `
    <tr>
      <td>${c.id}</td>
      <td><strong>${c.nombre}</strong></td>
      <td>${c.telefono}</td>
      <td>${c.direccion}</td>
      <td>${c.email || '-'}</td>
      <td class="actions-cell">
        <button class="btn btn-sm btn-secondary" onclick="editarCliente(${c.id})">Editar</button>
        <button class="btn btn-sm btn-danger" onclick="eliminarCliente(${c.id})">Borrar</button>
      </td>
    </tr>
  `).join('');
}

$('#btn-nuevo-cliente').addEventListener('click', () => {
  $('#form-cliente').reset();
  $('#cliente-id').value = '';
  $('#titulo-modal-cliente').textContent = 'Nuevo Cliente';
  openModal('modal-cliente');
});

window.editarCliente = function(id) {
  const c = clientes.find(x => x.id === id);
  if (!c) return;
  $('#cliente-id').value = c.id;
  $('#cliente-nombre').value = c.nombre;
  $('#cliente-telefono').value = c.telefono;
  $('#cliente-direccion').value = c.direccion;
  $('#cliente-email').value = c.email || '';
  $('#titulo-modal-cliente').textContent = 'Editar Cliente';
  openModal('modal-cliente');
};

window.eliminarCliente = function(id) {
  if (!confirm('¿Eliminar este cliente?')) return;
  clientes = clientes.filter(c => c.id !== id);
  db.save(DB_KEYS.clientes, clientes);
  renderClientes();
  toast('Cliente eliminado', 'success');
};

$('#form-cliente').addEventListener('submit', (e) => {
  e.preventDefault();
  const id = $('#cliente-id').value;
  const data = {
    nombre: $('#cliente-nombre').value.trim(),
    telefono: $('#cliente-telefono').value.trim(),
    direccion: $('#cliente-direccion').value.trim(),
    email: $('#cliente-email').value.trim()
  };

  if (id) {
    const idx = clientes.findIndex(c => c.id === parseInt(id, 10));
    clientes[idx] = { ...clientes[idx], ...data };
    toast('Cliente actualizado', 'success');
  } else {
    clientes.push({ id: db.nextId(clientes), ...data });
    toast('Cliente creado', 'success');
  }

  db.save(DB_KEYS.clientes, clientes);
  closeModal('modal-cliente');
  renderClientes();
});

$('#buscar-cliente').addEventListener('input', renderClientes);

// ============================================================
// INIT
// ============================================================
renderProductos();
renderClientes();
