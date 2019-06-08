<template>
  <div id="signup">
    <div class="signup-form">
      <form @submit.prevent="onSubmit">
        <div class="input" :class="{invalid: $v.email.$error}" >
          <label for="email">Mail</label>
          <input
                  type="email"
                  id="email"
                  v-model="email"
                  @blur="$v.email.$touch()">
          <!--<div>{{$v.email.required}}</div>-->
          <p v-if="!$v.email.email">Please check if email is valid</p>
          <p v-if="!$v.email.required">The field must not be empty</p>
        </div>
        <div class="input" :class="{invalid: $v.age.$error}">
          <label for="age">Your Age</label>
          <input
                  type="number"h
                  id="age"
                  v-model="age"
                  @blur="$v.age.$touch()">

          <p v-if="$v.age.$error">Minimum age is {{$v.age.$params.between.min}}</p>
          <!--<div>{{$v.age.$error}}</div>-->
        </div>
        <div class="input" :class="{invalid: $v.password.$error}">
          <label for="password">Password</label>
          <input
                  type="password"
                  id="password"
                  v-model="password"
                  @blur="$v.password.$touch()">
          <p v-if="!$v.password.minLength">Password has to be minimum of  {{$v.password.$params.minLength.min}} characters</p>

          <!--<div>{{$v.password}}</div>-->
        </div>
        <div class="input" :class="{invalid: $v.confirmPassword.$error}">
          <label for="confirm-password">Confirm Password</label>
          <input
                  type="password"
                  id="confirm-password"
                  v-model="confirmPassword"
                  @blur="$v.confirmPassword.$touch()">
          <p v-if="$v.confirmPassword.$error">Password must match</p>
          <!--<div>{{$v.confirmPassword}}</div>-->
        </div>
        <div class="input">
          <label for="country">Country</label>
          <select id="country" v-model="country" >
            <option value="usa">USA</option>
            <option value="india">India</option>
            <option value="uk">UK</option>
            <option value="germany">Germany</option>
          </select>
        </div>
        <div class="hobbies">
          <h3>Add some Hobbies</h3>
          <button @click="onAddHobby" type="button">Add Hobby</button>
          <div class="hobby-list" >
            <div
                    class="input"
                    :class="{invalid: $v.hobbyInputs.$each[index].$error}"
                    v-for="(hobbyInput, index) in hobbyInputs"
                    :key="hobbyInput.id">
              <label :for="hobbyInput.id">Hobby #{{ index }}</label>
              <input
                      type="text"
                      :id="hobbyInput.id"
                      v-model="hobbyInput.value"
                      @blur="$v.hobbyInputs.$each[index].value.$touch()">
              <button @click="onDeleteHobby(hobbyInput.id)" type="button">X</button>
              <!--{{$v.hobbyInputs.$each[index].value.minLength}}-->
              <p v-if="!$v.hobbyInputs.$each[index].value.minLength">You should insert minimim of {{$v.hobbyInputs.$each[index].value.$params.minLength.min}} characters</p>
            </div>


          </div>
        </div>
        <div class="input inline" :class="{invalid: $v.terms.$error}">
          <input type="checkbox"
                 id="terms"
                 v-model="terms"
                 @change="$v.terms.$touch()" >
          <label for="terms">Accept Terms of Use</label>
          <!--<div>{{$v.terms}}</div>-->
          <!--<div>{{vm.country}}</div>-->

        </div>
        <div class="submit">
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import { required, email, numeric, between, minLength, sameAs, requiredUnless } from 'vuelidate/lib/validators'

  export default {
    data () {
      return {
        email: '',
        age: null,
        password: '',
        confirmPassword: '',
        country: 'usa',
        hobbyInputs: [],
        terms: false
      }
    },
    validations: {
      hobbyInputs:{
          minLength: minLength(2),
          $each: {
              value: {
                  minLength: minLength(4),
                  numeric,
                  required
              }
          }
      },
      password: {
          required,
          minLength: minLength(6)
      },
      confirmPassword: {
        sameAsPassword: sameAs('password')
      },
      email: {
          required,
          email
      },
      age: {
          required,
          numeric,
          between: between(18, 100)
      },
      terms: {
          required: requiredUnless((data => data.country === 'Germany'))
      }
    },
    methods: {
      onAddHobby () {
        const newHobby = {
          id: Math.random() * Math.random() * 1000,
          value: ''
        }
        this.hobbyInputs.push(newHobby)
      },
      onDeleteHobby (id) {
        this.hobbyInputs = this.hobbyInputs.filter(hobby => hobby.id !== id)
      },
      onSubmit () {
        const formData = {
          email: this.email,
          age: this.age,
          password: this.password,
          confirmPassword: this.confirmPassword,
          country: this.country,
          hobbies: this.hobbyInputs.map(hobby => hobby.value),
          terms: this.terms
        };
          console.log("1", formData);
          this.$store.dispatch('signup', formData);
          // this.$store.dispatch('login', formData);

      }
    }
  }
</script>


<style scoped>
  .signup-form {
    width: 400px;
    margin: 30px auto;
    border: 1px solid #eee;
    padding: 20px;
    box-shadow: 0 2px 3px #ccc;
  }

  .input {
    margin: 10px auto;
  }

  .input label {
    display: block;
    color: #4e4e4e;
    margin-bottom: 6px;
  }

  .input.inline label {
    display: inline;
  }

  .input.invalid input{
    border: solid red 1px;
    background: #ffe6e6;
  }
  .input.invalid label{
    color: red;
  }

  .input input {
    font: inherit;
    width: 100%;
    padding: 6px 12px;
    box-sizing: border-box;
    border: 1px solid #ccc;
  }

  .input.inline input {
    width: auto;
  }

  .input input:focus {
    outline: none;
    border: 1px solid #521751;
    background-color: #eee;
  }

  .input select {
    border: 1px solid #ccc;
    font: inherit;
  }

  .hobbies button {
    border: 1px solid #521751;
    background: #521751;
    color: white;
    padding: 6px;
    font: inherit;
    cursor: pointer;
  }

  .hobbies button:hover,
  .hobbies button:active {
    background-color: #8d4288;
  }

  .hobbies input {
    width: 90%;
  }

  .submit button {
    border: 1px solid #521751;
    color: #521751;
    padding: 10px 20px;
    font: inherit;
    cursor: pointer;
  }

  .submit button:hover,
  .submit button:active {
    background-color: #521751;
    color: white;
  }

  .submit button[disabled],
  .submit button[disabled]:hover,
  .submit button[disabled]:active {
    border: 1px solid #ccc;
    background-color: transparent;
    color: #ccc;
    cursor: not-allowed;
  }
</style>