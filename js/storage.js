var storage = {
    saveRememberMe(isRememberMe){
        localStorage.setItem("IS_REMEMBER_ME", isRememberMe);
    },
    getRememberMe(){
        var isRememberMeStr = localStorage.getItem("IS_REMEMBER_ME");
        if(isRememberMeStr == null){
            return true;
        }
        return JSON.parse(isRememberMeStr.toLowerCase());
    },
    setItem(key, value){
        if(this.getRememberMe()){
            return localStorage.setItem(key, value);
        }
        else{
            return sessionStorage.setItem(key, value);
        }
    },
    getItem(key){
        if(this.getRememberMe()){
            return localStorage.getItem(key);
        }
        else{
            return sessionStorage.getItem(key);
        }
    },
    removeItem(key){
        if(this.getRememberMe()){
            return localStorage.removeItem(key);
        }
        else{
            return sessionStorage.removeItem(key);
        }
    }
}
