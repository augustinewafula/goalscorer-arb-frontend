<template>
  <div>
    <notifications></notifications>
    <router-view :key="$route.fullPath"></router-view>
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    methods: {
      disableRTL() {
        if (!this.$rtl.isRTL) {
          this.$rtl.disableRTL();
        }
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

<style lang="scss"></style>
