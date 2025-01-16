const API_URL = 'http://localhost:3000/orders';

// Referencias al DOM
const form = document.getElementById('orderForm');
const tableBody = document.querySelector('#ordersTable tbody');

// Función para cargar pedidos
const loadOrders = async () => {
  const response = await fetch(API_URL);
  const orders = await response.json();
  tableBody.innerHTML = '';
  orders.forEach((order) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${order.id}</td>
      <td>${order.clientName}</td>
      <td>${order.products.map(p => `${p.description} (x${p.quantity})`).join(', ')}</td>
      <td>${order.total}</td>
      <td>
        <button onclick="deleteOrder(${order.id})">Eliminar</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
};

// Función para agregar un pedido
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const clientName = document.getElementById('clientName').value;
  const productQuantity = parseInt(document.getElementById('productQuantity').value);
  const productDescription = document.getElementById('productDescription').value;
  const productPrice = parseFloat(document.getElementById('productPrice').value);

  const total = productQuantity * productPrice;

  const newOrder = {
    id: Date.now(),
    clientName,
    products: [{ description: productDescription, quantity: productQuantity, price: productPrice }],
    total
  };

  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newOrder)
  });

  form.reset();
  loadOrders();
});

// Función para eliminar un pedido
const deleteOrder = async (id) => {
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  loadOrders();
};

// Inicializa la carga de pedidos
loadOrders();
