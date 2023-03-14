document.getElementById('send').addEventListener('submit',sendMessage)

async function sendMessage(e){
    try{
        e.preventDefault()
        const message=document.getElementById('inpsend').value
        console.log(message)
        const token=localStorage.getItem('token')
        const res=await axios.post('http://localhost:3000/chat/sendmsg',{message:message}, {headers: {'Authorization':token}})
        showOnScreen(res.data.name,res.data.message)
    }
    catch(err){
        console.log(err)
    }
}

function showOnScreen(name,message){
    parentNode=document.querySelector('.container')
    childHTML=`<div class="your-message">${name} : ${message}</div>`
    parentNode.innerHTML=parentNode.innerHTML+childHTML
}

window.addEventListener('DOMContentLoaded',getMessages)

async function getMessages(){
    try{
       const token=localStorage.getItem('token')
       const res=await axios.get('http://localhost:3000/chat/getmsg',{headers: {'Authorization':token}})
       console.log(res.data)
       for(let i=0;i<res.data.length;i++){
        let name=res.data[i].name
        let msg=res.data[i].message  
            showOnScreen(name,msg)
       }
    }
    catch(err){
        console.log(err)
    }
}