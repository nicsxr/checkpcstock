<template>
    <div>
        <form @submit.prevent="pressed">
            <input v-model="url" type="text">
            <button type="submit">Add</button>
        </form>
        {{data}}
    </div>
</template>

<script>
export default {
    name: 'Add',
    data () {
        return {
            url: '',
            data: ''
        }
    },
    methods: {
        pressed() {
            this.$axios.post('add/', {
                'url' : this.url
            }).then(res => {
                this.data = res.data
            })
        }
    },
}
</script>