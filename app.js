// ============================================================
// FastFood Manager - Sistema CRUD
// Persistencia: localStorage
// ============================================================

const DB_KEYS = { productos: 'ff_productos' };

const db = {
  load(key) {
    try { return JSON.parse(localStorage.getItem(key)) || []; }
    catch { return []; }
  },
  save(key, data) { localStorage.setItem(key, JSON.stringify(data)); },
  nextId(arr) { return arr.length ? Math.max(...arr.map(x => x.id)) + 1 : 1; }
};

let productos = db.load(DB_KEYS.productos);

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
// INIT
// ============================================================
renderProductos();
