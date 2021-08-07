<template>
  <q-page class="constrain q-pa-md">
    <div class="row q-col-gutter-lg">
      <div class="col-12 col-sm-8">
        <template v-if="!loadingPost && posts.length">
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
                <q-item-label class="text-bold">Duro06</q-item-label>
                <q-item-label caption> {{ post.location }} </q-item-label>
              </q-item-section>
            </q-item>

            <q-separator />
            <q-img :src="post.imageUrl" />
            <q-item-section>
              <div>{{ post.caption }}</div>
              <div class="text-caption text-grey">
                {{ $filters.niceDate(post.date) }}
              </div>
            </q-item-section>
          </q-card>
        </template>
        <template v-if="loadingPost && posts.length">
          <q-card flat bordered>
            <q-item>
              <q-item-section avatar>
                <q-skeleton size="40px" type="QAvatar" animation="fade" />
              </q-item-section>

              <q-item-section>
                <q-item-label>
                  <q-skeleton type="text" animation="fade" />
                </q-item-label>
                <q-item-label caption>
                  <q-skeleton type="text" animation="fade" />
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-skeleton height="200px" square animation="fade" />

            <q-card-section>
              <q-skeleton type="text" class="text-subtitle2" animation="fade" />
              <q-skeleton
                type="text"
                width="50%"
                class="text-subtitle2"
                animation="fade"
              />
            </q-card-section>
          </q-card>
        </template>
        <template v-if="!loadingPost && !posts.length">
          <h5 class="text-center text-grey">No Posts Yet</h5>
        </template>
      </div>
      <div class="col-4 large-screen-only">
        <q-item class="fixed">
          <q-item-section avatar>
            <q-avatar size="48px">
              <img src="image/aku.jpg" />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-bold">Duro06</q-item-label>
            <q-item-label caption> Andi Dermawan</q-item-label>
          </q-item-section>
        </q-item>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, reactive, toRefs, onMounted } from 'vue'
import axios from 'axios'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'PageHome',
  setup() {
    const $q = useQuasar()
    let loadingPost = ref(false)
    let state = reactive({
      posts: [],
    })
    onMounted(() => {
      getPosts()
      // state.posts = pots
    })
    let getPosts = () => {
      loadingPost.value = true
      axios
        .get(`${process.env.API}/posts`)
        .then((response) => {
          state.posts = response.data
          loadingPost.value = false
        })
        .catch((err) => {
          errorDialog('Dowload Post')
          loadingPost.value = false
        })
    }
    let errorDialog = (data) => {
      $q.dialog({
        title: 'Error',
        message: `Cannot ${data} `,
      })
    }

    return { ...toRefs(state), loadingPost }
  },
})
</script>
<style lang="sass">
.card-post
  .q-img
    min-height: 200px
</style>
