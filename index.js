
const core = require('@actions/core')
const axios = require('axios')
const github = require('@actions/github')

var dateDeploy = null
async function run (){
    try{
        const domain = core.getInput('domain')
        const basic_auth = core.getInput('basic-auth')
        if(domain && basic_auth){        
            let serviceDesk = await getDataIssue(domain, basic_auth)
            if(serviceDesk != null){
                await getDateDeploy(domain, serviceDesk,basic_auth)       
                await validationDateDeploy()
            }else{
                core.setFailed("Não foi estabelecida data para deploy para essa GMUD!")
                return
            }
        }else{
            core.setFailed("O parâmetro domain ou basic_auth é inválido!")
        }
    }catch(error){
        core.setFailed("Parâmetros inválidos")
    }
}

async function getDataIssue(domain,  basic_auth){
    try{
            let titlePR = github.context.payload.pull_request.title
            let keyJira = titlePR.split("(").pop().split(")")[0]
            return  axios.get( `https://${domain}.atlassian.net/rest/api/3/issue/${keyJira}`, {
                headers: {
                    Authorization: basic_auth,
                }
            }).then((response)=>{
                if(!Object.keys(response.data.fields.issuelinks).length == 0){
                    dateDeploy = response.data.fields.customfield_10476
                    return response.data.fields.issuelinks[0].outwardIssue.key       
                }
                return null
            }).catch((error)=>{        
                core.setFailed("Erro ao buscar data de deploy", error)
            })
    }catch(error){
        core.setFailed("Essa action só funcionará em uma pull request!")
    }
}

async function getDateDeploy(domain, serviceDesk ,basic_auth){
    try{
        await axios.get(`https://${domain}.atlassian.net/rest/api/3/issue/${serviceDesk}`, {
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
        dateDeploy = new Date(dateDeploy)
        if(dateNow <= dateDeploy){
            core.setOutput("result", "Data do deploy é igual a data atual")    
        }else {
            core.setFailed("Data de deploy não está correta")
        }
    }catch(error){
        core.setFailed("Erro ao validar data de deploy")
    }
}

run()