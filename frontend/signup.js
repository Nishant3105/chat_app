
document.querySelector('form').addEventListener('submit',adduser)

async function adduser(e){
    e.preventDefault()
    const name=e.target.name.value
    const email=e.target.email.value
    const phone=e.target.phone.value
    const password=e.target.password.value
    const userDetails={
        name,
        email,
        phone,
        password
    }

    const res=await axios.post('http://localhost:3000/user/signup', userDetails)
    if(res.status<400){
        alert(res.data.message)
    }

}