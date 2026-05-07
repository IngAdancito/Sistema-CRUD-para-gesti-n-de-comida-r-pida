// ============================================================
// FastFood Manager - Sistema CRUD
// Persistencia: localStorage
// ============================================================

const DB_KEYS = { productos: 'ff_productos', clientes: 'ff_clientes', pedidos: 'ff_pedidos' };

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
let pedidos   = db.load(DB_KEYS.pedidos);
let pedidoItemsTemp = [];

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

function escapeHtml(s) {
  if (s == null) return '';
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
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
      <td><strong>${escapeHtml(p.nombre)}</strong></td>
      <td>${escapeHtml(p.categoria)}</td>
      <td>${fmt(p.precio)}</td>
      <td>${p.stock}</td>
      <td>${escapeHtml(p.descripcion || '-')}</td>
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
      <td><strong>${escapeHtml(c.nombre)}</strong></td>
      <td>${escapeHtml(c.telefono)}</td>
      <td>${escapeHtml(c.direccion)}</td>
      <td>${escapeHtml(c.email || '-')}</td>
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
// PEDIDOS - CRUD
// ============================================================
function renderPedidos() {
  const filtro = $('#buscar-pedido').value.toLowerCase();
  const filtroEstado = $('#filtro-estado').value;
  const tbody = $('#tabla-pedidos');

  const lista = pedidos.filter(p => {
    const cli = clientes.find(c => c.id === p.clienteId);
    const nombreCli = cli ? cli.nombre.toLowerCase() : '';
    return nombreCli.includes(filtro) && (!filtroEstado || p.estado === filtroEstado);
  });

  if (!lista.length) {
    tbody.innerHTML = '<tr><td colspan="7" class="empty">No hay pedidos registrados</td></tr>';
    return;
  }

  tbody.innerHTML = lista.map(p => {
    const cli = clientes.find(c => c.id === p.clienteId);
    const itemsTxt = p.items.map(i => `${i.cantidad}× ${escapeHtml(i.nombre)}`).join(', ');
    const badgeClass = 'badge-' + p.estado.replace(/\s/g, '');
    return `
      <tr>
        <td>#${p.id}</td>
        <td>${cli ? escapeHtml(cli.nombre) : '<em>cliente eliminado</em>'}</td>
        <td>${itemsTxt}</td>
        <td><strong>${fmt(p.total)}</strong></td>
        <td><span class="badge ${badgeClass}">${escapeHtml(p.estado)}</span></td>
        <td>${p.fecha}</td>
        <td class="actions-cell">
          <button class="btn btn-sm btn-secondary" onclick="editarPedido(${p.id})">Editar</button>
          <button class="btn btn-sm btn-danger" onclick="eliminarPedido(${p.id})">Borrar</button>
        </td>
      </tr>
    `;
  }).join('');
}

function poblarSelectsPedido() {
  const selCli = $('#pedido-cliente');
  selCli.innerHTML = '<option value="">Seleccione cliente...</option>' +
    clientes.map(c => `<option value="${c.id}">${escapeHtml(c.nombre)}</option>`).join('');

  const selProd = $('#pedido-producto-select');
  selProd.innerHTML = '<option value="">Seleccione producto...</option>' +
    productos.map(p => `<option value="${p.id}">${escapeHtml(p.nombre)} - ${fmt(p.precio)}</option>`).join('');
}

function renderItemsPedido() {
  const tbody = $('#pedido-items');
  if (!pedidoItemsTemp.length) {
    tbody.innerHTML = '<tr><td colspan="5" class="empty">Sin productos agregados</td></tr>';
    $('#pedido-total').textContent = fmt(0);
    return;
  }
  tbody.innerHTML = pedidoItemsTemp.map((item, i) => `
    <tr>
      <td>${escapeHtml(item.nombre)}</td>
      <td>${item.cantidad}</td>
      <td>${fmt(item.precio)}</td>
      <td>${fmt(item.precio * item.cantidad)}</td>
      <td><button type="button" class="btn btn-sm btn-danger" onclick="quitarItemPedido(${i})">×</button></td>
    </tr>
  `).join('');
  const total = pedidoItemsTemp.reduce((s, i) => s + i.precio * i.cantidad, 0);
  $('#pedido-total').textContent = fmt(total);
}

window.quitarItemPedido = function(idx) {
  pedidoItemsTemp.splice(idx, 1);
  renderItemsPedido();
};

$('#btn-agregar-item').addEventListener('click', () => {
  const prodId = parseInt($('#pedido-producto-select').value, 10);
  const cantidad = parseInt($('#pedido-cantidad').value, 10);
  if (!prodId || !cantidad || cantidad < 1) {
    toast('Seleccione un producto y cantidad válida', 'error');
    return;
  }
  const prod = productos.find(p => p.id === prodId);
  const existente = pedidoItemsTemp.find(i => i.productoId === prodId);
  if (existente) {
    existente.cantidad += cantidad;
  } else {
    pedidoItemsTemp.push({
      productoId: prod.id,
      nombre: prod.nombre,
      precio: prod.precio,
      cantidad
    });
  }
  $('#pedido-cantidad').value = 1;
  renderItemsPedido();
});

$('#btn-nuevo-pedido').addEventListener('click', () => {
  if (!clientes.length) { toast('Primero registra al menos un cliente', 'error'); return; }
  if (!productos.length) { toast('Primero registra al menos un producto', 'error'); return; }
  $('#form-pedido').reset();
  $('#pedido-id').value = '';
  pedidoItemsTemp = [];
  poblarSelectsPedido();
  renderItemsPedido();
  $('#titulo-modal-pedido').textContent = 'Nuevo Pedido';
  openModal('modal-pedido');
});

window.editarPedido = function(id) {
  const p = pedidos.find(x => x.id === id);
  if (!p) return;
  poblarSelectsPedido();
  $('#pedido-id').value = p.id;
  $('#pedido-cliente').value = p.clienteId;
  $('#pedido-estado').value = p.estado;
  pedidoItemsTemp = p.items.map(i => ({ ...i }));
  renderItemsPedido();
  $('#titulo-modal-pedido').textContent = 'Editar Pedido #' + p.id;
  openModal('modal-pedido');
};

window.eliminarPedido = function(id) {
  if (!confirm('¿Eliminar este pedido?')) return;
  pedidos = pedidos.filter(p => p.id !== id);
  db.save(DB_KEYS.pedidos, pedidos);
  renderPedidos();
  toast('Pedido eliminado', 'success');
};

$('#form-pedido').addEventListener('submit', (e) => {
  e.preventDefault();
  if (!pedidoItemsTemp.length) {
    toast('Agregue al menos un producto', 'error');
    return;
  }
  const id = $('#pedido-id').value;
  const total = pedidoItemsTemp.reduce((s, i) => s + i.precio * i.cantidad, 0);
  const data = {
    clienteId: parseInt($('#pedido-cliente').value, 10),
    items: pedidoItemsTemp.map(i => ({ ...i })),
    total,
    estado: $('#pedido-estado').value,
    fecha: new Date().toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })
  };

  if (id) {
    const idx = pedidos.findIndex(p => p.id === parseInt(id, 10));
    pedidos[idx] = { ...pedidos[idx], ...data };
    toast('Pedido actualizado', 'success');
  } else {
    pedidos.push({ id: db.nextId(pedidos), ...data });
    toast('Pedido creado', 'success');
  }

  db.save(DB_KEYS.pedidos, pedidos);
  closeModal('modal-pedido');
  renderPedidos();
});

$('#buscar-pedido').addEventListener('input', renderPedidos);
$('#filtro-estado').addEventListener('change', renderPedidos);

// ============================================================
// INIT
// ============================================================
renderProductos();
renderClientes();
renderPedidos();
