<template>
  <div>
    <notifications></notifications>
    <div class="notifications">
      <span mode="in-out" classs="col-md-10">
        <div id="update-banner" v-show="showNofication" data-notify="container" role="alert" data-notify-position="top-center" class="alert open alert-with-icon bottom right alert-info" style="bottom: 20px;">
          <button type="button" @click="hideNotification()" aria-hidden="true" data-notify="dismiss" class="close col-xs-1"><i class="tim-icons icon-simple-remove"></i></button>
          <span data-notify="icon" class="alert-icon tim-icons icon-bell-55"></span>
            <div data-notify="message"><!----><!----><div>A new version of Goalscorer Arb is available</div> <div><button @click="reloadPage()" id="update-button" class="btn btn-sm btn-primary">Reload</button></div></div>
        </div>
      </span>
    </div>
    <router-view :key="$route.fullPath"></router-view>
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    data: () => ({  
        showNofication : false,
    }),
    methods: {
      disableRTL() {
        if (!this.$rtl.isRTL) {
          this.$rtl.disableRTL();
        }
      },
      hideNotification() {
        this.showNofication = false
      },
      reloadPage() {
        this.showNofication = false
        location.reload();
      },
      toggleNavOpen() {
        let root = document.getElementsByTagName('html')[0];
        root.classList.toggle('nav-open');
      }
    },
    mounted() {
      this.$watch('$route', this.disableRTL, { immediate: true });
      this.$watch('$sidebar.showSidebar', this.toggleNavOpen)
    },
    created(){
      axios.interceptors.response.use(response => {
        return response;
      }, error => {
        if (error.response.status === 401) {        
          localStorage.removeItem('token')   
          this.$router.push({path: '/login'})
        }
        return Promise.reject(error);
      });
    }
  };
</script>
<style>
.notifications .alert[data-notify="container"] {
    width: auto !important;
}
</style>
