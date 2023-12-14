
<template>
  <v-row>
    <v-col cols="1">
    </v-col>
    <v-col cols="10">   
   <br>
    <h2 style="text-align: center;"> Ý kiến phản hồi  </h2>
    <hr><br>
    <div>
    <form>
      <v-text-field
        v-model="name"
        :error-messages="nameErrors"
        :counter="10"
        label="Tên"
        required
        @input="$v.name.$touch()"
        @blur="$v.name.$touch()"
      ></v-text-field>
      <v-text-field
        v-model="email"
        :error-messages="emailErrors"
        label="E-mail"
        required
        @input="$v.email.$touch()"
        @blur="$v.email.$touch()"
      ></v-text-field>
     <v-textarea
        v-model="comment"
        :error-messages="commentErrors"
        label="nội dung"
        required
        @input="$v.comment.$touch()"
        @blur="$v.comment.$touch()"
      ></v-textarea>
      <v-checkbox
        v-model="checkbox"
        :error-messages="checkboxErrors"
        label="Bạn xác nhận điều trên ?"
        required
      ></v-checkbox>

      <v-btn
        class="mr-4"
        @click="submit"
      >
        Gửi
      </v-btn>
      <v-btn @click="clear">
        Làm sạch
      </v-btn>
  </form> 
    </div>
    </v-col>
    <v-col cols="1">
    </v-col>
  </v-row>

</template>

<script>
  import { validationMixin } from 'vuelidate'
  import { required, maxLength, email } from 'vuelidate/lib/validators'
  import axios from 'axios'

  export default {
    mixins: [validationMixin],

    validations: {
      name: { required, maxLength: maxLength(10) },
      email: { required, email },
      comment:{required,maxLength: maxLength(1000)},
      checkbox: {
        checked (val) {
          return val
        },
      },
    },

    data: () => ({
      name: '',
      email: '',
      comment:'',
      checkbox: false,
    }),

    computed: {
      checkboxErrors () {
        const errors = []
        if (!this.$v.checkbox.$dirty) return errors
        !this.$v.checkbox.checked && errors.push('Xác nhận để tiếp tục!')
        return errors
      },
      nameErrors () {
        const errors = []
        if (!this.$v.name.$dirty) return errors
        !this.$v.name.maxLength && errors.push('Tên phải ít hơn 10 kí tự')
        !this.$v.name.required && errors.push('Tên chưa đc nhập.')
        return errors
      },
      commentErrors () {
        const errors = []
        if (!this.$v.comment.$dirty) return errors
        !this.$v.comment.maxLength && errors.push('nội dung  phải ít hơn 1000 kí tự')
        !this.$v.comment.required && errors.push('nội dung chưa đc nhập.')
        return errors
      },
      emailErrors () {
        const errors = []
        if (!this.$v.email.$dirty) return errors
        !this.$v.email.email && errors.push('Must be valid e-mail')
        !this.$v.email.required && errors.push('E-mail is required')
        return errors
      },
    },

    methods: {
      submit () {
        axios.post(`http://localhost:5000/api/contact/${this.name}/${this.email}/${this.comment}`)
        .then(success=>{
          console.log(success)
          alert(" Gửi ý kiến thành công ")
        })
        .catch(err=>{
          console.log(err)
        })
        this.$v.$touch()
      },
      clear () {
        this.$v.$reset()
        this.name = ''
        this.email = ''
        this.select = null
        this.checkbox = false
      },
    },
  }
</script>