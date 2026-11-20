const API_URL = 'https://jsonplaceholder.typicode.com/todos?userId=2';

const WishItem = {
  props: {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    priority: { type: String, required: true },
    purchased: { type: Boolean, default: false }
  },
  emits: ['toggle'],
  computed: {
    priorityBadgeClass() {
      if (this.priority === 'високий') return 'priority-high';
      if (this.priority === 'середній') return 'priority-medium';
      return 'priority-low';
    }
  },
  template: `
    <article
      class="wish-card"
      :class="{
        'priority-high': priority === 'високий',
        'is-purchased': purchased
      }"
      :data-priority="priority"
    >
      <h3>{{ name }}</h3>
      <p class="wish-price">{{ price }} грн</p>

      <span class="wish-priority" :class="priorityBadgeClass">
        Пріоритет: {{ priority }}
      </span>

      <label class="purchased-checkbox-label">
        <input
          type="checkbox"
          :checked="purchased"
          @change="$emit('toggle', id)"
        >
        <span>{{ purchased ? 'Придбано' : 'Позначити як придбане' }}</span>
      </label>
    </article>
  `
};

const app = Vue.createApp({
  components: {
    WishItem
  },
  data() {
    return {
      wishes: [
        { id: 1, name: 'Бездротові навушники', price: 2500, priority: 'високий', purchased: false },
        { id: 2, name: 'Механічна клавіатура', price: 3800, priority: 'середній', purchased: false },
        { id: 3, name: 'Настільна лампа', price: 900, priority: 'низький', purchased: true },
        { id: 4, name: 'Ігровий монітор', price: 8500, priority: 'високий', purchased: false }
      ],
      newTitle: '',
      newPrice: null,
      newPriority: 'середній',
      isLoading: false,
      errorMessage: ''
    };
  },
  computed: {
    totalPrice() {
      return this.wishes.reduce((sum, item) => sum + item.price, 0);
    },
    purchasedCount() {
      return this.wishes.filter(item => item.purchased).length;
    }
  },
  methods: {
    toggleWish(id) {
      const target = this.wishes.find(item => item.id === id);
      if (target) {
        target.purchased = !target.purchased;
      }
    },
    addWish() {
      if (!this.newTitle || this.newPrice === null || this.newPrice < 0) return;

      this.wishes.unshift({
        id: Date.now(),
        name: this.newTitle,
        price: Number(this.newPrice),
        priority: this.newPriority,
        purchased: false
      });

      this.newTitle = '';
      this.newPrice = null;
      this.newPriority = 'середній';
    },
    async loadFromAPI() {
      this.isLoading = true;
      this.errorMessage = '';

      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`HTTP статус: ${response.status}`);
        }
        const data = await response.json();

        this.wishes = data.slice(0, 6).map((item, index) => ({
          id: item.id,
          name: item.title.charAt(0).toUpperCase() + item.title.slice(1),
          price: (index + 1) * 650,
          priority: item.completed ? 'низький' : (index % 2 === 0 ? 'високий' : 'середній'),
          purchased: item.completed
        }));
      } catch (error) {
        this.errorMessage = 'Список бажань недоступний офлайн';
        console.error('Помилка API:', error);
      } finally {
        this.isLoading = false;
      }
    }
  }
});

app.mount('#app');