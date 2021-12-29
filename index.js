
const core = require('@actions/core')
const axios = require('axios')
var dateDeploy = null
async function run (){
    try{
        const url = core.getInput('url-jira')
        const basic_auth = core.getInput('basic-auth')
        if(url && basic_auth){        
            await getDateDeploy(url, basic_auth)            
            await validationDateDeploy()
        }else{
            core.setFailed("invalid url or basic_auth")
        }
    }catch(error){
        core.setFailed("Parâmetros inválidos")
    }
    
}

async function getDateDeploy(url, basic_auth){
    try{
        await axios.get(url, {
            headers: {
                Authorization: basic_auth,
            }
        }).then(function(response){            
            dateDeploy = response.data.fields.customfield_10476            
        })
    }catch(error){        
        core.setFailed("Erro ao buscar data de deploy")
    }
}



 async function validationDateDeploy(){
    try{
        let dateNow = new Date()
        dateDeploy = new Date(dateDeploy).toLocaleDateString('pt-BR', {
            hour: '2-digit'
        })
        dateNow = new Date(dateNow).toLocaleDateString('pt-BR', {
            hour: '2-digit'
        })

        if (dateNow == dateDeploy) {       
            core.setOutput("result", "Data do deploy é igual a data atual")    
        } else {
            core.setFailed("Data de deploy não está correta")
        }
    }catch(error){
        core.setFailed("Erro ao validar data de deploy")
    }
}

run()