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

//setInterval(()=>getMessages,1000)

window.addEventListener('DOMContentLoaded',getMessages)

async function getMessages(){
    try{
       const token=localStorage.getItem('token')
       let lastmsgid=localStorage.getItem('lastmsgid')?localStorage.getItem('lastmsgid'):1;

       const res=await axios.get(`http://localhost:3000/chat/getmsg/${lastmsgid}`,{headers: {'Authorization':token}})
       
       console.log(res.data)
       if(res.data.length>0){
           localStorage.setItem('lastmsgid',res.data[res.data.length-1].id)
        }
       
       let existingArray=JSON.parse(localStorage.getItem('message')) || []
       
       if(existingArray.length>=10){
        while(res.data.length>0){
            console.log(existingArray.shift())
            res.data.length--
        }
       }
      
       let mergedArray=existingArray.concat(res.data)
       

       localStorage.setItem('message',JSON.stringify(mergedArray))
       
       for(let i=0;i<mergedArray.length;i++){
        let name=mergedArray[i].name
        let msg=mergedArray[i].message  
            showOnScreen(name,msg)
       }
    }
    catch(err){
        console.log(err)
    }
}