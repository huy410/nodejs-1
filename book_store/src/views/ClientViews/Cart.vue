<style>
  .cartborrow{
    text-decoration: none; color: inherit;margin-left:98%
  }

</style>
<template>
 <v-row>
    <v-col cols="1">
    </v-col>
    <v-col cols="10">
    <router-link
    to="/cartborrow"
    class="cartborrow"
    >
         <v-btn color="#ffff00">Mượn sách</v-btn>
    </router-link><br/><br/>
    <v-simple-table>
    <template v-slot:default>
      <thead>
        <tr>
          <th class="text-left">
            Tên sách
          </th>
          <th class="text-left">
            Số tiền
          </th>
          <th class="text-left">
            Số lượng
          </th>
          <th class="text-left">
            Ảnh sách
          </th>
          <th class="text-left">
            Hành động
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in cart"
          :key="item.name"
        >
          <td>{{ item.bookName }}</td>
          <td>${{ item.totalprice }}</td>
          <td><v-text-field style="width:40px" v-model="item.totalquantity"></v-text-field></td>
          <td><v-img v-bind:src="'http://localhost:5000/upload/'+item.bookImg" width="80px" height="80px"></v-img> </td>
          <td>
              <v-row>
                  <v-col cols="3">
                    <v-icon
                    small
                     @click.prevent="editedItem(item)"
                    class="mr-2"
                >
                    mdi-pencil
                </v-icon>
               
                </v-col>
                  <v-col cols="3"
                  >
                   <v-icon
                    small
                    @click="deleteItem(item)"
                >
                    mdi-delete
                </v-icon>

                  </v-col>
              </v-row>
          </td>
        </tr>
        
      </tbody>
    </template>
  </v-simple-table>
  <br><hr><br>
  <v-row>
      <v-col cols="5">
            <h2 style="margin:10px"> Tổng hóa đơn : ${{totalPr}}</h2>
            <h2 style="margin:10px"> Tổng số đơn : {{totalOrder}}</h2>
      </v-col>
       <v-col cols="5"> 
           <v-btn color="red" style="margin-left:80%" @click="showTransport()">Mua sách</v-btn>
      </v-col>
          <v-dialog 
              v-model="dialog_transport"
              fullscreen
              hide-overlay
              transition="dialog-bottom-transition"
              scrollable
              
             >
             <div  style="background-color:white;">
               <template>
                  <v-stepper v-model="e1">
                    <v-stepper-header>
                      <v-stepper-step
                        :complete="e1 > 1"
                        step="1"
                        :rules="[() => registerBase]"
                      >
                        Đăng kí thông tin nhận hàng
                      </v-stepper-step>

                      <v-divider></v-divider>

                      <v-stepper-step
                        :complete="e1 > 2"
                        step="2"
                        :rules="[() => end]"
                      >
                        Thanh toán
                      </v-stepper-step>

                      <v-divider></v-divider>

                      <v-stepper-step step="3"
                        

                      >
                        Hoàn tất
                      </v-stepper-step>
                    </v-stepper-header>

                    <v-stepper-items>
                      <v-stepper-content step="1">
                        <v-card
                          class="mb-12"
                          color="white lighten-1"
                          
                        >
                             <v-card-text>
                                <v-text-field
                                    v-model="fullname"
                                    label="Họ và Tên"
                                    :rules="[v => !!v || 'Họ và Tên không được để trống']"
                                    required
                                ></v-text-field>
                                <v-text-field
                                    v-model="email"
                                    label="Email"
                                    :rules="[v => !!v || 'Email không được để trống',v => /.+@.+/.test(v) || 'E-mail không đúng']"
                                    required
                                ></v-text-field>
                                <v-text-field
                                    v-model="address"
                                    label="Địa chỉ nhận hàng"
                                    :rules="[v => !!v || 'Địa chỉ nhận hàngn không được để trống']"
                                    required
                                ></v-text-field>
                                
                                <v-text-field
                                    v-model="phonenumber"
                                    counter="11"
                                    maxlength="11"
                                    label="Số điện thoại"
                                    :rules="[v => !!v || 'Số điện thoại không được để trống',v=>/[0-9]/.test(v) || 'Sai định dạng']"
                                    required
                                ></v-text-field>
                            </v-card-text>
                        
                        </v-card>

                        <v-btn
                          color="primary"
                          @click="e1 = 2,RegisterTransport()"
                        >
                          Tiếp tục
                        </v-btn>

                        <v-btn text @click="dialog_transport = false">
                          Thoát
                        </v-btn>
                      </v-stepper-content>

                      <v-stepper-content step="2">
                        <v-card
                          class="mb-12"
                          color="white lighten-1"
                          height="200px"
                        >
                            <v-card-title class="text-h5">Hóa đơn phải  thanh toán  </v-card-title>
                            <h3 style="margin:10px">Số tiền thanh toán : ${{totalPr}} </h3>
                            <h3 style="margin:10px"> Số đơn hàng : {{totalOrder}} </h3>
                        </v-card>
                        <v-btn
                          color="primary"
                          @click="e1 = 3,billClick()"
                        >
                          Tiếp tục
                        </v-btn>

                        <v-btn text @click="dialog_transport = false">
                          Thoát 
                        </v-btn>
                      </v-stepper-content>

                      <v-stepper-content step="3">
                        <v-card
                          class="mb-12"
                          color="white lighten-1"
                          height="200px"
                        >
                          <v-card-title class="text-h5">Thanh toán hoàn tất  </v-card-title>
                        </v-card>

                        <v-btn
                          color="primary"
                          @click="e1 = 1,DeleteAllCart(),SendGmail(),dialog_transport = false"
                        >
                          Tiếp tục
                        </v-btn>

                        <v-btn text @click="dialog_transport = false">
                          Thoát
                        </v-btn>
                      </v-stepper-content>
                    </v-stepper-items>
                  </v-stepper>
                </template>
            </div>
          
          </v-dialog>
  </v-row>
    </v-col>         
    <v-col cols="1">
         <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Bạn có chắc  muốn xóa ?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">Đóng</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogBill" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Bạn muốn thanh toán hóa đơn: </v-card-title>
            <h3 style="margin:10px">Số tiền thanh toán : ${{totalPr}} </h3>
            <h3 style="margin:10px"> Số đơn hàng : {{totalOrder}} </h3>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="dialogBill=false">Đóng</v-btn>
              <v-dialog 
                transition="dialog-bottom-transition"
                max-width="600"
              >
              <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                v-on="on"
                color="blue darken-1" text @click="billClick()">Thanh toán </v-btn>
            </template>
              </v-dialog>
             
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
    </v-col>
 </v-row>

</template>
<script>
import axios from 'axios' 
  export default {
    data: () => {
        return {
            registerBase:true,
            end:true,
            e1: 1,
            fullname:'',
            email:'',
            address:'',
            phonenumber:'',
            dialog_transport:false,
            cart: [],
            dialog_payment:false,
            dialogBill:false,
            dialogDelete: false,
            totalPr:0,
            totalOrder:0,
            bill:[],
            editedIndex: -1,
      }
      
    },
    async mounted() {
        this.LoadItens()
    },
    methods: {
      SendGmail(){
        console.log(this.email)
          axios.get(`http://localhost:5000/api/sendgmail/${this.email}`)
          .then(success=>{
            console.log(success)
            
          })
          .catch(err=>{
            console.log(err)})
      },
      showTransport(){
        this.dialog_transport = true
      },
      async RegisterTransport(){
          if(this.fullname == '' || this.email == '' || this.address == '' || this.phonenumber == ''){
             this.registerBase = false
             this.e1 = 1
             alert(" thông tin nhận hàng không được để trống ")
          }
          else{
            axios.post(`http://localhost:5000/api/transport/${this.fullname}/${this.email}/${this.address}/${this.phonenumber}`)
            .then(success=>{
              console.log(success)
            
            })
            .catch(err=>{
              console.log(err)
            })
            this.registerBase = true
          }

      },
      async DeleteAllCart(){
          axios.delete(`http://localhost:5000/api/cart`)
          .then(success=>{
            console.log(success)
          })
          .catch(err=>{
            console.log(err)
      })
      },
      async LoadItens(){
        // API URL must be constant, should be in config.
        const API_URL = "http://localhost:5000/api/cart";
        // If the fetch fails,
        try {
          // Fetch with custom headers.
          const cart = await fetch(API_URL, { "method":"GET" })
            .then(response => response.json())
            .then(data => this.cart = data
            );
          // Then set the user object to data
          this.cart = cart;
          var totalPriceCart = 0
          this.cart.forEach(i => {
              totalPriceCart += parseInt(i.totalprice)*(i.totalquantity)
              
          });
          this.totalPr = totalPriceCart
          this.totalOrder = this.cart.length
          } catch (err) {
        console.error(err);
    }
    },
    editedItem(item){
      //var totalpriceCart = parseInt(item.totalquantity) * parseInt(item.totalprice)
      axios.put(`http://localhost:5000/api/cart/${item._id}/${item.totalquantity}/${item.totalprice}/${item.booksId}/${item.bookName}/${item.bookImg}`)
      .then(success=>{
        console.log(success)
      })
      .catch(err=>{
         console.log(err)
      })
    },
     deleteItemConfirm () {
        this.cart.splice(this.editedIndex, 1)
        this.close()
      },  
      close () {
        this.dialogDelete = false
      },
    deleteItem(item) {
        this.dialogDelete = true
        if(this.dialogDelete == true){
          axios.delete(`http://localhost:5000/api/cart/${item._id}`)
        }
      },
      billClick(){
        if(parseInt(this.totalOrder) < 1){
              this.end = false
              this.e1 = 2
              alert("Số đơn không đc nhỏ hơn 1")
        }else{
          axios.post(`http://localhost:5000/api/bill/${this.totalOrder}/${this.totalPr}`)
          .then(data=>{
              this.bill = data
          })
          this.end = true
        }
      },
  }
  }
</script>