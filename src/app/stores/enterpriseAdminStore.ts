import { makeAutoObservable, runInAction } from "mobx";
import { toast } from "react-toastify";
import { history } from "../..";
import agent from "../api/agent";
import { UserAtEstablishment, UserAtEstablishmentCreate } from "../models/user";

export default class EnterpriseAdminStore {
    loading: boolean = false;
    usersAtEstablishment: UserAtEstablishment[] = [];
    selectedRoles: string[] = [];
    errorMessages: string[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    setLoading = (value: boolean) => {
        this.loading = value;
    }

    getUsersAtCurrentEstablishment = async () => {
        try {
            this.setLoading(true);
            const users = await agent.UserRequests.usersAtCurrentEstablishment();
            runInAction(() => this.usersAtEstablishment = users);
            this.setLoading(false);
        }catch(error) {
            console.log(error);
        }
    }

    addRole = (role: string) => {
        if(this.selectedRoles.includes(role))
            return;
        this.selectedRoles.push(role);
    }

    craeteUser = async (user: UserAtEstablishmentCreate) => {
        try {
            this.setLoading(true);
            let success = true;
            let errorMessages: string[] = [];
            await agent.UserRequests.create(user).catch(error => {
                errorMessages = error.response.data.errors;
                success = false;
            });
            runInAction(() => this.errorMessages = errorMessages);
            this.setLoading(false);
            if(success) {
                toast.success("Новый пользователь успешно создан");
                history.push('/enterprise/employees');
            } else {
                toast.error("Ошибка сервера! Пользователь не создан.")
            }
        } catch (error) {
            console.log(error);
        }
    }
}