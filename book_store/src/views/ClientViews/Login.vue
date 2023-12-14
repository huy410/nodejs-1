<template>
<v-row>
    <v-col cols="1">
    </v-col><br>
   
    <v-col cols="10">
         <h2 style="text-align:center;"> Đăng nhập </h2><hr><br>
        <form>

                <v-text-field
                v-model="email"
                :error-messages="emailErrors"
                label="E-mail"
                required
                @input="$v.email.$touch()"
                @blur="$v.email.$touch()"
                ></v-text-field>
                <v-text-field
                v-model="pass"
                :error-messages="passErrors"
                :counter="11"
                label="PassWord"
                type="password"
                required
                @input="$v.pass.$touch()"
                @blur="$v.pass.$touch()"
                ></v-text-field>
                <v-checkbox
                v-model="checkbox"
                :error-messages="checkboxErrors"
                label="Do you agree?"
                required
                @change="$v.checkbox.$touch()"
                @blur="$v.checkbox.$touch()"
                ></v-checkbox>

                <v-btn
                class="mr-4"
                type="submit"
                @click.prevent="submit()"
                >
                submit
                </v-btn>
                <!-- <input class="btn btn-btn primary" type="submit" value="Submit"/> -->
                <v-btn @click="clear">
                clear
                </v-btn>
        </form>
        <br>
        <router-link  to="/register"  style="text-decoration: none; color: inherit;" >
            <v-btn color="primary"> Register</v-btn>
        </router-link>
    </v-col>
     <v-col cols="1">
    </v-col>
</v-row>
  
</template>

<script>
  import Vue from 'vue'
  import { validationMixin } from 'vuelidate'
  import { required, maxLength, email } from 'vuelidate/lib/validators'
  import VueSession from 'vue-session'
  Vue.use(VueSession)
  import axios from 'axios'
  export default {
    mixins: [validationMixin],
    validations: {
      pass: { required, maxLength: maxLength(11) },
      email: { required, email },
      checkbox: {
        checked (val) {
          return val
        },
      },
    },
    data: () => ({
      pass: '',
      email: '',
      checkbox: false,
      users:[],
    }),
    computed: {
      checkboxErrors () {
        const errors = []
        if (!this.$v.checkbox.$dirty) return errors
        !this.$v.checkbox.checked && errors.push('You must agree to continue!')
        return errors
      },
     passErrors () {
        const errors = []
        if (!this.$v.pass.$dirty) return errors
        !this.$v.pass.maxLength && errors.push('Password must be at most 11 characters long')
        !this.$v.pass.required && errors.push('Password is required.')
        var checkpass = false
        this.users.forEach(data => {
             if(this.$v.pass.$model == data.password){
                checkpass = true
             }else{
                 checkpass = false
             }  
        })
        if(checkpass == false){
            errors.push('Password is not exists in E-mail')
        }
        return errors
      },
      emailErrors () {
        const errors = []
        if (!this.$v.email.$dirty) return errors
        !this.$v.email.email && errors.push('Must be valid e-mail')
        !this.$v.email.required && errors.push('E-mail is required')
        var checkemail = false
        this.users.forEach(data => {
             if(this.$v.email.$model == data.email){
                checkemail = true
             }else{
                 checkemail = false
             }  
        })
        if(checkemail == false){
            errors.push('E-mail is not exists')
        }
        return errors
      },    
    },
     async mounted() {
        this.loadUser()
   },
    methods: {
      async submit () {
        var checkemail = false
        this.users.forEach(data => {
             if(this.$v.email.$model == data.email && this.$v.pass.$model == data.password){
                checkemail = true
             }else{
                 checkemail = false
             }  
        })
        if(checkemail == false){
            alert('E-mail and password is not Error') 
        }else{
            //this.$router.push({ path: '/' })
            axios.post(`http://localhost:5000/api/auth/login/${this.email}/${this.pass}`,{
            }).then(success=>{
                // this.$session.start()
                // this.$session.set('login', success)
                this.$router.push({ path: '/',query: {users: JSON.stringify(this.users)}});
                console.log(success)
            })
            .catch(err=>{
                 alert('E-mail and password is not Error') 
                 console.log(err)
            })
        }
      },
      clear () {
        this.$v.$reset()
        this.pass = ''
        this.email = ''
        this.checkbox = false
      },
      async loadUser(){
        // API URL must be constant, should be in config.
        const API_URL = "http://localhost:5000/api/user";
        // If the fetch fails,
        try {
          // Fetch with custom headers.
          const user = await fetch(API_URL, { "method":"GET" })
            .then(response => response.json())
            .then(data => this.users = data
            );
          // Then set the user object to data
          this.users = user;
        } catch (err) {
          console.error(err);
      }
      
      },
    },
  }
</script>