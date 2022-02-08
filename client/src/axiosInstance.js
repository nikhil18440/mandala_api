import axios from "axios"

const token = JSON.parse(sessionStorage.getItem('token'))

  
export let instance = axios.create({
    baseURL: "/"
  })

if(token){
  instance.defaults.headers['token'] = "Bearer " + token
  console.log(instance.defaults.headers)
}
