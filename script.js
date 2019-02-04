// async function fetchData(url) {
//   let response = await fetch(url);
//   let data = await response.json()
//   return data.books
// }

// fetchData('books.json').then(books => {
//   books.array.forEach(element => {

//   });
// })
Vue.component('header-component', {
  template: `
  <div>
    <div id="header-component">
      <h1>Books</h1>
    </div>
  </div>
  `,
  methods: {

  }
})

Vue.component('book-list', {
  props: {},
  template: `
    <div>
      <div id="filter">
        <div class="filter-flex">
          <label for="sort">Sort by:</label>
          <select name="sort" id="sort" v-model="sorting.sortBy">
            <option selected="selected">Sorting method</option>
            <option v-for="method in sortingMethods" :value="method">{{ method }}</option>
          </select>
          <button v-if="sorting.sortBy === 'None'" disabled="disabled">{{ sorting.sortOrder }}</button>
          <button v-else @click="changeSortingOrder()">{{ sorting.sortOrder }}</button>
          <label for="lengthFilterMin">Min. length:</label>
          <input name="lengthFilterMin" type="number" v-model="filter.length.minLength">
          <label for="lengthFilterMax">Max. length:</label>
          <input name="lengthFilterMax" type="number" v-model="filter.length.maxLength">
        </div>
        <div>
          <label for="dateFilterMin">Min. date:</label>
          <input name="dateFilterMin" type="number" v-model="filter.date.minDate">
          <label for="dateFilterMax">Max. date</label>
          <input name="dateFilterMax" type="number" v-model="filter.date.maxDate">
        </div>
      </div>
      <div class="box bg-green">
      <p>{{results}} results</p>
      </div>
      <div v-for="book in sortedbooks" :key="book.id" class="box bg-gray">
        <h2>{{ book.title }}</h2>
        <p class="author"> by {{ book.author }}</p>
        <p>{{ book.subtitle }} </p>
        <p>{{ book.description }}</p>
        <p><strong>Length:</strong> {{ book.pages }} pages</p>
        <p><strong>Publisher:</strong> {{ book.publisher }}</p>
        <p><strong>Date:</strong> {{ getDateString(book.published) }} </p>
      </div>
    </div>
  `,
  data() {
    return {
      books: [],
      sortedbooks: [],
      sortingMethods: ['Title', 'Author', 'Length', 'Date'],
      sorting: {
        sortBy: 'None',
        sortOrder: 'Ascending'
      },
      filter: {
        date: {
          minDate: 2011,
          maxDate: 2017
        },
        length: {
          minLength: 200,
          maxLength: 600
        }
      }
    }
  },
  methods: {

    async fetchBooks() {
      let response = await fetch('books.json');
      await response.json().then(data => this.books = data.books)
      this.sortedbooks = this.books
    },
    getDateString(dString) {
      let returnDate = new Date(dString)
      // return `${returnDate.getFullYear()}-${returnDate.getMonth() + 1}-${returnDate.getDate()}`
      return returnDate.toDateString()
    },
    sortArray(method, direction) {

      // TITLE
      if (method === this.sortingMethods[0]) {
        this.sortedbooks.sort(function (a, b) {
          let nameA = a.title.toUpperCase()
          let nameB = b.title.toUpperCase()
          if (direction === 'Descending') {
            let placeholder = nameA
            nameA = nameB
            nameB = placeholder
          }
          if (nameA < nameB) {
            return -1
          }
          if (nameA > nameB) {
            return 1
          }
          return 0
        })
      }

      //AUTHOR
      if (method === this.sortingMethods[1]) {
        this.sortedbooks.sort(function (a, b) {
          let nameA = a.author.toUpperCase()
          let nameB = b.author.toUpperCase()
          if (direction === 'Descending') {
            let placeholder = nameA
            nameA = nameB
            nameB = placeholder
          }
          if (nameA < nameB) {
            return -1
          }
          if (nameA > nameB) {
            return 1
          }
          return 0
        })
      }

      // LENGTH
      if (method === this.sortingMethods[2]) {
        this.sortedbooks.sort(function (a, b) {
          if (direction === 'Descending') {
            return b.pages - a.pages
          }
          return a.pages - b.pages
        })
      }

      // DATE
      if (method === this.sortingMethods[3]) {
        this.sortedbooks.sort(function (a, b) {
          dateA = Date.parse(a.published)
          dateB = Date.parse(b.published)
          if (direction === 'Descending') {
            return dateB - dateA
          }
          return dateA - dateB
        })
      }


    },
    changeSortingOrder() {
      if (this.sorting.sortOrder === 'Ascending') {
        this.sorting.sortOrder = 'Descending'
      } else {
        this.sorting.sortOrder = 'Ascending'
      }
    }
  },
  computed: {
    results() {
      return this.sortedbooks.length
    }
  },
  mounted() {
    this.fetchBooks()
  },
  watch: {
    sorting: {
      handler: function () {b
        this.sortArray(this.sorting.sortBy, this.sorting.sortOrder)
      },
      deep: true
    },
    filter: {
      handler: function () {
        this.sortedbooks = this.books.filter(book => {
          let bookDate = new Date(book.published)
          return book.pages > this.filter.length.minLength && book.pages < this.filter.length.maxLength && Date.parse(book.published) && bookDate.getFullYear() > this.filter.date.minDate && bookDate.getFullYear() < this.filter.date.maxDate
        })
      },
      deep: true
    }
  }
})
var app = new Vue({
  el: '#app',
  data: {},
  methods: {},
})