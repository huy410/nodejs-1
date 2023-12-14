<style>
.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  opacity: .5;
  position: absolute;
  width: 100%;
}
.displayBoook{
  display: -webkit-box;
  max-height: 600px;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  -webkit-line-clamp: 10;
  line-height: 100px;
}
.describe{
  display: -webkit-box;
  max-height: 3.2rem;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  -webkit-line-clamp: 2;
  line-height: 1.6rem;
}
</style>
<template>
  <v-row>
    <v-col cols="1">
    </v-col>
    <v-col cols="10">  
   <br>
    <h2 style="text-align: center;"> Sách </h2>
    <hr><br>
     <v-row>
      <v-col cols="3">
          <v-autocomplete
        v-model="model"
        :items="items"
        :loading="isLoading"
        :search-input.sync="search"
        color="white"
        hide-no-data
        hide-selected
        item-text="Description"
        item-value="API"
        label="Tìm kiếm sách"
        placeholder="bắt đầu tìm kiếm"
        prepend-icon="mdi-database-search"
        return-object
      ></v-autocomplete> 
      </v-col>
      <v-col cols="7">
      </v-col>
    </v-row> 
    <div>
      <v-container class="py-0 fill-height">
      <v-row>
    <v-col cols="4"  v-for="(item,i) in visiblePages" v-bind:key="i" @click="Detail">
          <v-hover v-slot="{ hover }" class="displayBoook">
    <v-card
      class="mx-auto"
      color="grey lighten-4"
    >
      <v-img
        :aspect-ratio="16/9"
        v-bind:src="'http://localhost:5000/upload/'+item.image"
      >
        <v-expand-transition>
          <div
            v-if="hover"
            class="d-flex transition-fast-in-fast-out orange darken-2 v-card--reveal text-h2 white--text"
            style="height: 100%;"
          >
            ${{item.price}}
          </div>
        </v-expand-transition>
      </v-img>
      <v-card-text
        class="pt-6"
        style="position: relative;"
      >
        <div class="font-weight-light grey--text text-h6 mb-2">
          {{item.author}}
        </div>
        <h3 class="text-h4 font-weight-light orange--text mb-2">
          {{item.name}}
        </h3>
        <div class="font-weight-light text-h6 mb-2 describe">
          <p >{{item.describe}}</p>
        </div>
            <v-dialog
        transition="dialog-bottom-transition"
        max-width="600"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="primary"
            v-bind="attrs"
            v-on="on"
            @click="editItem(item)"
          >Thông tin sách</v-btn>
        </template>
        <template v-slot:default="dialog">
          <v-card>
            <v-toolbar
              color="primary"
              dark
            >Thông tin sách</v-toolbar>
            <v-card-text>
              <br>
              <v-row>
                  <v-col cols="6">
                        <h2>Tên Sách : {{editedItem.name}}</h2>
                        <h2>Tác Giả : {{editedItem.author}}</h2>
                        <h2>Thể loại : {{editedItem.categoryId}}</h2>
                        <h2>Giá : {{editedItem.price}}</h2>
                        <h2>Miêu tả :</h2> {{editedItem.describe}}
                        <br><br>
                        <v-text-field
                          label="Số Lượng"
                          v-model="quantityBook"
                          style="width:60px"
                        ></v-text-field>
                  </v-col>
                  <v-col  cols="6">
                      <img style="width:280px" v-bind:src="'http://localhost:5000/upload/'+editedItem.image"/>
                  </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
            <v-btn
                outlined
                rounded
                text
                color="#00bfff"
                @click="addCart(item)"
            >
                Mua sách  
            </v-btn>
            <v-btn
                outlined
                rounded
                text
                color="#0000ff"
                @click="addBorrow(item)"
            >
                Mượn sách 
            </v-btn>
            </v-card-actions>
            <v-card-actions >
              <v-btn
                text
                @click="dialog.value = false"
                color="red"
              >Đóng</v-btn>
              
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
      <!-- <v-dialog v-model="dialog_view" transition="dialog-bottom-transition"  max-width="600">
          <v-card>
            <v-toolbar
              color="primary"
              dark
            >Thông tin sách</v-toolbar>
            <h3 @click="dialog_view=false">Đóng</h3>
            <v-card-text>
              <br>
              <v-row>
                  <v-col cols="6">
                        <h2>Tên Sách : {{editedItem.name}}</h2>
                        <h2>Tác Giả : {{editedItem.author}}</h2>
                        <h2>Thể loại : {{editedItem.categoryId}}</h2>
                        <h2>Giá : {{editedItem.price}}</h2>
                        <h2>Miêu tả :</h2> {{editedItem.describe}}
                        <br><br>
                        <v-text-field
                          label="Số Lượng"
                          v-model="quantityBook"
                          style="width:60px"
                        ></v-text-field>
                  </v-col>
                  
                  <v-col  cols="6">
                      <img style="width:280px" v-bind:src="'http://localhost:5000/upload/'+editedItem.image"/>
                  </v-col>
                  <v-col cols="4">
                    <h3 class="button button5" @click="addCart(item)">Mua sách</h3>
                  </v-col>
                  <v-col cols="4">
                      <h3 class="button button5"  @click="addBorrow(item)">Mượn sách</h3>
                  </v-col>
                  <br/>
                  <h3 style="color:red" @click="dialog_view=false">Đóng</h3>
              </v-row>
              
            </v-card-text>
          </v-card>
      </v-dialog> -->
      </v-card-text>
    </v-card>
  </v-hover>
        </v-col>
      </v-row>
      </v-container>
    </div>
    <v-pagination
    v-model="page"
    circle
    :length="Math.ceil(books.length/perPage)"
    >
    </v-pagination>

    </v-col>
    <v-col cols="1">
    </v-col>
  </v-row>

</template>

<script>
  export default {
    props: [

    ],
    data () {
      
      return {
        descriptionLimit: 60,
        entries: [],
        isLoading: false,
        model: null,
        search: null,
        dialog:false,
        quantityBook:1,
        page: 1,
        perPage: 6,
        books:[],
        users:[],
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
      }
    },
     async mounted() {
       this.GetBook();
       this.GetUser();
   },
   computed:{
     visiblePages () {
       const book = this.books.slice((this.page - 1)* this.perPage, this.page* this.perPage)
       
      return book
    },
    fields () {
        if (!this.model) return []

        return Object.keys(this.model).map(key => {
          return {
            key,
            value: this.model[key] || 'n/a',
          }
        })
      },
      items () {
        return this.entries.map(entry => {
          const Description = entry.Description.length > this.descriptionLimit
            ? entry.Description.slice(0, this.descriptionLimit) + '...'
            : entry.Description

          return Object.assign({}, entry, { Description })
        })
      },
    
   },
    watch: {
      async search (val) {
        console.log(val)
        // API URL must be constant, should be in config.
        const API_URL = `http://localhost:5000/api/search/${val}`;
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
          this.GetBook()        
          console.log(err);

        }
      },
    },
   methods: {
    async addCart(item){ 
        this.dialog = false
       var itemBooks =  Object.assign({}, item)
       //var totalPrice = parseInt(itemBooks.price) *  parseInt(this.quantityBook)
       //console.log(parseInt(itemBooks.price) *  parseInt(this.quantityBook))
       const API_URL = `http://localhost:5000/api/cart/${this.quantityBook}/${itemBooks.price}/${itemBooks._id}/${itemBooks.name}/${itemBooks.image}`;
        // If the fetch fails,
        try {
          // Fetch with custom headers.
          await fetch(API_URL, { "method":"POST" })
            .then(response => response.json()
            )
            
        } catch (err) {
          console.error(err);
        }
     },
     async addBorrow(item){ 
        this.dialog = false
       var itemBooks =  Object.assign({}, item)
       //var totalPrice = parseInt(itemBooks.price) *  parseInt(this.quantityBook)
       //console.log(parseInt(itemBooks.price) *  parseInt(this.quantityBook))
       const API_URL = `http://localhost:5000/api/cartborrow/${this.quantityBook}/${ parseFloat(itemBooks.price)/9}/${itemBooks._id}/${itemBooks.name}/${itemBooks.image}`;
        // If the fetch fails,
        try {
          // Fetch with custom headers.
          await fetch(API_URL, { "method":"POST" })
            .then(response => response.json()
            )
            
        } catch (err) {
          console.error(err);
        }
     },
    editItem (item) {
        this.editedIndex = this.books.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },
     Detail(){
         this.dialog = true
     },
     async GetBook(){
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
     async GetUser(){
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
     }
   }
  }
</script>