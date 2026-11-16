

// 1. Початковий масив бажань
const wishes = [
  { id: 1, title: 'Бездротові навушники', price: 2500, priority: 'високий' },
  { id: 2, title: 'Механічна клавіатура', price: 3800, priority: 'середній' },
  { id: 3, title: 'Настільна лампа', price: 900, priority: 'низький' },
  { id: 4, title: 'Ігровий монітор', price: 8500, priority: 'високий' }
];

// 2. Вибір елементів DOM
const wishlistContainer = document.querySelector('#wishlist');
const totalPriceElement = document.querySelector('#total-price');
const wishForm = document.querySelector('#wish-form');
const titleInput = document.querySelector('#wish-title');
const priceInput = document.querySelector('#wish-price');
const prioritySelect = document.querySelector('#wish-priority');

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
 * Функція рендеру списку бажань у DOM
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

    const title = document.createElement('h3');
    title.textContent = wish.title;

    const price = document.createElement('p');
    price.classList.add('wish-price');
    price.textContent = `${wish.price} грн`;

    // Створюємо інтерактивний select для зміни пріоритету прямо в картці
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

    card.append(title, price, cardSelect);
    wishlistContainer.append(card);
  });

  updateSummaryTotal(items);
}


priceInput.addEventListener('input', () => {
  const val = Number(priceInput.value);
  if (priceInput.value !== '' && val < 0) {
    priceInput.setCustomValidity('Ціна товару не може бути від’ємною! Введіть число 0 або більше.');
  } else {
    priceInput.setCustomValidity(''); // Повертаємо коректний стан
  }
});


wishForm.addEventListener('submit', event => {
  // Скасовуємо стандартне перезавантаження сторінки (Крок 3)
  event.preventDefault();

  // Зчитуємо значення полів (Крок 4)
  const titleValue = titleInput.value.trim();
  const priceValue = Number(priceInput.value);
  const priorityValue = prioritySelect.value;

  // Створюємо новий об'єкт і додаємо в масив (Крок 5)
  const newWish = {
    id: Date.now(),
    title: titleValue,
    price: priceValue,
    priority: priorityValue
  };
  wishes.push(newWish);

  // Перемальовуємо список і оновлюємо підсумок (Крок 6)
  renderWishlist(wishes);

  // Очищуємо форму (Крок 7)
  wishForm.reset();
});

// ==========================================
// 5. Друга подія варіанта: делегування події change (Крок 9)
// Зміна пріоритету вже доданого елемента без повного перерендеру
// ==========================================
wishlistContainer.addEventListener('change', event => {
  // Перевіряємо, чи подія відбулася саме на селекті пріоритету в картці
  if (event.target.classList.contains('card-priority-select')) {
    const selectEl = event.target;
    const newPriority = selectEl.value;
    const cardEl = selectEl.closest('.wish-card');
    const wishId = Number(cardEl.dataset.id);

    // Оновлюємо дані в масиві
    const targetWish = wishes.find(w => w.id === wishId);
    if (targetWish) {
      targetWish.priority = newPriority;
    }

    // Оновлюємо атрибут та класи без перерендеру всього списку
    cardEl.dataset.priority = newPriority;
    cardEl.classList.toggle('priority-high', newPriority === 'високий');
    applyPriorityClass(selectEl, newPriority);
  }
});

// Первинний рендер при завантаженні сторінки
renderWishlist(wishes);