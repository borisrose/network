<template>
  <router-view />
</template>

<script setup>

import {onAuthStateChanged } from "firebase/auth"
import { firebase } from "../src/boot/firebase.js"
import { useUsersStore } from '../src/stores/UsersStore.js'
import { useRouter } from 'vue-router'

const router = useRouter()

const auth =  firebase.auth
let storeUsers = null

onAuthStateChanged(auth, (user) => {
    storeUsers = useUsersStore()
  if (user) {
    
    storeUsers.getUser(user)

  } else {

    console.log('user is signed out')
    router.push('/')
  }
})






</script>
