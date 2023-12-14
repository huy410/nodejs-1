
<template>
  <v-data-table
    :headers="headers"
    :items="cate"
    sort-by="calories"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-toolbar-title>Category</v-toolbar-title>
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
                    cols="12" sm="6" md="4"
                  >
                    <v-text-field
                      v-model="editedItem.name"
                      label="Category name"
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
    <template v-slot:[`item.actions`]="{ item }" >
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
import axios from 'axios'
  export default {
    data: () => ({
      dialog: false,
      dialogDelete: false,
      links: [
        {
          text:'Product',
          href:'/product'
        },
        {
          text:'Category',
          href:'/category'
        },
         {
          text:'User',
          href:'/user'
        },
        
      ],
      headers: [
        {
          text: 'Category Name',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      cate: [],
      editedIndex: -1,
      editedItem: {
        name: '',

      },
      defaultItem: {
        name: '',
      },
    }),
    async mounted() {
        this.LoadItens()
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
      async LoadItens(){
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
        this.editedIndex = this.cate.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },
      deleteItem (item) {
        this.editedIndex = this.cate.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
        if(this.dialogDelete == true){
          axios.delete(`http://localhost:5000/api/cate/${item._id}`)
        }
      },
      deleteItemConfirm () {
        this.cate.splice(this.editedIndex, 1)
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
          Object.assign(this.cate[this.editedIndex], this.editedItem)
          axios.put(`http://localhost:5000/api/cate/${this.editedItem._id}/${this.editedItem.name}`)
        } else {
          axios.post(`http://localhost:5000/api/cate/${this.editedItem.name}`)
          .then(function(response){
            console.log(response)
          }.bind(this))
          this.cate.push(this.editedItem)
        }
        this.close()
      },
    },
  }
</script>