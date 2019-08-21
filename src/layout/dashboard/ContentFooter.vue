<template>
  <footer class="footer">
    <div class="container-fluid">
      <div class="copyright">
        © {{year}} made with <i class="tim-icons icon-heart-2"></i> for a better web. v{{version}}
      </div>
    </div>
  </footer>
</template>
<script>
  var APP_VERSION =  require('../../../package.json').version
  export default {
    data() {
      return {
        year: new Date().getFullYear(),
        version: APP_VERSION
      }
    }
  };
</script>
<style>
</style>
