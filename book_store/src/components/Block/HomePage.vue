<template>
  <v-app id="inspire">
    <v-app-bar
      app
      color="white"
      flat
    >
      <v-container class="py-0 fill-height">
        <v-avatar
          class="mr-10"
          color="grey darken-1"
          size="32"
        ></v-avatar>
        <div v-for="link in links"
          :key="link"
          :href="link.href"
          >
          <router-link
           :to="link.href"
           style="text-decoration: none; color: inherit;"
           >
           <v-tabs
           align-with-title
           >
             <v-tab
              color="white"
            >
              {{ link.text }}
            </v-tab>
           </v-tabs>
           
         </router-link>
        </div>
        <v-spacer></v-spacer>

        <v-responsive max-width="260">
          <v-text-field
            dense
            flat
            hide-details
            rounded
            solo-inverted
          ></v-text-field>
        </v-responsive>
      </v-container>
    </v-app-bar>

    <v-main class="grey lighten-3">
     
    </v-main>
  </v-app>
</template>

<script>
  export default {
    data: () => ({
      links: [
        {
          text:'Admin',
          href:'/home'
        },
        {
          text:'Product',
          href:'/'
        },
        {
          text:'Category',
          href:'/category'
        },
        {
          text:'User',
          href:'/'
        }
        
      ],
    }),
  }
</script>