<style>
.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  opacity: .5;
  position: absolute;
  width: 100%;
}
.describe{
  display: -webkit-box;
  max-height: 4.2rem;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  -webkit-line-clamp: 2;
  line-height: 1.6rem;
}
.info{
  margin-left:10px ;
}
</style>
<template>
  <v-row>
    <v-col cols="1">
     
    </v-col>
    <v-col cols="10">
      <img src="http://localhost:5000/upload/slide-img1.png" />
      <br/>
      <h3 style="text-align: center;">Sách Mới</h3>
      <hr/>
      <v-carousel
      cycle
      height="400"
      hide-delimiter-background
      show-arrows-on-hover
    >
      <v-carousel-item
        v-for="(item, i) in newBook"
        :key="i"
      >
      <br>
         <v-row>
            <v-col cols="1">
          </v-col>
          <v-col cols="4">
            <v-img style="width:500px;height:250px" v-bind:src="item.link"></v-img>
          </v-col>
          <v-col cols="4">
            <p>{{item.content}} </p>
          </v-col> 
          <v-col cols="1">
          </v-col>
         </v-row>
      </v-carousel-item>
      
     </v-carousel>
   
     <h3 style="text-align: center;">About</h3>
    <hr/><br> 
    <img style="display: block;margin-left: auto; margin-right: auto;"  src="http://localhost:5000/upload/Capture.PNG"/>
    <h3 style="text-align: center;">Sách HOT</h3>
    <hr/><br>    
    <img style="display: block;margin-left: auto; margin-right: auto;"  src="http://localhost:5000/upload/bn_pr_4.png"/>
   <br/>
    <div>
      <v-container class="grey lighten-5">
                 <v-row>
        <v-col cols="4"  v-for="(item,i) in visiblePages" v-bind:key="i" @click="editItem(item)">
          <v-hover v-slot="{ hover }">
    <v-card
      class="mx-auto"
      color="grey lighten-4"
      max-width="500"
      height="600"
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
      </v-card-text>
       <!-- <v-dialog
        transition="dialog-bottom-transition"
        max-width="600"
      >
      
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="primary"
            v-bind="attrs"
            v-on="on"
            class="info"
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
                       
                  </v-col>
                  <v-col  cols="6">
                      <img style="width:280px" v-bind:src="'http://localhost:5000/upload/'+editedItem.image"/>
                  </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions >
              <v-btn
                text
                @click="dialog.value = false"
              >Close</v-btn>
              
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog> -->
      <v-dialog v-model="dialog_view_info" transition="dialog-bottom-transition" max-width="600">
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
                       
                  </v-col>
                  <v-col  cols="6">
                      <img style="width:280px" v-bind:src="'http://localhost:5000/upload/'+editedItem.image"/>
                  </v-col>
              </v-row>
               <h3 style="color:red" @click="dialog_view_info=false">Đóng</h3>
            </v-card-text>
           
          </v-card>
      </v-dialog>
    </v-card>
  </v-hover>
        </v-col>
      </v-row>
      </v-container>
   
      <v-pagination
      v-model="page"
      circle
      :length="Math.ceil(books.length/perPage)"
    >
      
    </v-pagination>
     
    </div>
    
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
        dialog_view_info:false,
        dialog:false,
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
        chat:'',
        page: 1,
        perPage: 6,
        newBook: [
          {
            link: 'http://localhost:5000/upload/images (5).png',
            content:"Celebrate the dawning of a new decade with the fully revised Guinness World Records 2020. To kick off the '20s, we've created an electrifying new cover and curated a record-breaking edition packaged with thousands of new, updated and classic superlatives, hundreds of never-before-seen images, and a selection of eye-opening photo-composites that put a new spin"
          },
          {
            link: 'http://localhost:5000/upload/images (24).png',
            content:"Celebrate the dawning of a new decade with the fully revised Guinness World Records 2020. To kick off the '20s, we've created an electrifying new cover and curated a record-breaking edition packaged with thousands of new, updated and classic superlatives, hundreds of never-before-seen images, and a selection of eye-opening photo-composites that put a new spin"
          },
          {
            link: 'http://localhost:5000/upload/images (18).png',
            content:"Celebrate the dawning of a new decade with the fully revised Guinness World Records 2020. To kick off the '20s, we've created an electrifying new cover and curated a record-breaking edition packaged with thousands of new, updated and classic superlatives, hundreds of never-before-seen images, and a selection of eye-opening photo-composites that put a new spin"
          }
          
        ],
        books:[],
        users:[],
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
    }
   },
 
 
   methods: {
     editItem (item) {
        this.editedIndex = this.books.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog_view_info = true
      },
     Detail(){
         this.dialog = true
     },
     clickCallback (pageNum){
      console.log(pageNum)
    },
    CloseDialog(){
      this.dialog_view_info = false
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