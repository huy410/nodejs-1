<template>
  <v-data-table
    :headers="headers"
    :items="users"
    sort-by="calories"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-toolbar-title>User</v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-dialog
          v-model="dialog"
          max-width="500px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              dark
              class="mb-2"
              v-bind="attrs"
              v-on="on"
            >
              New Item
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.userName"
                      label="user name"
                      :rules="UserNameRules"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.age"
                      label="age"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.email"
                      label="E-mail"
                      :rules="emailRules"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.address"
                      label="address"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.phoneNumber"
                      label="phone number"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="6"
                  >
                    <v-text-field
                      v-model="editedItem.password"
                      label="password"
                      :rules="passRules"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="6"
                  >
                    <v-text-field
                      v-model="editedItem.dateofbirth"
                      type="date"
                      label="Date of birth"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="close"
              >
                Cancel
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="save"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        small
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn
        color="primary"
        @click="initialize"
      >
        Reset
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
import axios from 'axios';

  export default {
    data: () => ({
      dialog: false,
      dialogDelete: false,
      headers: [
        {
          text: 'User Name',
          align: 'start',
          sortable: false,
          value: 'userName',
        },
        { text: 'Age', value: 'age' },
        { text: 'Email', value: 'email' },
        { text: 'Adress', value: 'address' },
        { text: 'Date of Birth', value: 'dateofbirth' },
        { text: 'Phone Number', value: 'phoneNumber' },
        { text: 'PassWord', value: 'password' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      users: [],
      editedIndex: -1,
      editedItem: {
        userName:'',
        age: '',
        email: '',
        address: '',
        dateofbirth:'',
        phoneNumber : '',
        password :'',
        
      },
      defaultItem: {
        userName:'',
        age: '',
        email: '',
        address: '',
        dateofbirth:'',
        phoneNumber : '',
        password :'',
        
      },
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid',
      ],
      passRules:[
        v => !!v|| 'PassWord is required',
        v => v.lenght <= 11 || 'PassWord must be less than 11 characters'
      ],
      UserNameRules:[
        v => !!v|| 'User Name is required',
        v => v.lenght <= 25 || 'User Name must be less than 25 characters'
      ]
    }),
    async mounted() {
        this.loadItems()
   },
    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
      },
      emailErrors () {
        const errors = []
        if (!this.$v.email.$dirty) return errors
        !this.$v.email.email && errors.push('Must be valid e-mail')
        !this.$v.email.required && errors.push('E-mail is required')
        return errors
      },
    },
    watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },
    },
    created () {
      this.initialize()
    },
    methods: {
      async loadItems(){
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
      initialize () {
       
      },
      editItem (item) {
        console.log(item._id)
        this.editedIndex = this.users.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },
      deleteItem (item) {
 
        this.editedIndex = this.users.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
        if(this.dialogDelete == true){
          axios.delete(`http://localhost:5000/api/user/${item._id}`)
        }
      },
      deleteItemConfirm () {
        this.users.splice(this.editedIndex, 1)
        this.closeDelete()
      },
      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },
      closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },
      save () {
        if (this.editedIndex > -1) {
          Object.assign(this.users[this.editedIndex], this.editedItem)
          axios.put(`http://localhost:5000/api/user/${this.editedItem._id}/${this.editedItem.userName}/${this.editedItem.age}/${this.editedItem.email}/${this.editedItem.address}/${this.editedItem.phoneNumber}/${this.editedItem.password}/${this.editedItem.dateofbirth}`)
        } else {
          axios.post(`http://localhost:5000/api/user/${this.editedItem.userName}/${this.editedItem.age}/${this.editedItem.email}/${this.editedItem.address}/${this.editedItem.phoneNumber}/${this.editedItem.password}/${this.editedItem.dateofbirth}`)
          .then(function(response){
            console.log(response)
          }.bind(this))
          this.users.push(this.editedItem)
        }
        this.close()
      },
    },
  }
</script>