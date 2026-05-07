'use strict';

function formatearPrecio(n) {
  return '$' + Number(n).toFixed(2);
}

function escapeHtml(s) {
  if (s == null) return '';
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[c]));
}

function nextId(arr) {
  return arr.length ? Math.max(...arr.map(x => x.id)) + 1 : 1;
}

function calcularTotalPedido(items) {
  return items.reduce((s, i) => s + i.precio * i.cantidad, 0);
}

function filtrarPorCategoria(productos, categoria) {
  if (!categoria) return productos;
  return productos.filter(p => p.categoria === categoria);
}

module.exports = {
  formatearPrecio,
  escapeHtml,
  nextId,
  calcularTotalPedido,
  filtrarPorCategoria
};
