document.getElementById('send').addEventListener('submit',sendMessage)

async function sendMessage(e){
    try{
        e.preventDefault()
        const message=document.getElementById('inpsend').value
        console.log(message)
        const token=localStorage.getItem('token')
        const gid=localStorage.getItem('groupid')
        const res=await axios.post('http://localhost:3000/chat/sendmsg',{message:message, gid:gid}, {headers: {'Authorization':token}})
        showOnScreen(res.data.name,res.data.message)
    }
    catch(err){
        console.log(err)
    }
}

function showOnScreen(name,message){
    parentNode=document.getElementById('message')
    childHTML=`<div class="your-message">${name} : ${message}</div>`
    parentNode.innerHTML=parentNode.innerHTML+childHTML
}

if(localStorage.getItem('groupid')==0){
    window.addEventListener('DOMContentLoaded',getMessages)
}
else{
    window.addEventListener('DOMContentLoaded',getGrpMessages)

}

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

       const res2=await axios.get(`http://localhost:3000/group/getgrp`,{headers: {'Authorization':token}})

       for(let i=0;i<res2.data.length;i++){
         showGroup(res2.data[i].groupId,res2.data[i].groupname)
       }

       //const res3=await axios.get(`http://localhost:3000/group/getuser`)

    }
    catch(err){
        console.log(err)
    }
}

async function getGrpMessages(){
    try{
       const token=localStorage.getItem('token')
       let gid=localStorage.getItem('groupid')

       const res=await axios.get(`http://localhost:3000/chat/getgrpmsg/${gid}`,{headers: {'Authorization':token}})
       
       console.log(res.data)
       
       
       for(let i=0;i<res.data.length;i++){
        let name=res.data[i].name
        let msg=res.data[i].message  
            showOnScreen(name,msg)
       }

       const res2=await axios.get(`http://localhost:3000/group/getgrp`,{headers: {'Authorization':token}})

       for(let i=0;i<res2.data.length;i++){
         showGroup(res2.data[i].groupId,res2.data[i].groupname)
       }

       //const res3=await axios.get(`http://localhost:3000/group/getuser`)

    }
    catch(err){
        console.log(err)
    }
}



document.getElementById('group').addEventListener('submit', createGroup)

async function createGroup(e){
    try{
        e.preventDefault()
        const grpname=document.getElementById('grpname').value
        const token=localStorage.getItem('token')
        const res=await axios.post('http://localhost:3000/group/createGroup',{name:grpname}, {headers: {'Authorization':token}})
        if(res.status===200){
            showGroup(res.data.id,res.data.name) 
        }
        
    }
    catch(err){
        console.log(err)
    }
}

function showGroup(id,name){
    try{
        const parent=document.getElementById('grps')
        const childHTML=`<p id='gid_${id}'>${name} <input type="email" id="email_${id}">
                         <button onclick="addUser(${id},'${name}')">Add User</button>
                         <button onclick="chat(${id})">Chat</button>
                         <button onclick="showgrpusers(${id})">Show Users</button>
                         <button onclick="deletegroup(${id})">Delete Group</button></p>`
        parent.innerHTML+=childHTML

    }
    catch(err){
        console.log(err)
    }
}

function chat(id){
   localStorage.setItem('groupid',id)
   document.getElementById('message').innerHTML=""
   document.getElementById('grps').innerHTML=""
   getGrpMessages()
}

async function showgrpusers(gid){
    try{
      const res=await axios.get(`http://localhost:3000/group/getuser/${gid}`)
      
      for(let i=0;i<res.data.length;i++){ 
        showGUsers(gid,res.data[i])
      }
      
    }
    catch(err){
        console.log(err)
    }
}

function showGUsers(gid,user){
    try{
       const parent=document.getElementById(`gid_${gid}`)
       const childHTML=`<li id="${user.userId}"> ${user.username} 
                        <button onclick="removeuserfromgrp(${gid},${user.userId})">Remove</button>
                        </li>`
       parent.innerHTML=parent.innerHTML+childHTML
    }
    catch(err){
        console.log(err)
    }
}

async function removeuserfromgrp(gid,uid){
    try{
       const token=localStorage.getItem('token')
       const res=await axios.delete(`http://localhost:3000/group/removeuser?groupid=${gid}&&userid=${uid}`,{headers: {'Authorization':token}})
       if(res.status==201){
         alert(res.data)
       }
       if(res.status==200){
         removeuserfromUI(gid,uid)
       }
    }
    catch(err){
       console.log(err)
    }
}

function removeuserfromUI(gid,uid){
    try{
      const parent=document.getElementById(`gid_${gid}`)
      const child=document.getElementById(uid)
      parent.removeChild(child)
    }
    catch(err){

    }
}

async function deletegroup(id){
    try{
       const token=localStorage.getItem('token')
       const res=await axios.delete(`http://localhost:3000/group/deletegroup/${id}`,{headers: {'Authorization':token}})
       if(res.status==200){
        removegrpfromscreen(id)
       }
    }
    catch(err){
        console.log(err)
    }
}

function removegrpfromscreen(id){
    try{
      const parent=document.getElementById('grps')
      const child=document.getElementById(`gid_${id}`)
      console.log(parent,'............',child)
      parent.removeChild(child)
    }
    catch(err){
        console.log(err)
    }
}

async function addUser(gid,gname){
   try{
     console.log(gid,gname)
     const token=localStorage.getItem('token')
     const ipt=document.getElementById(`email_${gid}`).value

     const res=await axios.post('http://localhost:3000/group/addusertogroup',{ipt,gid,gname})
     if(res.status===201){
        alert(res.data)
      }
    }
    catch(err){
        console.log(err)
   }
}

function showUsers(gid,users){
   try{
     const parent=document.getElementById(`gid_${gid}`)
     const childHTML=`<li id='${users.id}'>${users.name}</li>
                     <button onclick="deleteuserfromgroup(${users.id},${gid})">Delete</button>`
     parent.innerHTML=parent.innerHTML+childHTML

   }
   catch(err){
     console.log(err)
   }
}

async function addusertogroup(uid,gid){
    try{
        let userdetails={
            uid,
            gid
        }
        const users=await axios.post('http://localhost:3000/group/addusertogroup', userdetails)
    }
    catch(err){
        console.log(err)
    }
}

document.getElementById('exit').addEventListener('click',exit)

function exit(){
    localStorage.setItem('groupid',0)
    document.getElementById('message').innerHTML=""
    document.getElementById('grps').innerHTML=""
    getMessages()
}

document.getElementById('send2').addEventListener('submit',sendFile)

async function sendFile(e){
    e.preventDefault()
    const groupid=localStorage.getItem("groupid")
    const file=document.getElementById('file')
    const fileData=file.files[0];
    console.log(file)
    const formData=new FormData();
    formData.append('file',fileData);
    console.log(formData);

    const response=await axios.post("http://localhost:3000/media/sendmedia",{formData,groupid},{headers:{"authentication":token,'Content-Type':'multipart/form-data'}})
    console.log(response)
}