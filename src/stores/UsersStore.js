import { defineStore } from 'pinia';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { firebase } from '../boot/firebase'


export const useUsersStore = defineStore('usersStore', {
  state: () => ({
    user : {
    
    }
  }),
  actions : {

    async addUser(newUser){

        this.user = {
          ...newUser
        }

     

        await setDoc(doc(firebase.db, "users", this.user.uid), {
      
            ...this.user
  
        })


    },
    async getUser(oldUser) {


      const docRef = doc(firebase.db, 'users', oldUser.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
          this.user = {

            ...docSnap.data()

          } 
      } else {
      
        console.log("Cette personne n'existe pas dans la base de données!");
      }

    }

  }

});
