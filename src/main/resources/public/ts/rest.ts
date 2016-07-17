console.log("running module: rest.js");

/*
Eventually ALL calls to server (rest/json) will go thru this module, but for now all I have done
is implement this one prototype (login call) of how it will work, and be typesafe.

Once the transition is done the util.json function will be deleted and only the util.jsonGeneric
function will remain.
*/
namespace m64 {
    export namespace rest {
        export let login = function(param: json.LoginRequest, successFunc: (response: json.LoginResponse) => any) : any {
            return util.jsonGeneric<json.LoginResponse>("login", param, successFunc);
        }
    }
}
