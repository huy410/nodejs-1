
<template>
  <v-row>
    <v-col cols="1">
    </v-col>
    <v-col cols="10">   
   <br>
    <h2 style="text-align: center;"> FaQs </h2>
    <hr><br>
    
    <div >
      <v-expansion-panels>
        <v-expansion-panel
         v-for="(item,i) in faq" v-bind:key="i"
        >
          <v-expansion-panel-header>
            {{item.name}}
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            {{item.describe}}
          </v-expansion-panel-content>
        </v-expansion-panel>
    </v-expansion-panels>
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
        faq:[]
      }
    },
     async mounted() {
       this.GetFaq();
   },
   computed:{
     
    
   },
   methods: {
     async GetFaq(){
       // API URL must be constant, should be in config.
        const API_URL = "http://localhost:5000/api/faq";
        // If the fetch fails,
        try {
          // Fetch with custom headers.
          const faq = await fetch(API_URL, { "method":"GET" })
            .then(response => response.json())
            .then(data => this.faq = data
            );
          // Then set the user object to data
          this.faq = faq;
        } catch (err) {
          console.error(err);
        }
     },
    
   }
  }
</script>