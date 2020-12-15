<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <form @submit.prevent="search">
      <div class="d-flex justify-content-center mt-3">
        <b-form-input class="ml-5 mr-1 w-25" v-model="searchWord" placeholder="Searchword" type="text"></b-form-input>
        <b-button variant="success" class="mr-1" style="width:10%; height:100%;" type="submit">Search &#x1f50d;</b-button>
        <b-button v-b-toggle="'collapse-2'" class="">Filters</b-button>
      </div>
        <b-collapse id="collapse-2">
          <!-- {{selectedStock}}
          {{selectedItems}}
          {{selectedStores}} -->
          <div class="d-flex justify-content-center mt-2">
            <b-card class="w-50">
              <b-container class="bv-example-row">
                <b-row>
                  <!-- STORES !-->
                  <b-col>
                    <b-form-group
                      label="Stores">
                      <b-form-checkbox v-model="selectedStores" value="Amazon">
                        Amazon
                      </b-form-checkbox>
                      <b-form-checkbox v-model="selectedStores" value="BestBuy">
                        BestBuy
                      </b-form-checkbox>
                      <b-form-checkbox v-model="selectedStores" value="NewEgg">
                        NewEgg
                      </b-form-checkbox>
                    </b-form-group>
                  </b-col>
                  <!-- NVIDIA GPUS !-->
                  <b-col>
                    <b-form-group
                      label="Nvidia GPUs">
                      <b-form-checkbox v-model="selectedItems" value="rtx 3090">
                        RTX 3090
                      </b-form-checkbox>
                      <b-form-checkbox v-model="selectedItems" value="rtx 3080">
                        RTX 3080
                      </b-form-checkbox>
                      <b-form-checkbox v-model="selectedItems" value="rtx 3070">
                        RTX 3070
                      </b-form-checkbox>
                      <b-form-checkbox v-model="selectedItems" value="rtx 3060 ti">
                        RTX 3060 Ti
                      </b-form-checkbox>
                    </b-form-group>

                  </b-col>
                  <!-- AMD GPUS !-->
                  <b-col>
                    <b-form-group
                      label="AMD GPUs">
                      <b-form-checkbox v-model="selectedItems" value="rx 6800">
                        RX 6800
                      </b-form-checkbox>
                      <b-form-checkbox v-model="selectedItems" value="rx 6800xt">
                        RX 6800XT
                      </b-form-checkbox>
                      <b-form-checkbox v-model="selectedItems" value="rx 6900xt">
                        RX 6900XT
                      </b-form-checkbox>
                    </b-form-group>
                  </b-col>
                  <!-- AMD CPUS !-->
                  <b-col>
                    <b-form-group
                      label="AMD CPUs">
                      <b-form-checkbox v-model="selectedItems" value="ryzen 3">
                        Ryzen 3
                      </b-form-checkbox>
                      <b-form-checkbox v-model="selectedItems" value="ryzen 5">
                        Ryzen 5
                      </b-form-checkbox>
                      <b-form-checkbox v-model="selectedItems" value="ryzen 7">
                        Ryzen 7
                      </b-form-checkbox>
                      <b-form-checkbox v-model="selectedItems" value="ryzen 9">
                        Ryzen 9
                      </b-form-checkbox>
                    </b-form-group>
                  </b-col>
                </b-row>
                  <b-form-checkbox switch v-model="selectedStock">
                    Only show items in stock
                  </b-form-checkbox>
              </b-container>
            </b-card>
          </div>
        </b-collapse>
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
      selectedStores: [],
      selectedItems: [],
      selectedStock: false,
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
      const res = await this.$axios.get('get/', {
        params:{
          searchWord: this.searchWord,
          items: this.selectedItems,
          stores: this.selectedStores,
          inStock: this.selectedStock
        }
      })
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
