<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      app
    >
    <br>
    <h2  style="text-align: center;"> Quản lý của trang </h2>
     <hr/><br>
     <div v-for="(link,i) in linksAdmin" :key="i">
          <router-link
           :to="link.href"
           style="text-decoration: none; color: inherit;"
           >
           <v-tabs
           align-with-title>
              <v-btn width="150px" style="text-align: center; margin-right: 130px;">{{ link.text }}</v-btn> 

           </v-tabs>
           
         </router-link>
    </div>
    
    </v-navigation-drawer>
      <v-app-bar
      app
      color="white"
      flat
     >
     
     <v-app-bar-nav-icon v-if="visibleAdmin" @click="drawer = !drawer"></v-app-bar-nav-icon>      
        <v-avatar
          class="mr-10"
          color="#ffe6e6"
          size="52"
        >
        <router-link to="/" style="color:#ff8000;text-decoration: none;" >
          Book
        </router-link>
        </v-avatar>
        <div>
          
           <v-tabs
           align-with-title
           >
           <v-container class="py-0 fill-height">
             <v-tab
               color="white"
               v-for="(link,i) in links"
               :key="i"
            >
            <router-link
              :to="link.href"
              style="text-decoration: none; color: inherit;"
            >
              {{ link.text }}
              
            </router-link>
            </v-tab>
            <v-tab 
              v-if="visibleBook"
            >
               <router-link
                to='/book'
                style="text-decoration: none; color: inherit;"
              >
                Sách
              </router-link>
            </v-tab>
            <v-tab 
            >
               <a
                v-on:click="countClick += 1,coutClick()"
                href="http://localhost:5000/chatRoom"
                target="_blank"
                style="text-decoration: none; color: inherit;"
              >
                Kênh chat 
              </a>
            </v-tab>
                <v-btn
                color="green lighten-2"
                dark
                @click="dialog = true"
                :disabled="validated==visible"
              >
                Đăng Nhập
              </v-btn>
              <v-btn
              color="red lighten-2"
              dark
              @click="dialog_logout=true"
              :disabled="validated==visibleD"
            >
              Thoát tài khoản
            </v-btn>
             <h3 style="margin-right:50px">{{username}} </h3>
            <v-btn   v-if="visibleCart">
                <router-link  
                :to="'/cart'"
                style="text-decoration: none; color: inherit;"
              >
              
                <v-icon >mdi-cart</v-icon>
              </router-link>
            </v-btn>
              

            </v-container>
           </v-tabs>
            
        </div>
        <v-spacer></v-spacer>

  
    <v-dialog
      v-model="dialog"
      width="500"
    >
      <v-card>
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
                Đăng nhập
                </v-btn>
                <v-btn @click="clear">
                Làm sạch
                </v-btn>
        </form>
        <br>
        <router-link  to="/register"  style="text-decoration: none; color: inherit;" >
            <v-btn @click="dialog = false" color="primary"> Đăng kí</v-btn>
        </router-link>
    </v-col>
     <v-col cols="1">
       
    </v-col>
  </v-row><br>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="dialog = false"
          >
           Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <v-dialog
      v-model="dialog_logout"
      width="500"
    >
      <v-card>
        <v-row>
        <v-col cols="1">
        </v-col><br>
      
        <v-col cols="10">
            <h3 style="text-align:center;"> Bạn muốn thoát  tài khoản ? </h3>
        </v-col>
        <v-col cols="1">
        </v-col>
      </v-row>
          <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="logout()"
          >
          Đồng ý
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
      
       
     
      
    </v-app-bar>
    
    <v-main>
        <v-container class="grey lighten-5">
             <router-view/><br>
        </v-container>
        <v-footer padless>
        <v-col
          class="text-center"
          cols="12"
        >
          {{ new Date().getFullYear() }} — <strong>Book Store</strong>
        </v-col>
      </v-footer>
    </v-main>
  </v-app>
  
</template>

<script>
import Vue from 'vue'
import { validationMixin } from 'vuelidate'
import { required, maxLength, email } from 'vuelidate/lib/validators'
import VueSession from 'vue-session'
Vue.use(VueSession)
import axios from 'axios'
export default {
  name: 'App',
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
    countClick:0,
    visible:1,
    visibleAdmin:0,
    visibleD:0,
    visibleBook:0,
    visibleCart:0,
    disabled: 0,
    validated:0,
    dialog_logout:false,
    dialog: false,
    pass: '',
    email: '',
    checkbox: false,
    username:'',
    users:[],
    loginUser:[],
    drawer: false,
    links: [
        {
          text:'Trang Chủ',
          href:'/'
        },
        // {
        //   text:'Nhóm thảo luận sách ',
        //   href:'http://localhost:3000/'
        // }, 
        {
          text:'FaQs',
          href:'/faqs'
        }, 
        {
          text:'Ý kiến Phản hồi',
          href:'/contact'
        }, 
      ],
    linksAdmin:[
        {
          text:'Product',
          href:'/product'
        },
        {
          text:'FeedBack',
          href:'/feedback'
        },
        {
          text:'Category',
          href:'/category'
        },
         {
          text:'User',
          href:'/user'
        },
        {
          text:'FaQ',
          href:'/faq'
        },
        {
          text:'Order',
          href:'/order'
        },
        {
          text:'TransportPay',
          href:'/transport_user'
        },
         {
          text:'TranBorrow',
          href:'/transport_info_user_borrow'
        },
        
    ],
    eventLgRg:[
        {
          text:'Đăng nhập',
          href:'/login'
        },
         {
          text:'Thoát',
          href:'/'
        },
    ],
    
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
            checkpass = (this.$v.pass.$model == data.password)
        })
        if(checkpass == false){
            //errors.push('Password is not exists in E-mail')
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
            checkemail = (this.$v.email.$model == data.email)
        })
        checkemail == false 
        // && errors.push('E-mail is not exists')
        
        return errors
      },    
    },
     async mounted() {
        this.loadUser()
   },
    methods: {
      coutClick(){
          alert("Bạn muốn tham kênh chat ")
      },
      logout(){
        this.username = ''
        this.dialog_logout = false
        this.visible = 1
        this.visibleD = 0
        this.visibleBook=0
        this.visibleCart = 0
        this.visibleAdmin = 0
        this.$router.push({ path: '/'}).catch(()=>{});
      },
      async submit () {
        var checkemail = false
        var checkpass = false
        this.users.forEach(data => {
              checkemail = (this.$v.email.$model == data.email)
              checkpass = (this.$v.pass.$model == data.password)
              var point = 0
              if(checkemail == true && checkpass == true){
                point = 1
              }else{
                point = 2
              }
              switch(point){
                case 1 :{
                    axios.post(`http://localhost:5000/api/auth/login/${this.email}/${this.pass}`,{
                    }).then(success=>{
                        this.loginUser = success
                        if(!this.loginUser.data){
                          this.username = ''
                        }else{
                          this.username = 'Chào bạn : '+ this.loginUser.data.userName
                        }
                        if(this.loginUser.data.userName == 'admin'){
                          this.visibleAdmin = 1
                        }else{
                          this.visibleAdmin = 0
                        }
                        this.visibleD = 1
                        this.visible = 0
                        this.visibleBook=1
                        this.visibleCart = 1
                        this.dialog = false
                        this.$router.push({ path: '/'}).catch(()=>{});
                    })
                    .catch(err=>{
                        alert('E-mail và password thì  sai') 
                        console.log(err)
                    })
                    break;
                }
                case 2:
                  checkemail = false 
                  checkpass = false
                  break;
                default:
                  break;
              }
             
        })
        if(checkemail == false  && checkpass == false){
          //alert('E-mail và password thì  sai') 
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
  
};
</script>
