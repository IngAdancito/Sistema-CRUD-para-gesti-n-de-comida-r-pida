'use strict';

const { test, describe } = require('node:test');
const assert = require('node:assert');
const {
  formatearPrecio,
  escapeHtml,
  nextId,
  calcularTotalPedido,
  filtrarPorCategoria
} = require('../lib/utils');

describe('formatearPrecio', () => {
  test('formatea un entero con dos decimales', () => {
    assert.strictEqual(formatearPrecio(5), '$5.00');
  });

  test('formatea un decimal redondeando a dos dígitos', () => {
    assert.strictEqual(formatearPrecio(5.5), '$5.50');
  });

  test('formatea cero correctamente', () => {
    assert.strictEqual(formatearPrecio(0), '$0.00');
  });

  test('formatea valores grandes', () => {
    assert.strictEqual(formatearPrecio(1234.567), '$1234.57');
  });
});

describe('escapeHtml', () => {
  test('escapa etiquetas HTML peligrosas', () => {
    assert.strictEqual(escapeHtml('<script>alert(1)</script>'),
      '&lt;script&gt;alert(1)&lt;/script&gt;');
  });

  test('escapa comillas dobles y simples', () => {
    assert.strictEqual(escapeHtml('"hola"'), '&quot;hola&quot;');
    assert.strictEqual(escapeHtml("'mundo'"), '&#39;mundo&#39;');
  });

  test('escapa el ampersand', () => {
    assert.strictEqual(escapeHtml('Pan & queso'), 'Pan &amp; queso');
  });

  test('retorna cadena vacía para null o undefined', () => {
    assert.strictEqual(escapeHtml(null), '');
    assert.strictEqual(escapeHtml(undefined), '');
  });

  test('no modifica texto sin caracteres especiales', () => {
    assert.strictEqual(escapeHtml('Hamburguesa Clasica'), 'Hamburguesa Clasica');
  });
});

describe('nextId', () => {
  test('retorna 1 cuando el array está vacío', () => {
    assert.strictEqual(nextId([]), 1);
  });

  test('retorna el máximo id + 1', () => {
    assert.strictEqual(nextId([{ id: 1 }, { id: 5 }, { id: 3 }]), 6);
  });

  test('funciona con un solo elemento', () => {
    assert.strictEqual(nextId([{ id: 42 }]), 43);
  });
});

describe('calcularTotalPedido', () => {
  test('calcula el total para varios productos', () => {
    const items = [
      { precio: 10, cantidad: 2 },
      { precio: 5.5, cantidad: 1 }
    ];
    assert.strictEqual(calcularTotalPedido(items), 25.5);
  });

  test('retorna 0 para un pedido sin items', () => {
    assert.strictEqual(calcularTotalPedido([]), 0);
  });

  test('respeta cantidades grandes', () => {
    const items = [{ precio: 2.5, cantidad: 100 }];
    assert.strictEqual(calcularTotalPedido(items), 250);
  });
});

describe('filtrarPorCategoria', () => {
  const productos = [
    { id: 1, nombre: 'Hamburguesa', categoria: 'Hamburguesas' },
    { id: 2, nombre: 'Pizza', categoria: 'Pizzas' },
    { id: 3, nombre: 'Doble', categoria: 'Hamburguesas' }
  ];

  test('retorna todos los productos si no hay categoría', () => {
    assert.strictEqual(filtrarPorCategoria(productos, '').length, 3);
  });

  test('filtra correctamente por una categoría', () => {
    const r = filtrarPorCategoria(productos, 'Hamburguesas');
    assert.strictEqual(r.length, 2);
  });

  test('retorna array vacío si no hay coincidencias', () => {
    assert.strictEqual(filtrarPorCategoria(productos, 'Postres').length, 0);
  });
});
