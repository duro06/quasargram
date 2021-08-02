<template>
  <q-page class="constrain q-pa-md">
    <q-card
      v-for="(post, index) in posts"
      :key="index"
      class="card-post q-mb-md"
      flat
      bordered
    >
      <q-item>
        <q-item-section avatar>
          <q-avatar>
            <img src="image/aku.jpg" />
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label class="text-bold">Andi Dermawan</q-item-label>
          <q-item-label caption> {{ post.location }} </q-item-label>
        </q-item-section>
      </q-item>

      <q-separator />
      <q-img :src="post.image" />
      <q-card-section>
        <div>{{ post.caption }}</div>
        <div class="text-caption text-grey">{{ post.date }}</div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
const pots = [
  {
    id: 1,
    caption: 'apem',
    date: 1627892570837,
    location: 'Bucor Kulon',
    image: 'https://cdn.quasar.dev/img/mountains.jpg',
  },
  {
    id: 2,
    caption: 'apem',
    date: 1627892570837,
    location: 'Bucor Kulon',
    image: 'https://cdn.quasar.dev/img/mountains.jpg',
  },
  {
    id: 3,
    caption: 'apem',
    date: 1627892570837,
    location: 'Bucor Kulon',
    image: 'https://cdn.quasar.dev/img/mountains.jpg',
  },
  {
    id: 4,
    caption: 'apem',
    date: 1627892570837,
    location: 'Bucor Kulon',
    image: 'https://cdn.quasar.dev/img/mountains.jpg',
  },
]
import { defineComponent, reactive, toRefs, onMounted } from 'vue'

export default defineComponent({
  name: 'PageHome',
  setup() {
    let state = reactive({
      posts: [],
    })
    onMounted(() => {
      state.posts = pots
    })
    return { ...toRefs(state) }
  },
})
</script>
<style lang="sass">
.card-post
  .q-img
    min-height: 200px
</style>
