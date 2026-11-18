// ==========================================
// Практична робота №9: Клієнт для відомого API (fetch / async-await)
// Варіант 7: Список бажань (wishlist)
// ==========================================

// Константа з URL публічного API (Крок 3)
const API_URL = 'https://jsonplaceholder.typicode.com/todos?userId=2';

// Масив бажань (буде заповнюватися даними з API та форми)
let wishes = [];

// Вибір елементів DOM
const wishlistContainer = document.querySelector('#wishlist');
const totalPriceElement = document.querySelector('#total-price');
const wishForm = document.querySelector('#wish-form');
const titleInput = document.querySelector('#wish-title');
const priceInput = document.querySelector('#wish-price');
const prioritySelect = document.querySelector('#wish-priority');
const reloadBtn = document.querySelector('#reload-btn');
const statusBox = document.querySelector('#api-status');

/**
 * Керування станом завантаження (Крок 7)
 */
function setLoadingState(isLoading) {
  reloadBtn.disabled = isLoading;
  if (isLoading) {
    statusBox.className = 'status-message status-loading';
    statusBox.textContent = '⏳ Завантаження списку бажань із сервера...';
  } else if (statusBox.classList.contains('status-loading')) {
    statusBox.className = 'status-message';
    statusBox.textContent = '';
  }
}

/**
 * Відображення повідомлення про помилку користувачу (Крок 8)
 */
function showErrorMessage(message) {
  statusBox.className = 'status-message status-error';
  statusBox.textContent = `⚠️ ${message}`;
}

/**
 * Допоміжна функція для оновлення класу кольору пріоритету
 */
function applyPriorityClass(element, priorityValue) {
  element.classList.remove('priority-high', 'priority-medium', 'priority-low');
  if (priorityValue === 'високий') {
    element.classList.add('priority-high');
  } else if (priorityValue === 'середній') {
    element.classList.add('priority-medium');
  } else {
    element.classList.add('priority-low');
  }
}

/**
 * Функція підрахунку та оновлення підсумкової суми
 */
function updateSummaryTotal(items) {
  let totalSum = 0;
  for (const item of items) {
    totalSum += item.price;
  }
  totalPriceElement.textContent = `${totalSum} грн`;
}

/**
 * Функція рендеру списку бажань у DOM (Крок 6)
 */
function renderWishlist(items) {
  wishlistContainer.innerHTML = '';

  items.forEach(wish => {
    const card = document.createElement('article');
    card.classList.add('wish-card');
    card.dataset.id = wish.id;
    card.dataset.priority = wish.priority;

    if (wish.priority === 'високий') {
      card.classList.add('priority-high');
    }
    if (wish.completed) {
      card.classList.add('is-purchased');
    }

    const title = document.createElement('h3');
    title.textContent = wish.title;

    const price = document.createElement('p');
    price.classList.add('wish-price');
    price.textContent = `${wish.price} грн`;

    // Статус з API (completed: true -> Вже придбано)
    const statusBadge = document.createElement('span');
    statusBadge.classList.add('purchased-badge');
    statusBadge.textContent = wish.completed ? '✅ Вже придбано' : '🛒 У планах';

    // Селект для зміни пріоритету
    const cardSelect = document.createElement('select');
    cardSelect.classList.add('card-priority-select');
    applyPriorityClass(cardSelect, wish.priority);

    const options = [
      { value: 'високий', label: 'Пріоритет: Високий' },
      { value: 'середній', label: 'Пріоритет: Середній' },
      { value: 'низький', label: 'Пріоритет: Низький' }
    ];

    options.forEach(opt => {
      const optionEl = document.createElement('option');
      optionEl.value = opt.value;
      optionEl.textContent = opt.label;
      if (opt.value === wish.priority) {
        optionEl.selected = true;
      }
      cardSelect.append(optionEl);
    });

    card.append(title, price, statusBadge, cardSelect);
    wishlistContainer.append(card);
  });

  updateSummaryTotal(items);
}

/**
 * Асинхронна функція завантаження даних із зовнішнього API
 * Використовується API: https://jsonplaceholder.typicode.com/todos?userId=2 (Кроки 2-8, 11)
 */
async function loadWishesFromAPI() {
  setLoadingState(true);

  try {
    // Виконуємо HTTP GET-запит через fetch
    const response = await fetch(API_URL);

    // Перевіряємо HTTP-статус (Крок 4)
    if (!response.ok) {
      throw new Error(`Помилка HTTP: сервер повернув статус ${response.status}`);
    }

    // Розбираємо JSON-відповідь (Крок 5)
    const apiData = await response.json();
    console.log('Отримані дані з JSONPlaceholder API:', apiData);

    // Адаптуємо перші 6 записів під структуру нашого застосунку (Крок 6)
    wishes = apiData.slice(0, 6).map((item, index) => ({
      id: item.id,
      title: item.title.charAt(0).toUpperCase() + item.title.slice(1), // З великої літери
      price: (index + 1) * 650, // Генеруємо реалістичну ціну для підрахунку суми
      priority: item.completed ? 'низький' : (index % 2 === 0 ? 'високий' : 'середній'),
      completed: item.completed
    }));

    // Виводимо отриманий список у DOM
    renderWishlist(wishes);

  } catch (error) {
    // Виводимо дружнє повідомлення згідно з Варіантом 7 (Крок 8)
    showErrorMessage('Список бажань недоступний офлайн');
    console.error('Деталі помилки завантаження API:', error);
  } finally {
    // Вимикаємо індикатор завантаження в будь-якому разі (Крок 7)
    setLoadingState(false);
  }
}

// ==========================================
// Обробники подій (Форма, Валідація, Делегування, Кнопка оновлення)
// ==========================================

// Валідація ціни
priceInput.addEventListener('input', () => {
  const val = Number(priceInput.value);
  if (priceInput.value !== '' && val < 0) {
    priceInput.setCustomValidity('Ціна товару не може бути від’ємною! Введіть число 0 або більше.');
  } else {
    priceInput.setCustomValidity('');
  }
});

// Додавання нового бажання через форму
wishForm.addEventListener('submit', event => {
  event.preventDefault();

  const newWish = {
    id: Date.now(),
    title: titleInput.value.trim(),
    price: Number(priceInput.value),
    priority: prioritySelect.value,
    completed: false
  };

  wishes.unshift(newWish); // Додаємо на початок списку
  renderWishlist(wishes);
  wishForm.reset();
});

// Делегування події change для пріоритету
wishlistContainer.addEventListener('change', event => {
  if (event.target.classList.contains('card-priority-select')) {
    const selectEl = event.target;
    const newPriority = selectEl.value;
    const cardEl = selectEl.closest('.wish-card');
    const wishId = Number(cardEl.dataset.id);

    const targetWish = wishes.find(w => w.id === wishId);
    if (targetWish) {
      targetWish.priority = newPriority;
    }

    cardEl.dataset.priority = newPriority;
    cardEl.classList.toggle('priority-high', newPriority === 'високий');
    applyPriorityClass(selectEl, newPriority);
  }
});

// Повторне завантаження за кліком на кнопку «Оновити з сервера» (Крок 10)
reloadBtn.addEventListener('click', () => {
  loadWishesFromAPI();
});

// Запускаємо завантаження даних при відкритті сторінки
loadWishesFromAPI();