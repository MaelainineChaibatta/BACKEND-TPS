
import {defineStore} from "penia";
import {auth} from "../firebase/firebaseConfig"
import { onAuthStateChanged} from "firebase/auth";
import {ref} from "vue";


// creates a centralized place to store and access the current logged-in user across the entire Vue app
export const useUserStore = defineStore("userStore" ,()=>{
    const user = ref(null)
    onAuthStateChanged(auth ,(u)=>{
        user.value = u;
    });
    
    return {user};

});