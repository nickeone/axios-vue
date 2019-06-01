import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import router from './router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    idToken: null,
    userId: null,
    userEmails: null
  },
  mutations: {
    authUser (state, userData){
      // console.log('authuser', userData.localId);
      // console.log('authuser', userData.idToken);
      state.idToken = userData.idToken;
      state.userId = userData.localId;
      router.push( {name: 'dashboard'});
    },
    storeEmailsToState(state, payloadEmails){
      console.log("payloademails", payloadEmails);
      state.userEmails = payloadEmails;
    },
    clearAuthData(state){
        state.idToken = null;
        state.userId = null;
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("expiresIngit");
        router.push( {name: 'signin'});
    }
  },
  actions: {
    setLogoutTimer({commit}, expirationTime){
        setTimeout(() => {
            commit('clearAuthData');
        }, expirationTime * 1000)
    },
    logout({commit}){
        commit('clearAuthData')
    },
    signup ({commit, dispatch}, authData) {
      // console.log('TEST123', commit);
      console.log('authData', authData);
      axios.post('https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyCEob_KA06qj-2oU-0d_BexcMmHb5eYqxw', {
        email: authData.email,
        password: authData.password,
        returnSecureToken: true
      })
          .then(res => {
            const now = new Date().getTime();
            const expirationDate = new Date(now + res.data.expiresIn * 1000);
            localStorage.setItem('token', res.data.idToken);
            localStorage.setItem('userId', res.data.localId);
            localStorage.setItem('expiresIn', expirationDate);
            commit('authUser',  res.data);
            dispatch('storeUserToFirebase', authData);
            dispatch('setLogoutTimer', res.data.expiresIn);

          })
          .catch(err => console.log(err))
    },
    login ({ commit, dispatch}, authData) {
      // commit('increment');
      axios.post('https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyCEob_KA06qj-2oU-0d_BexcMmHb5eYqxw', {
        email: authData.email,
        password: authData.password,
        returnSecureToken: true
      })
          .then(res => {
            console.log('res',res.data);
            commit('authUser',  res.data);
            dispatch('setLogoutTimer', res.data.expiresIn);
              const now = new Date().getTime();
              const expirationDate = new Date(now + res.data.expiresIn * 1000);
              localStorage.setItem('token', res.data.idToken);
              localStorage.setItem('userId', res.data.localId);
              localStorage.setItem('expiresIn', expirationDate);

          })
          .catch(err => console.log(err))
    },
    tryAutoLogin({commit}){

        const token = localStorage.getItem('token');
        console.log('res-nicu');
        const now = new Date();
        const expirationDate = localStorage.getItem('expiresIn');
        const userId = localStorage.getItem('userId');
        console.log('token',token);
        if(!token){
            return;
        }
        if(now >= expirationDate){
            return;
        }
        const resData = {idToken: token, localId: userId};
        console.log('res-nicu-2', resData);
        commit('authUser', resData)


    },
    storeUserToFirebase({commit, state}, userData){
        console.log('userDataAxiosPost', userData);
        console.log('userDataAxiosPost', state.idToken);
        if(!state.idToken){
          return
        }
        axios.post('https://axios-vue-b6916.firebaseio.com/users.json' + '?auth=' + state.idToken, userData)
            .then(res => console.log('storeusertofirebase', res))
            .catch(err => console.log('errStoreUserToFirebase', err))
    },
    fetchUser({commit, state}){
        if(!state.idToken){
            return
        }
        axios.get('https://axios-vue-b6916.firebaseio.com/users.json' + '?auth=' + state.idToken)
          .then( res => {
            console.log("2-dash", res);
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
            commit('storeEmailsToState', users);
          })
          .catch(err => console.log(err))
    }
  },
    getters: {
        emailsFromState (state) {
            return state.userEmails;
        },
        isAuth (state){
            // console.log((state.idToken !== null));
            return state.idToken !== null;
        }
    }
})