
// 1. Масив даних бажань з Практичної роботи №6
const wishes = [
  { title: 'Бездротові навушники', price: 2500, priority: 'високий' },
  { title: 'Механічна клавіатура', price: 3800, priority: 'середній' },
  { title: 'Настільна лампа', price: 900, priority: 'низький' },
  { title: 'Ігровий монітор', price: 8500, priority: 'високий' }
];

// 2. Вибір елементів DOM (Крок 3)
const wishlistContainer = document.querySelector('#wishlist');
const totalPriceElement = document.querySelector('#total-price');

// 3. Демонстрація динамічного видалення статичної заглушки (Крок 2)
const staticPlaceholder = document.querySelector('.static-placeholder');
if (staticPlaceholder) {
  staticPlaceholder.remove();
}

/**
 * Функція підрахунку та оновлення підсумкової суми (Крок 9)
 * @param {Array} items - масив бажань
 */
function updateSummaryTotal(items) {
  let totalSum = 0;
  for (const item of items) {
    totalSum += item.price;
  }
  if (totalPriceElement) {
    totalPriceElement.textContent = `${totalSum} грн`;
  }
}

/**
 * Функція рендеру списку бажань у DOM (Кроки 4-8)
 * @param {Array} items - масив бажань для відображення
 */
function renderWishlist(items) {
  // Очищаємо вміст контейнера перед рендером
  wishlistContainer.innerHTML = '';

  // Перебираємо масив за допомогою forEach
  items.forEach(wish => {
    // Створюємо елемент картки <article> (Крок 5)
    const card = document.createElement('article');
    card.classList.add('wish-card');

    // Установка dataset атрибута data-priority (Крок 6)
    card.dataset.priority = wish.priority;

    // Створюємо заголовок <h3> для назви
    const title = document.createElement('h3');
    title.textContent = wish.title;

    // Створюємо параграф <p> для ціни
    const price = document.createElement('p');
    price.classList.add('wish-price');
    price.textContent = `${wish.price} грн`;

    // Створюємо бейдж <span> для пріоритету
    const priority = document.createElement('span');
    priority.classList.add('wish-priority');
    priority.textContent = `Пріоритет: ${wish.priority}`;

    // Додавання класів залежно від умов (Крок 6)
    if (wish.priority.toLowerCase() === 'високий') {
      card.classList.add('priority-high');
      priority.classList.add('priority-high');
    } else if (wish.priority.toLowerCase() === 'середній') {
      priority.classList.add('priority-medium');
    } else {
      priority.classList.add('priority-low');
    }

    // Додаємо вкладені елементи в картку
    card.append(title, price, priority);

    // Додаємо готову картку в контейнер списку (Крок 7)
    wishlistContainer.append(card);
  });

  // Оновлюємо підсумкову суму (Крок 9)
  updateSummaryTotal(items);
}

// 4. Первинний виклик функції рендеру при завантаженні сторінки (Крок 8)
renderWishlist(wishes);