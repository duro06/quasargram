<template>
  <q-page class="constrain-more q-pa-md">
    <div class="camera-frame q-pa-md">
      <!-- <img class="full-width" src="https://cdn.quasar.dev/img/mountains.jpg" /> -->
      <video v-show="!imageCaptured" ref="video" class="full-width" autoplay />
      <canvas v-show="imageCaptured" ref="canvas" class="full-with" height="240" />
    </div>
    <div class="text-center q-pa-md">
      <q-btn
        v-if="hasCameraSupport"
        @click="captureImage"
        :disable="imageCaptured"
        color="grey-10"
        icon="eva-camera"
        size="lg"
        round
      />
      <q-file
        v-if="!hasCameraSupport"
        label="Choose n image"
        outlined
        accept="image/*"
        v-model="imageUpload"
        @input="captureImageFallback"
      >
        <template v-slot:prepend>
          <q-icon name="eva-attach-outline" />
        </template>
      </q-file>
    </div>
    <div class="row justify-center q-pa-md">
      <q-input v-model="caption" class="col col-sm-6" label="Caption *" dense />
    </div>
    <div class="row justify-center q-pa-md">
      <q-input
        v-model="location"
        class="col col-sm-6"
        label="Location"
        dense
        :loading="locLoading"
      >
        <template v-slot:append>
          <q-btn
            v-if="!locLoading && locationSupported"
            @click="getLocation"
            round
            dense
            flat
            icon="eva-navigation-2-outline"
          />
        </template>
      </q-input>
    </div>
    <div class="row justify-center q-mt-lg">
      <q-btn
        @click="addPost"
        :disable="!photo || !caption"
        color="primary"
        label="Post Image"
        rounded
        unelevated
      />
    </div>
    <!-- <div>
      <q-btn @click="routeTest" color="primary" label="test" rounded unelevated />
    </div> -->
  </q-page>
</template>

<script>
import { defineComponent, ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { uid, useQuasar } from 'quasar'
import axios from 'axios'
require('md-gum-polyfill')
export default defineComponent({
  name: 'PageCamera',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const $q = useQuasar()
    let id = ref(uid())
    let caption = ref('')
    let location = ref('')
    let photo = ref(null)
    let date = ref(Date.now())
    let video = ref(null)
    let canvas = ref(null)
    let imageCaptured = ref(false)
    let hasCameraSupport = ref(true)
    let imageUpload = ref(null)
    let locLoading = ref(false)
    let width = 0
    let height = 0
    let locationSupported = computed(() => {
      if ('geolocation' in navigator) return true
      return false
    })
    let initCamera = () => {
      width = video.value.getBoundingClientRect().width
      height = video.value.getBoundingClientRect().height
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          video.value.srcObject = stream
          // console.log(video.value)
        })
        .catch(() => {
          hasCameraSupport.value = false
        })
    }
    let captureImage = () => {
      canvas.value.width = video.value.getBoundingClientRect().width
      canvas.value.height = video.value.getBoundingClientRect().height
      let context = canvas.value.getContext('2d')
      context.drawImage(video.value, 0, 0, canvas.value.width, canvas.value.height)
      imageCaptured.value = true
      photo.value = dataURItoBlob(canvas.value.toDataURL())
      disableCamera()
      // console.log('video', video.value)
      // console.log('photo', photo.value)
    }
    let captureImageFallback = (apem) => {
      photo.value = apem
      canvas.value.width = width
      canvas.value.height = height
      var reader = new FileReader()
      let context = canvas.value.getContext('2d')
      reader.onload = (event) => {
        var img = new Image()
        img.onload = () => {
          // kecilin
          // canvas.value.width = img.width * 0.5
          // canvas.value.height = img.height * 0.5

          context.drawImage(img, 0, 0, canvas.value.width, canvas.value.height)
          imageCaptured.value = true
        }
        img.src = event.target.result
      }
      // reader.readAsDataURL(apem)
      reader.readAsDataURL(apem.target.files[0])
    }
    let disableCamera = () => {
      if (video.value.srcObject !== null) {
        video.value.srcObject.getVideoTracks().forEach((track) => {
          track.stop()
        })
      }
    }
    // let routeTest = () => {
    //   router.replace(route.query.redirect || { name: 'home' }, () => {})
    // }
    let addPost = () => {
      let formData = new FormData()
      formData.append('id', id.value)
      formData.append('caption', caption.value)
      formData.append('location', location.value)
      formData.append('date', date.value)
      formData.append('file', photo.value, id.value + '.png')
      $q.loading.show({ message: 'Sending Post' })
      axios
        .post(`${process.env.API}/createPost`, formData)
        .then((resp) => {
          router.replace(route.query.redirect || { name: 'home' }, () => {})
          $q.notify({
            message: 'Post Created',
            actions: [
              {
                label: 'Dismiss',
                color: 'white',
              },
            ],
          })
          $q.loading.hide()
        })
        .catch((err) => {
          $q.loading.hide()
          errorDialog('create your post')
        })
    }
    let getLocation = () => {
      locLoading.value = true
      navigator.geolocation.getCurrentPosition(
        (position) => {
          getCityAndCountry(position)
          // console.log('position', position)
        },
        (err) => {
          errorDialog('get your Position')
          locLoading.value = false
        },
        {
          timeout: 7000,
        }
      )
    }
    let getCityAndCountry = (position) => {
      let apiUrl = `https://geocode.xyz/${position.coords.latitude},${position.coords.longitude}?json=1`
      axios
        .get(apiUrl)
        .then((resp) => {
          // console.log(resp)
          locationSuccess(resp)
        })
        .catch((err) => {
          locLoading.value = false
          errorDialog('get your City name')
        })
    }
    let locationSuccess = (data) => {
      locLoading.value = false
      location.value = data.data.city
      if (data.data.state) {
        location.value += `, ${data.data.state}`
      }
      if (data.data.country) {
        location.value += `, ${data.data.country} `
      }
    }
    let errorDialog = (data) => {
      $q.dialog({
        title: 'Error',
        message: `Cannot ${data} `,
      })
    }
    onMounted(() => {
      initCamera()
      // console.log(locationSupported.value)
    })
    onBeforeUnmount(() => {
      if (hasCameraSupport) {
        disableCamera()
      }
    })
    function dataURItoBlob(dataURI) {
      // convert base64 to raw binary data held in a string
      // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
      var byteString = atob(dataURI.split(',')[1])

      // separate out the mime component
      var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

      // write the bytes of the string to an ArrayBuffer
      var ab = new ArrayBuffer(byteString.length)

      // create a view into the buffer
      var ia = new Uint8Array(ab)

      // set the bytes of the buffer to the correct values
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i)
      }

      // write the ArrayBuffer to a blob, and you're done
      var blob = new Blob([ab], { type: mimeString })
      return blob
    }

    return {
      caption,
      location,
      addPost,
      video,
      canvas,
      photo,
      imageCaptured,
      hasCameraSupport,
      locLoading,
      locationSupported,
      imageUpload,
      captureImage,
      captureImageFallback,
      getLocation,
      // routeTest,
    }
  },
})
</script>
<style lang="sass">
.camera-frame
  border: 2px solid $grey-10
  border-radius: 10px
</style>
