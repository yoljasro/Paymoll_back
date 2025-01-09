const { Orders } = require('../Order/order.entity');
const TelegramBot = require('node-telegram-bot-api');

const telegramToken = '8157570693:AAGgUIBA55U91Pi4sIuHN94gTlv2TV5nEUg'; // Измените токен Telegram бота
const chatIds = ['1847596793', '5036056844', '7405917966', '7535664010', '984663162']; // Введите правильные chat ID
const bot = new TelegramBot(telegramToken, { polling: false });

// Создание нового заказа
const createOrder = async (req, res) => {
  try {
    // 1. Buyurtma ma'lumotlarini req.body'dan olish
    const { products, deliveryType, address, totalPrice } = req.body;

    // 2. Yangi buyurtma obyektini yaratish va saqlash
    const newOrder = new Orders({
      products,
      deliveryType,
      address,
      totalPrice,
      paymentStatus: 'Принял',    
      orderStatus: 'Принял',
    });
    await newOrder.save();

    // 3. Telegramga xabar yuborish
    const message = `
      Новый заказ создан:
      ID заказа: ${newOrder._id}
      Продукты: ${newOrder.products.map(product => `${product.productName} (x${product.quantity})`).join(', ')}
      Тип доставки: ${newOrder.deliveryType}
      Адрес: ${newOrder.address}
      Общая сумма: ${newOrder.totalPrice} сум
      Статус оплаты: ${newOrder.paymentStatus}
      Статус заказа: ${newOrder.orderStatus}
    `;
    
    // Xabarni barcha chat ID'ga yuborish
    for (const chatId of chatIds) {
      try {
        await bot.sendMessage(chatId, message);
      } catch (error) {
        console.error(`Ошибка при отправке сообщения для chat ID ${chatId}:`, error);
      }
    }

    // 4. Click orqali to'lov sahifasining URL-manzilini yaratish
    const paymentUrl = `https://my.click.uz/payment/${newOrder.id}`;

    // 5. Buyurtma ma'lumotlarini va to'lov sahifasi URL'ini qaytarish
    res.status(201).json({ order: newOrder, paymentUrl });

  } catch (error) {
    // Xatolik yuz bersa, xabarni JSON formatida qaytarish
    res.status(500).json({ message: error.message });
  }
};

// Получение всех заказов
const getAllOrders = async (req, res) => {  
  try {
    const orders = await Orders.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Получение определенного заказа
const getOrderById = async (req, res) => {
  try {
    const order = await Orders.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Заказ не найден' });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Обновление заказа (обновление статуса оплаты)
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedOrder = await Orders.findByIdAndUpdate(id, { paymentStatus: status }, { new: true });
    if (!updatedOrder) return res.status(404).json({ message: 'Заказ не найден' });

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Обновление статуса заказа (orderStatus)
const updateOrderStatusByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    const updatedOrder = await Orders.findByIdAndUpdate(id, { orderStatus }, { new: true });
    if (!updatedOrder) return res.status(404).json({ message: 'Заказ не найден' });

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Полное обновление заказа
const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { products, deliveryType, address, totalPrice, paymentStatus, orderStatus } = req.body;

    const updatedOrder = await Orders.findByIdAndUpdate(id, {
      products,
      deliveryType,
      address,
      totalPrice,
      paymentStatus,
      orderStatus,
    }, { new: true }).populate('products.productId');
    
    if (!updatedOrder) return res.status(404).json({ message: 'Заказ не найден' });

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Удаление заказа
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrder = await Orders.findByIdAndDelete(id);
    if (!deletedOrder) return res.status(404).json({ message: 'Заказ не найден' });

    res.status(200).json({ message: 'Заказ успешно удален' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  updateOrderStatusByAdmin,
  updateOrder,
  deleteOrder
};
