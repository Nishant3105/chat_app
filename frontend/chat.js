document.getElementById('send').addEventListener('submit',sendMessage)

async function sendMessage(e){
    try{
        e.preventDefault()
        const message=document.getElementById('inpsend').value
        console.log(message)
        const token=localStorage.getItem('token')
        const res=await axios.post('http://localhost:3000/chat/sendmsg',{message:message}, {headers: {'Authorization':token}})
    }
    catch(err){
        console.log(err)
    }
}