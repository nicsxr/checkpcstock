<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <form @submit.prevent="search">
      <input v-model="searchWord" type="text">
      <button type="submit">Search</button>
    </form>

    <div>
      <b-modal ref="sub-modal" id="subscribe-modal" hide-footer title="Subscribe to item">
      <div class="d-block text-center">
        <p>{{selectedItem.name}}</p>
        <p>{{selectedItem.store}}</p>
        <p>${{selectedItem.price}}</p>
        <form @submit.prevent="subscribe">
          <b-form-input v-model="email" placeholder="Enter your email"></b-form-input>
          <b-button class="my-4" type="submit" variant="success">Subscribe</b-button>
        </form>
      </div>
        
      </b-modal>
    </div>

    <div class="m-5">
      <div class="row">
        <div class="col-md-3 mb-2" v-for="item in data" :key="item.id">
          <div class="card h-100" style="width: 18rem;">
            <img :src=item.image class="card-img-top" alt="">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">{{ item.name }}</h5>
              <hr>
              <p class="card-text"><strong>Sold By:</strong> {{ item.store }}</p>
              <p class="card-text"><strong>Price:</strong> {{ item.price }}</p>
              <p class="card-text"><strong>Stock:</strong>  {{ item.in_stock == 1 ? 'In Stock' : 'Out Of Stock'}}</p>

              <div class="mt-auto">
                <a :href=item.link target="_blank" class="btn btn-primary mt-auto w-50">Buy</a>
                <a class="btn btn-danger w-50" v-b-modal.subscribe-modal @click="selectItem(item)">Subscribe</a>
              </div>

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
      data: '',
      selectedItem: '',
      email: ''
    }
  },
  async mounted () {
      const res = await this.$axios.get('getall/')
      this.data = res.data
  },
  methods: {
    async search () {
      const res = await this.$axios.get('get/all/' + this.searchWord)
      this.data = res.data
    },
    selectItem(item){
      this.selectedItem = item
    },
    subscribe(){
      this.$axios.post('subscribe', {
        'email': this.email,
        'item': this.selectedItem.id
      }).then(res => {
        console.log(res)
        this.$refs['sub-modal'].hide()
      }).catch(err => {
        console.log(err)
      })
    },
  }
}
</script>
