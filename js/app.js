// Перевірка підключення файлу
console.log('script.js підключено успішно!');

// 1. Масив об'єктів бажань
const wishes = [
  { title: 'Бездротові навушники', price: 2500, priority: 'високий' },
  { title: 'Механічна клавіатура', price: 3800, priority: 'середній' },
  { title: 'Настільна лампа', price: 900, priority: 'низький' },
  { title: 'Ігровий монітор', price: 8500, priority: 'високий' }
];

console.log('--- Список усіх бажань ---');
console.log(wishes);

// 2. Підрахунок загальної вартості циклом for...of
function calculateTotalPrice(wishList) {
  let totalPrice = 0;
  for (const wish of wishList) {
    totalPrice += wish.price;
  }
  return totalPrice;
}

const totalSum = calculateTotalPrice(wishes);
console.log(`Загальна вартість усіх бажань: ${totalSum} грн`);

// 3. Умовна класифікація (знаходимо високий пріоритет)
function showHighPriorityWishes(wishList) {
  console.log('--- Бажання з ВИСОКИМ пріоритетом ---');
  for (const wish of wishList) {
    if (wish.priority.toLowerCase() === 'високий') {
      console.log(`[ВАЖЛИВО] ${wish.title} — ${wish.price} грн`);
    }
  }
}

showHighPriorityWishes(wishes);

// 4. Стрілкова функція перевірки бюджету
const withinBudget = (price, budget) => price <= budget;

const userBudget = 3000;
console.log(`--- Перевірка доступності для бюджету ${userBudget} грн ---`);

for (const wish of wishes) {
  const isAffordable = withinBudget(wish.price, userBudget);
  const status = isAffordable ? 'Доступно для купівлі' : 'Перевищує бюджет';
  console.log(`${wish.title} (${wish.price} грн) -> ${status}`);
}