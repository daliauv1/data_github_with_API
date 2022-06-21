const APIURL = 'https://api.github.com/users/'

const form = document.getElementById("form")
const search = document.getElementById("search")

//Obtener el widget del usuario 
const userCard=document.getElementById("usercard")


//Escuchar al evento del form -> submit

form.addEventListener("submit", (evt) => {
    evt.preventDefault();
    const username = search.value;
    getUserData(username);
    search.value = " ";
})

async function getUserData(username) {
    
    try {
        const userRequest = await fetch(APIURL + username);

        if(!userRequest.ok){
            throw new Error(userRequest.status); 
        }

        const userData = await userRequest.json();

        /*console.log(userData.name)
        console.log(userData)
        console.log(userData.name)
        console.log(userData.public_repos)*/
        
        if (userData.public_repos) {
            const repostRequest = await fetch(APIURL + username + "/repos");
            const repostData = await repostRequest.json();
            userData.repos=repostData;
            //console.log(repostData)
        }
        showUserData(userData);
    }catch (error) {
       showError(error.message);
    }
}

//Funcion para componer e hidratar el HTML del widget
function showUserData(userData){
    console.log(userData)
    let userContent=`<img src="${userData.avatar_url}"  alt="Avatar">
    <h1>${userData.name}</h1>
    <p>${userData.bio}</p>
    
    <section class="data">
        <ul>
            <li>${userData.followers} Followers</li>
            <li>${userData.following} Following</li>
            <li>${userData.public_repos}  Repos</li>
        </ul>
    </section>`
    if(userData.repos){
        userContent+=`<section class="repos">`
        
        userData.repos.forEach(repo => {
            userContent+=`<a href="${repo.html_url}">${repo.name}</a>`
        })
        userContent+=`</section>`;
        
    }

    userCard.innerHTML=userContent;
}
    


//Funcion para gestionar los errores
function showError(error){
     const errorContent=`<h1> Errorrrr ${error}</h1>`
     userCard.innerHTML=errorContent
}
