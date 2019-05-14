<template>
  <div id="dashboard">
    <h1>That's the dashboard!</h1>
    <p>You should only get here if you're authenticated!</p>
    <p v-for="email in emailsFromStateCom">User email is: {{email}}</p>
    <!--{{userEmails}}-->
    <!--{{emailsFromStateCom}}-->
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  export default {
    data() {
      return {
        UserIsNotLogged: 'You are not logged in',
        // user: ''
      }
    },
    created(){
        console.log('dispatch fetchuser');
        this.$store.dispatch('fetchUser');
//        this.userEmails = this.$store.state.userEmails;
    },
    computed: {
//      ...mapState('userEmails'),
      emailsFromStateCom(){
          console.log('computed', (this.UserIsNotLogged ? false : this.$store.getters.emailsFromState));
          console.log('computed', this.UserIsNotLogged);
          return this.$store.getters.emailsFromState;
      },

      emailsFromState () {
            console.log('computed');
//            this.userEmails = this.$store.state.userEmails;
//            return this.$store.getters
      }
    }
}

</script>
<style scoped>
  h1, p {
    text-align: center;
  }

  p {
    color: red;
  }
</style>