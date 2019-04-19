<template>
  <div id="dashboard">
    <h1>That's the dashboard!</h1>
    <p>You should only get here if you're authenticated!</p>
    <p v-for="email in userEmails">User email is: {{email}}</p>
  </div>
</template>
<script>
  import axios from 'axios'
  export default {
    data() {
      return {
        userEmails: '',
        // user: ''
      }
    },
    created(){
      axios.get('https://axios-vue-b6916.firebaseio.com/users.json')
        .then( res => {
          // console.log("2-dash", res);
          const data = res.data;
          let users = [];
          // console.log('data', data);
          for (let key in data) {
            let user = data[key].email;
            console.log('user', user);
            users.push(user);
          }
          // console.log("users",users);
          console.log('test',users);
          this.userEmails = users;
          // this.email = "nicu";
        })
        .catch(err => console.log(err))
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