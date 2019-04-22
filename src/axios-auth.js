import axios from 'axios'

const instance = axios.create({
    baseURL: 'https://axios-vue-b6916.firebaseio.com'
});

instance.defaults.headers.common['SOMETHING'] = 'something'

export default instance;