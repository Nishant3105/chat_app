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
      if(res.status==200){
        window.location.href='./chat.html'
      }
    }
    catch(err){
       console.log(err)
    }
}