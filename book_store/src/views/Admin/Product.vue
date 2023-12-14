<template>
  <v-data-table
    :headers="headers"
    :items="books"
    sort-by="price"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-toolbar-title>Product</v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-dialog
          v-model="dialog"
          fullscreen
          hide-overlay
          transition="dialog-bottom-transition"
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
                      v-model="editedItem.name"
                      label="name"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.author"
                      label="author"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.price"
                      label="price"
                    ></v-text-field>
                  </v-col>
                  <!-- <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.quanlity"
                      label="Quantity"
                    ></v-text-field>
                  </v-col> -->
                
                  <v-col
                    cols="12"
                    sm="6"
                    md="6"
                  >
                    <v-text-field
                      v-model="editedItem.date"
                      label="date time"
                      type="date"
                    ></v-text-field>
                  </v-col> 
                    <v-col
                    cols="12"
                    sm="6"
                    md="6"
                  >
                    <v-select
                      :items="cate"
                      v-model="editedItem.categoryId"
                      label="Category">
                      <template v-slot:item="{item}">
                        {{item.name}}
                      </template>    
                      <template v-slot:selection="{item}">
                        {{item.name}}
                      </template>
                    </v-select>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="12"
                  >
                    <v-textarea
                      v-model="editedItem.describe"
                      label="describe"
                    ></v-textarea>
                  </v-col>
                 
                <v-col
                    cols="12"
                    sm="6"
                    md="12"
                  >
                    <v-file-input
                      v-model="editedItem.image"
                      :rules="rulesImg"
                      accept="image/png, image/jpeg, image/bmp"
                      placeholder="Pick an avatar"
                      prepend-icon="mdi-camera"
                      label="Avatar"
                    ></v-file-input>
                    <!-- <div class="file-upload">
                        <v-file-input type="file" v-model="editedItem.image" ></v-file-input>
                        <v-btn @click="onUploadFile" class="upload-button">Upload file</v-btn>
                      </div> -->
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
    <template v-slot:[`item.image`]="{ item }">
        <div class="p-2">
          <v-img v-bind:src="'http://localhost:5000/upload/'+item.image" :alt="item.name" width="100px" height="100px"></v-img>
        </div>
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
          text: 'UserName',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        { text: 'Author', value: 'author' },
        { text: 'Price', value: 'price' },
        { text: 'Category', value: 'categoryId' },
        //{ text: 'Quantity', value: 'quanlity' },
        { text: 'DateTime', value: 'date' },
        { text: 'Describe', value: 'describe' },
        { text: 'NameImage', value: 'file' },
        { text: 'Image', value: 'image' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      rulesImg: [
        value => !value || value.size < 2000000 || 'Avatar size should be less than 2 MB!',
      ],
      books: [],
      cate:[],
      editedIndex: -1,
      editedItem: {
        name: '',
        price: '',
        author:'',
        describe: '',
        date:'',
        file : '',
        image: '',
        quanlity:'',
        categoryId:''
      },
      defaultItem: {
        name: '',
        price: '',
        author:'',
        describe: '',
        date:'',
        file : '',
        image: '',
        quanlity:'',
        categoryId:''
      },
    }),
    async mounted() {
       this.loadItems();
       this.ItemCategory();
   },
    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
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
    onUploadFile() {
      console.log(this.editedItem.image)
      const formData = new FormData();
      formData.append("file", this.editedItem.image);  // appending file

     // sending file to the backend
      axios
        .post("http://localhost:5000/upload", formData)
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    },
     uploadImage (e) {
      this.file = e.currentTarget.files[0]
      let formData = new FormData()
      formData.append('img', this.file)
      this.uploadUserImage(formData)
      },
       async loadItems(){
        // API URL must be constant, should be in config.
        const API_URL = "http://localhost:5000/api/book";
        // If the fetch fails,
        try {
          // Fetch with custom headers.
          const book = await fetch(API_URL, { "method":"GET" })
            .then(response => response.json())
            .then(data => this.books = data
            );
          // Then set the user object to data
          this.books = book;
        } catch (err) {
          console.error(err);
        }
      },
      async ItemCategory(){
        // API URL must be constant, should be in config.
        const API_URL = "http://localhost:5000/api/cate";
        // If the fetch fails,
        try {
          // Fetch with custom headers.
          const cate = await fetch(API_URL, { "method":"GET" })
            .then(response => response.json())
            .then(data => this.cate = data
            );
          // Then set the user object to data
          this.cate = cate;
        } catch (err) {
          console.error(err);
        }
      },
      initialize () {
       
      },
      editItem (item) {
        this.editedIndex = this.books.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },
      deleteItem (item) {
        this.editedIndex = this.books.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
        if(this.dialogDelete == true){
          axios.delete(`http://localhost:5000/api/book/${item._id}`)
        }
      },
      deleteItemConfirm () {
        this.books.splice(this.editedIndex, 1)
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
          Object.assign(this.books[this.editedIndex], this.editedItem)
          axios.put(`http://localhost:5000/api/book/${this.editedItem._id}/${this.editedItem.name}/${this.editedItem.price}/${this.editedItem.author}/${this.editedItem.describe}/${this.editedItem.date}/${this.editedItem.image.name}/${this.editedItem.categoryId.name}/${this.editedItem.quanlity}`)
        } else {
          axios.post(`http://localhost:5000/api/book/${this.editedItem.name}/${this.editedItem.price}/${this.editedItem.author}/${this.editedItem.describe}/${this.editedItem.date}/${this.editedItem.image.name}/${this.editedItem.categoryId.name}/${this.editedItem.quanlity}`)
          .then(function(response){
            console.log(response)
          }.bind(this))
          this.books.push(this.editedItem)
        }
        this.close()
      },
    },
  }
</script>