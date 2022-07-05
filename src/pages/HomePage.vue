<template>
  <q-page class="flex flex-center column bg-accent">

    <div class="all_posts">

       

        <q-card class="my-card bg-secondary" flat bordered 
            v-for="post in postsStore.posts"
            v-bind:key="post.date"
            style='width: 100%; margin-top: 10px'
        >
            <q-item>
            <q-item-section avatar>
            <q-avatar>
            <img src="https://cdn.quasar.dev/img/boy-avatar.png">
            </q-avatar>
            </q-item-section>

            <q-item-section>
            <q-item-label>{{post.authorFirstname}} {{post.authorLastname}}</q-item-label>
            <q-item-label caption>
            {{post.authorEmail}}
            </q-item-label>
            </q-item-section>
            </q-item>

            <q-separator />

            <q-card-section horizontal>

                <q-card-section>
                {{ post.content }}
                </q-card-section>

                <q-separator vertical />

                <q-card-section class="col-4">
                {{post.date}}
                </q-card-section>

                

            </q-card-section>

            <q-separator />


            <q-card-section>



                <q-card class="my-card">

                    <img :src="file">

                   

                </q-card>


            </q-card-section>

            <q-card-section horizontal>


            <div class="q-pa-md q-gutter-sm">
                <q-btn 
             
                color="white" 
                text-color="black"
                @click="isToComment  = !isToComment " 
                label="Commenter" />
      

    
                <q-btn 
                v-if="usersStore.user.email === post.authorEmail"
                color="white" 
                @click="isToEdit = !isToEdit"
                text-color="black" 
                label="Modifier" />
       

           
                <q-btn 
                v-if="usersStore.user.email === post.authorEmail"
                color="white" 
                text-color="black" 
                label="Supprimer"
                @click.prevent = "deletePost(post.id)" 
                
                />
    
                <q-btn 
                flat 
                round  
                :color=" post.peopleLikingIt.filter(uid => uid === usersStore.user.uid).length === 1 ? 'green' : 'black'"
                @click='startLikeMecanism(1, post)' 
                icon="thumb_up" 
                />
                <q-btn 
                flat 
                round 
                
                icon="thumb_down" 
                :color=" post.peopleDislikingIt.filter(uid => uid === usersStore.user.uid).length === 1 ? 'red' : 'black'"
                @click='startLikeMecanism(0, post)'
                
                />
             
           
            </div>
            
         
            <!-- START OF COMMENTS CARD -->

            </q-card-section >
              <q-card
                v-if="isToComment === true"
                class="bg-secondary"
              
              >
              <form
                @submit="addComment(post)"
              >
                <div class="q-pa-md">

                     <q-input
                        filled
                        clearable
                        v-model="newComment"
                        type="textarea"
                        color="black"
                        label="Ecrivez quelque chose"

                    
                    
                    />

                </div>
                <div class="q-pa-md q-gutter-sm">
                     <q-btn type="submit" color="primary" 
                    
                    :disabled="!newComment"
                     style="width: 150px">
                    Valider
                    
                    </q-btn>
                </div>

            </form>
            </q-card>

            <!-- END OF COMMENTS CARD -->
            <!-- START OF EDIT CARD -->


              <q-card
                v-if="isToEdit === true"
                class="bg-secondary"
              
              >
              <form
                @submit="editNewPostContent(post)"
              >
                <div class="q-pa-md">

                     <q-input
                        filled
                        clearable
                        v-model="newPostContent"
                        type="textarea"
                        color="black"
                        label="Ecrivez quelque chose"

                    
                    
                    />

                </div>
                <div class="q-pa-md q-gutter-sm">
                     <q-btn type="submit" color="primary" 
                    
                    :disabled="!newPostContent"
                     style="width: 150px">
                    Valider
                    
                    </q-btn>

                     <q-btn type="submit" color="primary" 
                    
                     @click.prevent = 'getPostContentBack(post)'
                     style="width: 150px">
                    Annuler
                    
                    </q-btn>
                </div>

            </form>
            </q-card>



            <!-- END OF EDIT CARD -->

            <q-card class="bg-secondary">
                <div class="q-pa-md ">
                          <q-btn color="accent" v-if="post.isCommentsSeeable === false" @click="post.isCommentsSeeable = true" class="full-width" label="Voir les commentaires" />
                          <q-btn color="accent" v-else class="full-width" @click="post.isCommentsSeeable = false"  label="Masquer les commentaires" />
                </div>

            </q-card>
          



           
                 <div class="q-pa-md " v-if="post.isCommentsSeeable ">


                    <q-card class="my-card bg-secondary"  bordered
                    v-for="comment in post.comments"
                    v-bind:key="comment.date"

                    style='width: 100%; margin-top: 10px'
                    >

                        <q-item>
                                <q-item-section avatar>
                                    <q-avatar>
                                        <img src="https://cdn.quasar.dev/img/boy-avatar.png">
                                    </q-avatar>
                                </q-item-section>

                                <q-item-section>

                                    <q-item-label>{{comment.authorFirstname}} {{comment.authorLastname}}</q-item-label>
                                    
                                    <q-item-label caption>
                                    {{comment.authorEmail}}
                                    </q-item-label>

                                </q-item-section>
                        </q-item>

                        <q-separator />

                        <q-card-section horizontal>

                            <q-card-section>
                            {{ comment.content }}
                            </q-card-section>

                        <q-separator vertical />

                            <q-card-section class="col-4">
                            {{comment.date}}
                            </q-card-section>



                        </q-card-section>
                        <q-separator horizontal/>
                        <q-card-section>
                            <q-btn 
                            v-if="usersStore.user.email === comment.authorEmail"
                            color="white" 
                            text-color="black" 
                            label="Supprimer"
                            @click.prevent = "deleteComment(post, comment)" 
                            />
                        </q-card-section>

                     
                    </q-card>


                 </div>


          



        </q-card>
     
    
    </div>



    <!-- EDIT POST-->


    <!-- NOUVEAU POST-->

    <div class="new_post bg-secondary">
            <q-card class="my-card bg-secondary" style='width:100%; padding: 10px' flat bordered>
            <q-item>
            <q-item-section avatar>
                <q-avatar>
                <img src="https://cdn.quasar.dev/img/boy-avatar.png">
                </q-avatar>
            </q-item-section>

            <q-item-section>
                <q-item-label>{{usersStore.user.firstname}} {{usersStore.user.lastname}}</q-item-label>
                <q-item-label caption>
                {{usersStore.user.email}}
                </q-item-label>
            </q-item-section>
            </q-item>

          
            </q-card>

            <div class="form" style='width:100%'>

            <form 
                @submit.prevent="onSubmit"
                
            >
            <q-input
            filled
            
            clearable
            v-model="newPost"
            type="textarea"
            color="black"
            label="Ecrivez quelque chose"

          
         
            />
         
            
           

         





               

            <div class="q-pa-md q-gutter-sm">
                    <q-btn type="submit" :loading="loading[0]" color="primary" 
                    @click="simulateProgress(0)" 
                :disabled="!newPost"
                    style="width: 150px">
                Valider
                <template v-slot:loading>
                <q-spinner-hourglass class="on-left" />
                Chargement...
                </template>
                </q-btn>
            </div>

            </form>

            </div>



    


    

    </div>
  </q-page>
</template>
<script setup>


import { reactive, ref, onMounted } from 'vue'
import { useUsersStore } from '../stores/UsersStore.js'
import { usePostsStore} from '../stores/PostsStore.js'
import { firebase } from '../boot/firebase.js'
import { useQuasar } from 'quasar'




const $q = useQuasar()



const usersStore = useUsersStore()
const postsStore = usePostsStore()

//POST 
const newPost = ref('')
const newPostRef = ref(null)
const isToEdit = ref(false)
const newPostContent = ref('')
//file









//COMMENTS
const newComment = ref('')
const isToComment = ref(false)
//


const progress = ref(false)

const loading = ref([
      false
])




const onSubmit = () => {
    console.log('Appel de la fonction onSubdmit')
    let currentTime = new Date().getTime()
    let id = currentTime.toString()
    let date = `publié le ${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}`

  
    

    

    let post = {
        id: id,
        authorFirstname : usersStore.user.firstname,
        authorEmail : usersStore.user.email,
        authorLastname : usersStore.user.lastname,
        content : newPost.value,
        date,
        peopleLikingIt: [],
        peopleDislikingIt: [],
        comments: [],
        isCommentsSeeable : false,
       
        
    }

  

    postsStore.addPost(post, file)

    newPost.value = ''
    
  
     
   

}


const simulateProgress = (number) => {
    // we set loading state
    loading.value[ number ] = true

    // simulate a delay
    setTimeout(() => {
    // we're done, we reset loading state
    loading.value[ number ] = false
    }, 3000)
}

/* Handle delete clicked*/


const deletePost = (idToDelete) => {
        console.log('On entre dans la fonctiond deletePost() qui fait référence à la fonction de postsStore du même nom')
        postsStore.deletePost(idToDelete)
}


const startLikeMecanism = (number, post) => {
    
        
    postsStore.likePost(number, post)

    
}

const addComment = (post) => {

    console.log('Appel de la fonction handleComments')
   
 
       
        let currentTime = new Date().getTime()
        let id = currentTime.toString()
        let date = `publié le ${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}`
    
        let comment = {
            id: id,
            authorFirstname : usersStore.user.firstname,
            authorEmail : usersStore.user.email,
            authorLastname : usersStore.user.lastname,
            content : newComment.value,
            date,
                    
        }

    postsStore.addComment(post, comment)
    newComment.value = ''
}

const deleteComment = (post, comment) => {
    postsStore.deleteComment(post, comment)
}
 


const getPostContentBack = (post) => {

    postsStore.getPostContentBack(post)

}


const editNewPostContent = (post) => {

  
    
    let content = newPostContent.value

    console.log('content', content)

    postsStore.editNewPostContent(content, post)
    newPostContent.value = ''
    isToEdit.value = false

}



const onRejected = (rejectedEntries) => {
    
    $q.notify({
    type: 'negative',
    message: `${rejectedEntries.length} fichier ne répond pas aux conditions de validation `
    })

}













onMounted(() => {

    postsStore.getAllPosts()


})

</script>


<style scoped lang="scss">


    img.preview {
        width: 200px;
        height: 200Px;
    }

    .all_posts {

        justify-content: space-evenly;
    }

    .green {
        color: green
    }

    .red {

        color: red;
    }
    
    .new_post {

        justify-content: center;
        background-color: orange;
        border: solid black 1px;

    }

    .new_post, .all_posts {

        display: flex;
        flex-direction : column;
       
        
        overflow: hidden;
        width: 80%;
        padding: 10px;

        margin-top: 30px;
    }

    textarea {
        resize : none;
        width: 100%;
    }



    ////

 

</style>

  
