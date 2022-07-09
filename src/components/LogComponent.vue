<template>

 <div class="q-pa-md" style="max-width: 400px">

    <q-form
      @submit.prevent="onSubmit"
      @reset="onReset"
      class="q-gutter-md"
    >


     <q-input
        filled
        v-if="!isLogin"
        type="text"
        v-model="user.firstname"
        label="Entrez votre prénom"
        lazy-rules
        :rules="[
          val => val !== null && val !== '' || 'Complétez'
        ]"
      />

       <q-input
        filled
        v-if="!isLogin"
        type="text"
        v-model="user.lastname"
        label="Entrez votre nom"
        lazy-rules
        :rules="[
          val => val !== null && val !== '' || 'Complétez'
        ]"


      />

      <q-input
        filled
        v-model="user.email"
        v-bind:label="email_message"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Complétez']"
      />

      <q-input
        filled
        type="text"
        v-model="user.password"
        :label="password_message"
    
        lazy-rules
        :rules="[
          val => val !== null && val !== '' || 'Complétez'
         
        ]"
      />

       <q-input
        filled
        v-if="!isLogin"
        type="text"
        v-model="user.confirmed"
        label="Confirmez le mot de passe"
        lazy-rules
        :rules="[
          val => val !== null && val !== '' || 'Complétez'
         
        ]"
      />



      <div>

        <q-btn type="submit" :loading="loading[0]" color="primary" 
        @click="simulateProgress(0)" 
        :disabled='!user.email && !user.password'
        style="width: 150px">
        Valider
          <template v-slot:loading>
          <q-spinner-hourglass class="on-left" />
          Chargement...
          </template>
        </q-btn>
               

        <q-btn label="Annuler" type="reset" color="primary" flat class="q-ml-sm" />
      </div>
    </q-form>

  </div>


</template>

<script setup>


import { ref, reactive, onMounted, computed } from 'vue'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword  } from 'firebase/auth'
import { firebase } from '../boot/firebase.js'
import useVuelidate from '@vuelidate/core'
import { required, email, sameAs } from '@vuelidate/validators'
import { useUsersStore } from '../stores/UsersStore.js'
import { useRouter, useRoute} from 'vue-router'
import { collection, addDoc, setDoc, doc } from 'firebase/firestore'
import { useQuasar } from 'quasar'


let usersStore = null 

const $q = useQuasar()
const router = useRouter()

const progress = ref(false)


const loading = ref([
      false])

const email_message = ( props.isLogin ? 'Entrez votre email' : 'Entrez une adresse mail')

const password_message = (props.isLogin ? 'Entrez votre mot de passe' : 'Choisissez un mot de passe')

const user = reactive({

    email: '',
    password: '',
    uid:'',
    confirmed:'',
    firstname:'',
    lastname: '',
})



const props = defineProps({

    isLogin: {
        type:Boolean,
        default : false,
        
        
    }

})




const rules_signup = computed(() => {

    return {
        firstname: { required },
        lastname : { required },
        email: { required, email },
        password: { required },
        confirmed: { required, sameAs : sameAs(user.password) }
    }
})

const v$_signup = useVuelidate(rules_signup, user)

const rules_login = computed(() => {

    return {
      
        email: { required, email },
        password: { required },
       
    }


})

const v$_login = useVuelidate(rules_login, user)


const onReset = () => {

    user.email = null
    user.password = null
    user.confirmed = null
  
}


const login = () => {

      console.log('On entre dans la fonction login')

      v$_login.value.$validate()
     

    if(v$_login.value.errors !== []){

        $q.notify({
          message: 'Les informations sont incomplètes',
          color: 'negative'
        })

        return
    }


    signInWithEmailAndPassword(firebase.auth, user.email, user.password)
        .then((userCredential) => {
        // Signed in 
          return userCredential.user;
        
      

        // ...
        })
        .then ((oldUser) => {

          usersStore.getUser(oldUser)

          console.log('Connexion réussie')
         
          router.push('/homepage')


        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log('Erreur', error)
        })


}
    


        



const signup = async() => {


          v$_login.value.$validate()
      if(!v$_signup.value.$errors !== []){

        $q.notify({

            message: 'Les informations sont incomplètes',
            color: 'negative'

        })

        return 
      }
      console.log('On entre dans la fonction signup')
      console.log(firebase.auth)
      

      createUserWithEmailAndPassword(firebase.auth, user.email, user.password)
      .then((userCredential) => {

        user.uid = userCredential.user.uid
        

      })
      .then(() => {


        let userObject = {

        uid : user.uid,
        firstname : user.firstname,
        lastname : user.lastname,
        email: user.email.toLowerCase(),
        isAdmin : false

        }
  
      usersStore.addUser(userObject)
      console.log('Nouvel utilisateur dans le state et en bdd')
      router.push('/homepage')

      



      })
      .catch((error) => {

          const errorCode = error.code;
          const errorMessage = error.message;
          return
      // ..
      });

     
   
}

const onSubmit = () => {

       
        if(props.isLogin === true ) {

            login()
            
        }else {
         
            signup()
        }
}



const simulateProgress = (number) => {
    loading.value[ number ] = true

    setTimeout(() => {
    // we're done, we reset loading state
    loading.value[ number ] = false
    }, 3000)
}



onMounted(() => {

 usersStore  = useUsersStore()

})

</script>




<style scoped>


</style>