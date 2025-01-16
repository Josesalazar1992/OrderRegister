const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Ruta para leer el archivo JSON
const readOrders = () => {
    const data = fs.readFileSync('orders.json', 'utf8');
    return JSON.parse(data || '[]');
};

// Ruta para escribir en el archivo JSON
const writeOrders = (data) => {
    fs.writeFileSync('orders.json', JSON.stringify(data, null, 2));
};

// Obtener todos los pedidos
app.get('/orders', (req, res) => {
    const orders = readOrders();
    res.json(orders);
});

// Crear un nuevo pedido
app.post('/orders', (req, res) => {
    const orders = readOrders();
    const newOrder = req.body;
    orders.push(newOrder);
    writeOrders(orders);
    res.json({ message: 'Pedido creado con éxito', order: newOrder });
});

// Actualizar un pedido
app.put('/orders/:id', (req, res) => {
    const orders = readOrders();
    const orderId = parseInt(req.params.id);
    const updatedOrder = req.body;

    const orderIndex = orders.findIndex((order) => order.id === orderId);
    if (orderIndex !== -1) {
        orders[orderIndex] = updatedOrder;
        writeOrders(orders);
        res.json({ message: 'Pedido actualizado', order: updatedOrder });
    } else {
        res.status(404).json({ message: 'Pedido no encontrado' });
    }
});

// Eliminar un pedido
app.delete('/orders/:id', (req, res) => {
    const orders = readOrders();
    const orderId = parseInt(req.params.id);

    const filteredOrders = orders.filter((order) => order.id !== orderId);
    writeOrders(filteredOrders);
    res.json({ message: 'Pedido eliminado' });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
