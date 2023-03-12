document.querySelector('form').addEventListener('submit',userlogin)

async function userlogin(e){
    try{
      e.preventDefault()
      const email=e.target.email.value
      const password=e.target.password.value
      let logincreds={
        email,
        password
      }
      const res=await axios.post('http://localhost:3000/user/login', logincreds)
      localStorage.setItem('token',res.data.token)
    }
    catch(err){
       console.log(err)
    }
}