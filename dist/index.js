/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 450:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 645:
/***/ ((module) => {

module.exports = eval("require")("axios");


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {

const core = __nccwpck_require__(450)
const axios = __nccwpck_require__(645)
var dateDeploy = null
async function run (){
    try{
        const url = core.getInput('url-jira')
        const basic_auth = core.getInput('basic-auth')
        if(url && basic_auth){        
            await getDateDeploy(url, basic_auth)
            console.log("depois data deploy:", dateDeploy)
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
            hour: '2-digit',
            minute:'2-digit'
        })
        dateNow = new Date(dateNow).toLocaleDateString('pt-BR', {
            hour: '2-digit',
            minute:'2-digit'
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
})();

module.exports = __webpack_exports__;
/******/ })()
;