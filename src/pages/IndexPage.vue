<template>
  <q-page class="flex flex-center bg-secondary">


  <div class="q-pa-md">
    <div class="q-gutter-y-md" style="width: 600px">
      <q-card>
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="login" label="Connexion" />
          <q-tab name="signup" label="Inscription" />
        
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="login">
           
           <Log  :isLogin=true />
          </q-tab-panel>

          <q-tab-panel name="signup">
            
           <Log :isLogin=false />
          </q-tab-panel>

        
        </q-tab-panels>
      </q-card>

    </div>
  </div>
  </q-page>
</template>

<script setup>

import { ref, onMounted } from 'vue'
import { useUsersStore } from '../stores/UsersStore.js'
import { useRouter } from 'vue-router'
import Log from '../components/LogComponent'

const tab = ref('login')
const router = useRouter()
let storeUsers = null

const isLogin = ref('')




</script>
