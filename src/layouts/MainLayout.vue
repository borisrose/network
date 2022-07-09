<template>
  <q-layout view="lHh Lpr lFf">
  

       <q-header reveal elevated>
        <q-toolbar>
         
     

          <q-toolbar-title>Groupamania</q-toolbar-title>
       
         
          <q-btn  v-if="usersStore.user.email" @click="logOut" style="background: seconday; color: white" label="Déconnexion" />
      
         


        </q-toolbar>
      </q-header>

    
      

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>

import {  signOut } from "firebase/auth";
import { firebase } from "../boot/firebase.js"
import { useRouter } from "vue-router"
import { useUsersStore } from '../stores/UsersStore.js'
import { usePostsStore } from '../stores/PostsStore'


const auth = firebase.auth
const usersStore = useUsersStore()
const postsStore  = usePostsStore()
const router = useRouter()

const logOut = () => {



  signOut(auth).then(() => {

    usersStore.user = {}
    postsStore = []
    print(usersStore.user)
    router.push('/')


  }).catch((error) => {

    
    console.log('Erreur', error)


  });




}






</script>
