<template>
<v-row>
    <v-col cols="1">
    </v-col><br>
   
    <v-col cols="10">
         <h2 style="text-align:center;"> Đăng Kí </h2><hr><br>
        <form>
                <v-text-field
                v-model="name"
                :error-messages="nameErrors"
                :counter="10"
                label="Tên đăng nhập"
                required
                @input="$v.name.$touch()"
                @blur="$v.name.$touch()"
                ></v-text-field>
                <v-text-field
                v-model="phoneNumber"
                :error-messages="phoneErrors"
                :counter="10"
                
                label="Số điện thoại"
                required
                @input="$v.phoneNumber.$touch()"
                @blur="$v.phoneNumber.$touch()"
                ></v-text-field>
                <v-text-field
                v-model="address"
                :error-messages="addressErrors"
                :counter="10"
                label="Địa chỉ"
                required
                @input="$v.address.$touch()"
                @blur="$v.address.$touch()"
                ></v-text-field>
                <v-text-field
                  v-model="age"
                  label="age"
                  :error-messages="ageErrors"
                  
                  required
                @input="$v.age.$touch()"
                @blur="$v.age.$touch()"
                ></v-text-field>
                <v-text-field
                  v-model="dob"
                  :error-messages="dobErrors"
                  type="date"
                  label="Date of birth"
                  required
                @input="$v.dob.$touch()"
                @blur="$v.dob.$touch()"
                ></v-text-field>
                <v-text-field
                v-model="email"
                :error-messages="emailErrors"
                label="E-mail"
                required
                @input="$v.email.$touch()"
                @blur="$v.email.$touch()"
                ></v-text-field>
                <v-text-field
                v-model="password"
                :error-messages="passwordErrors"
                :counter="10"
                label="Mật Khẩu"
                required
                @input="$v.password.$touch()"
                @blur="$v.password.$touch()"
                ></v-text-field>
                <v-text-field
                v-model="passwordC"
                :error-messages="passCErrors"
                :counter="10"
                label="Nhập lại mật khẩu"
                required
                @input="$v.passwordC.$touch()"
                @blur="$v.passwordC.$touch()"
                ></v-text-field>
              

                <v-btn
                class="mr-4"
                @click.prevent="submit()"
                >
                Đăng kí
                </v-btn>
                <v-btn @click="clear">
                Làm sạch
                </v-btn>
        </form>
        <br>
        <router-link  to="/login"  style="text-decoration: none; color: inherit;" >
            <v-btn color="green"> Đăng nhập</v-btn>
        </router-link>
    </v-col>
     <v-col cols="1">
    </v-col>
</v-row>
  
</template>

<script>
 import axios from 'axios' 
  import { validationMixin } from 'vuelidate'
  import { required, maxLength, email } from 'vuelidate/lib/validators'
  export default {
    mixins: [validationMixin],
    validations: {
      name: { required, maxLength: maxLength(15) },
      email: { required, email },
      password : {required, maxLength: maxLength(11)},
      passwordC: {required, maxLength: maxLength(11)},
      phoneNumber: { required, maxLength: maxLength(11) },
      address: { required, maxLength: maxLength(50) },
      age:{ required, maxLength: maxLength(3) },
      dob:{required},

    },
    data: () => ({
      name: '',
      email: '',
      phoneNumber:'',
      address:'',
      password:'',
      passwordC:'',
      age:'',
      dob:''

    }),
    computed: {
      nameErrors () {
        const errors = []
        if (!this.$v.name.$dirty) return errors
        !this.$v.name.maxLength && errors.push('Tên phải nhỏ hơn 10 kí tự ')
        !this.$v.name.required && errors.push('Tên chưa nhập.')
        return errors
      },
      emailErrors () {
        const errors = []
        if (!this.$v.email.$dirty) return errors
        !this.$v.email.email && errors.push('e-mail sai định dạng')
        !this.$v.email.required && errors.push('E-mail chưa nhập')
        return errors
      },
      phoneErrors () {
        const errors = []
        if (!this.$v.phoneNumber.$dirty) return errors
        !this.$v.phoneNumber.maxLength && errors.push('phoneNumber phải 11 kí tự')
        !this.$v.phoneNumber.required && errors.push('phoneNumber chưa nhập.')
        if(!/[0-9]/.test(this.phoneNumber)){
          errors.push('phoneNumber sai định dạng.')
        }
        return errors
      },
      addressErrors () {
        const errors = []
        if (!this.$v.address.$dirty) return errors
        !this.$v.address.maxLength && errors.push('addressphải nhỏ hơn 50 kí tự')
        !this.$v.address.required && errors.push('address chưa nhập.')
        return errors
      },
      ageErrors () {
        const errors = []
        if (!this.$v.age.$dirty) return errors
        !this.$v.age.maxLength && errors.push('age phải nhỏ hơn 3 kí tự')
        !this.$v.age.required && errors.push('age chưa nhập.')
        if(!/[0-9]/.test(this.age)){
          errors.push('age sai định dạng.')
        }
        return errors
      },
      dobErrors () {
        const errors = []
        if (!this.$v.dob.$dirty) return errors
        !this.$v.dob.required && errors.push('dob chưa nhập.')
        return errors
      },
      passwordErrors () {
        const errors = []
        if (!this.$v.password.$dirty) return errors
        !this.$v.password.maxLength && errors.push('password phải nhỏ hơn 11 kí tự') 
        !this.$v.password.required && errors.push('password chưa nhập.')
        return errors
      },
      passCErrors () {
        const errors = []
        if (!this.$v.passwordC.$dirty) return errors
        !this.$v.passwordC.maxLength && errors.push('password confirm phải nhỏ hơn 11 kí tự')
        !this.$v.passwordC.required && errors.push('password confirm chưa nhập.')
        if(this.password != this.passwordC){
          errors.push('password phải trùng với confirm password')
        }
        return errors
      },
    },
    methods: {
      submit () {
        axios.post(`http://localhost:5000/api/user/${this.name}/${this.age}/${this.email}/${this.address}/${this.phoneNumber}/${this.password}/${this.dob}`,{
            }).then(success=>{
                this.$router.push({ path: '/'});
                console.log(success)
            })
            .catch(err=>{
                 alert(err) 
                 console.log(err)
            })
      },
      clear () {
        this.$v.$reset()
        this.name = ''
        this.email = ''
        this.address='',
        this.phoneNumber=''
        this.password='',
        this.passwordC='',
        this.dob = '',
        this.age = ''
      },
    },
  }
</script>