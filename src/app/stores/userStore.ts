import { makeAutoObservable, runInAction } from "mobx";
import { history } from "../..";
import agent from "../api/agent";
import { User, UserFormValues } from "../models/user";
import { store } from "./store";

export default class UserStore {
    user: User | null = null;

    constructor() {
        makeAutoObservable(this)
    }

    get isLoggedIn() {
        return !!this.user;
    }

    login = async (creds: UserFormValues) => {
        try{
            const user = await agent.Account.login(creds) as User;
            store.commonStore.setToken(user.token);
            runInAction(() => this.user = user);
            if(user.roles.includes('system_admin'))
                history.push('/admin');
            else
                history.push('/enterprise/cash-register');
        }catch(error){
            throw error;
        }
    }

    logout = () => {
        store.commonStore.setToken(null);
        window.localStorage.removeItem('jwt');
        this.user = null;
        history.push('/');
    }

    getUser = async () => {
        if(this.user == null) {
            try{
                const currentUser = await agent.Account.current();
                runInAction(() => this.user = currentUser);
                console.log(currentUser);
            }catch(error){
                console.log(error);
            }
        }
    }

    // setImage = (image: string) => {
    //     if(this.user) this.user.image = image;
    // }

    // setDisplayName = (name: string) => {
    //     if(this.user) this.user.displayName = name;   
    // }
}