<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <form @submit.prevent="search">
      <input v-model="searchWord" type="text">
      <button type="submit">Search</button>
    </form>
    <div class="container mt-5">
      <div class="row">

        <div class="col-lg-3 d-flex align-items-stretch mb-2" v-for="item in data" :key="item.id">
          <div class="card" style="width: 18rem;">
            <img :src=item.image class="card-img-top" alt="">
            <div class="card-body">
              <h5 class="card-title">{{ item.name }}</h5>
              <p class="card-text"><strong>Sold By:</strong> {{ item.store }}</p>
              <p class="card-text"><strong>Price:</strong> {{ item.price }}</p>
              <p class="card-text"><strong>Stock:</strong>  {{ item.in_stock == 1 ? 'In Stock' : 'Out Of Stock'}}</p>
              <a :href=item.link target="_blank" class="btn btn-primary">Buy</a>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Home',

  data () {
    return {
      searchWord: '',
      data: ''
    }
  },
  async mounted () {
      const res = await this.$axios.get('getall/')
      this.data = res.data
  },
  methods: {
    async search () {
      const res = await this.$axios.get('get/' + this.searchWord)
      this.data = res.data
    }
  }
}
</script>
