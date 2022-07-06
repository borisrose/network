import { defineStore } from 'pinia';
import { doc, setDoc, addDoc, collection, getDocs, deleteDoc } from 'firebase/firestore'; 
import { firebase } from '../boot/firebase'
import { useUsersStore } from '../stores/UsersStore'
import { ref, uploadBytesResumable } from 'firebase/storage'




let storeUsers = null

export const usePostsStore = defineStore('postsStore', {
  state: () => ({
    posts : [




    ]
    
    
  }),
  actions : {


    async editNewPostContent(newContent, postObject){

      let post = this.posts.filter(post => post.id === postObject.id)[0]
      post.content = newContent

      console.log(post)
      setDoc(doc(firebase.db, 'posts', post.id), {

        content: newContent

      }, {merge : true})
      

    },

    getPostContentBack(postObject){


    },

    async getAllPosts(){

      this.posts = []

      const querySnapshot = await getDocs(collection(firebase.db, "posts"))
      querySnapshot.forEach((doc) => {



        this.posts.push(doc.data());
        
      
    
    
      });
          

    },

    async addComment( postObject, commentObject){

      console.log('postObject', postObject)
      
      console.log('this.posts',this.posts)
      let postToChange = this.posts.filter( post => post.id === postObject.id)
          console.log('La valeur de post', postToChange)
      
          console.log('On ajoute un commentaire')
          console.log('post[0].comments',postToChange[0].comments)
          postToChange[0].comments.push(commentObject)
          console.log('Commentaire ajouté dans le store')
          console.log('On ajoute le commentaire dans la bdd')
          setDoc(doc(firebase.db, 'posts', postToChange[0].id), {

            comments: postToChange[0].comments
  
          }, {merge : true})

          console.log('Commentaire ajouté à la bdd')

      

       

        


    },

    async deleteComment (postObject, commentObject) {

      let post = this.posts.filter( post =>  post.id === postObject.id )
      console.log('On enlève un commentaire')

      post[0].comments = post[0].comments.filter(comment =>  { return comment.id !== commentObject.id})
      console.log('Commentaire enlevé du store')
      console.log('On enlève le commentaire dans la bdd')
      setDoc(doc(firebase.db, 'posts', post[0].id), {

        comments: post[0].comments

      }, {merge : true})

      console.log('Commentaire enlevé de la bdd')

    },

    async addPost(newPost){


        this.posts.unshift(newPost)
        console.log('Post ajouté au store')
        storeUsers = useUsersStore()

      

        await setDoc(doc(firebase.db, 'posts', newPost.id), {
          ...newPost
        });
        console.log('post ajouté à la base de données')

        


       

        
    },

    async deletePost(idToDelete){

        await deleteDoc(doc(firebase.db, "posts", idToDelete));

        this.posts = this.posts.filter( post => { return post.id !== idToDelete})

        
  

    },
    async likePost(number, postToUpdate){
      
      storeUsers = useUsersStore()
      
      let postToChange = this.posts.filter(post => post.id === postToUpdate.id)
      if(number === 1){

        console.log('un like existe déjà ? ',(postToChange[0].peopleLikingIt.filter(uid => uid === storeUsers.user.uid)).length === 1)

        if((postToChange[0].peopleLikingIt.filter(uid => uid === storeUsers.user.uid)).length === 1){

          
          
          console.log('Cas où la personne a déjà liké')
          console.log('On enlève son like')
          let result = postToChange[0].peopleLikingIt.filter(uid => uid !== storeUsers.user.uid)
          postToChange[0].peopleLikingIt = result
          console.log('result', result)
          await setDoc(doc(firebase.db, 'posts', postToChange[0].id), {

            peopleLikingIt: result
  
          }, {merge : true})


          console.log('Situation de postToChange après bloc Like If Like avant Like', postToChange[0])
          
        }
        else {

          if((postToChange[0].peopleDislikingIt.filter(uid => uid === storeUsers.user.uid)).length === 1){


            console.log('Avant de mettre son like, on enlève son dislike')
            let result = postToChange[0].peopleDislikingIt.filter(uid => uid !== storeUsers.user.uid)
            postToChange[0].peopleDislikingIt = result
            console.log(result)
            setDoc(doc(firebase.db, 'posts', postToChange[0].id), {
  
              peopleDislikingIt: result
    
            }, {merge : true})


          }

          console.log('on est dans le bloc de code où aucun like avant venant de user')
   
          postToChange[0].peopleLikingIt.push(storeUsers.user.uid)
          setDoc(doc(firebase.db, 'posts', postToChange[0].id), {
  
            peopleLikingIt: postToChange[0].peopleLikingIt
  
          }, { merge : true })

          console.log('Situation de postToChange après bloc Like Else Aucun like avant Like', postToChange[0])

        }
      

        

      }
      else if(number === 0){

        if((postToChange[0].peopleDislikingIt.filter(uid => uid === storeUsers.user.uid)).length === 1){
          
          console.log('Cas où la personne a déjà disliké')
          console.log('On enlève son dislike')
          let result = postToChange[0].peopleDislikingIt.filter(uid => uid !== storeUsers.user.uid)
          postToChange[0].peopleDislikingIt = result
          console.log(result)
          setDoc(doc(firebase.db, 'posts', postToChange[0].id), {

            peopleDislikingIt: result
  
          }, {merge : true})
      
        }
        else {


          if((postToChange[0].peopleLikingIt.filter(uid => uid === storeUsers.user.uid)).length === 1){


            console.log('On enlève son like')
            let result = postToChange[0].peopleLikingIt.filter(uid => uid !== storeUsers.user.uid)
            postToChange[0].peopleLikingIt = result
            console.log(result)
            setDoc(doc(firebase.db, 'posts', postToChange[0].id), {
  
              peopleLikingIt: result
    
            }, {merge : true})


          }

          postToChange[0].peopleDislikingIt.push(storeUsers.user.uid)
          setDoc(doc(firebase.db, 'posts', postToChange[0].id), {
  
            peopleDislikingIt: postToChange[0].peopleDislikingIt
  
          }, {merge : true})
  


        }
      
      }
   


    }
    


  }

});
