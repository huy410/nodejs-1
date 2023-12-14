<template>
  <v-data-table
    :headers="headers"
    :items="bill"
    sort-by="name"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-toolbar-title>Order</v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
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
      headers: [
        {
          text: 'Id ',
          align: 'start',
          sortable: false,
          value: '_id',
        },
        { text: 'totalPrice', value: 'totalPrice', sortable: false },
        { text: 'totalOrder', value: 'totalOrder', sortable: false },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      bill: [],
     
    }),
    async mounted() {
        this.LoadItens()
    },
    computed: {
     
    },
    watch: {
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
        const API_URL = "http://localhost:5000/api/bill";
        // If the fetch fails,
        try {
          // Fetch with custom headers.
          const bill = await fetch(API_URL, { "method":"GET" })
            .then(response => response.json())
            .then(data => this.bill = data
            );
          // Then set the user object to data
          this.bill = bill;
        } catch (err) {
          console.error(err);
      }
      },
      initialize () {
      },
      deleteItem (item) {
        this.editedIndex = this.bill.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
        if(this.dialogDelete == true){
          axios.delete(`http://localhost:5000/api/bill/${item._id}`)
        }
      },
      deleteItemConfirm () {
        this.bill.splice(this.editedIndex, 1)
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
    },
  }
</script>