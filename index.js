
const core = require('@actions/core')
const axios = require('axios')
const github = require('@actions/github')

var deployDate = null
async function run (){
    if(isBot(github))
        return

    try{
        const domain = core.getInput('domain')
        const basic_auth = core.getInput('basic-auth')
        if(domain && basic_auth){    
            if(isHotfix()){
                core.setOutput("result", "Aprovação realizada por mudança hotfix!")    
                return true
            }
            
            const serviceDesk = await getDataIssue(domain, basic_auth)
            if(serviceDesk != null){
                await getdeployDate(domain, serviceDesk,basic_auth)       
                await validationdeployDate(serviceDesk)
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

function isHotfix(){
    try{
        if (github.context.payload.hasOwnProperty("pull_request") &&
            github.context.payload.pull_request.hasOwnProperty("title")){
            let titlePR = github.context.payload.pull_request.title
            let hotfixDefault =  /hotfix:[\s\S]+|hotfix\(.+\):[\s\S]+|\(hotfix\)+\:.*/
            return hotfixDefault.test(titlePR) ? true : false
        }
        return false
    }catch{
        core.setFailed("Essa action só funcionará em uma pull request!")
        return false
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
            }).then(async (response)=>{
                if(!Object.keys(response.data.fields.issuelinks).length == 0){
                    deployDate = response.data.fields.customfield_10476
                    return await findPtech(response.data.fields.issuelinks )      
                }
                return null
            }).catch((error)=>{        
                core.setFailed("Erro ao buscar data de deploy", error)
            })
    }catch(error){
        core.setFailed("Essa action só funcionará em uma pull request!")
    }
}

async function findPtech(issue_keys){
    for (let index in issue_keys){
        if(isPtech(issue_keys[index])){
            return issue_keys[index].outwardIssue.key
        }
    }
}

function isPtech(index){
    if (!Object.hasOwnProperty.bind(index)('outwardIssue')){
        return false
    }
    if (!Object.hasOwnProperty.bind(index.outwardIssue)('key')){
        return false
    }

    if (index.outwardIssue.key.split('-')[0] != 'PTECH'){
        return false
    }    
   
    return true
}

async function getdeployDate(domain, serviceDesk ,basic_auth){
    try{
        await axios.get(`https://${domain}.atlassian.net/rest/api/3/issue/${serviceDesk}`, {
            headers: {
                Authorization: basic_auth,
            }
        }).then(function(response){            
            deployDate = response.data.fields.customfield_10476
        })
    }catch(error){        
        core.setFailed("Erro ao buscar data de deploy")
    }
}

async function validationdeployDate(serviceDesk){
    try{
        if(deployDate == null){
            core.setFailed(`A data de deploy ainda não foi definida na GMUD ${serviceDesk}!`)
        }

        const dateNow = new Date()
        deployDate = new Date(deployDate)
        let dateInterval = new Date(deployDate)
        dateInterval.setHours(dateInterval.getHours()+3)
        if(dateNow >= deployDate && dateNow <= dateInterval){
            core.setOutput("result", "Data do deploy é igual a data atual")    
        }else {
            core.setFailed("Data de deploy não está correta")
        }
    }catch(error){
        core.setFailed("Erro ao validar data de deploy")
    }
}

function isBot(github){
    if(!validateObjectLoginSender(github)){
        return false
    }

    const loginSender = github.context.payload.sender.login

    if (loginSender.includes("[bot]")){
        core.setFailed(`Essa ação foi executada pelo bot ${loginSender} e não irá gerar GMUD!`)
        return true
    }
    
}

function validateObjectLoginSender(github){
    if (!github.hasOwnProperty('context'))
        return false

    if (!github.context.hasOwnProperty('payload'))
        return false

    if (!github.context.payload.hasOwnProperty('sender'))
        return false
        
    if (!github.context.payload.sender.hasOwnProperty('login'))
        return false

    return true
}

run()