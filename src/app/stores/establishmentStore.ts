import { makeAutoObservable, runInAction } from "mobx"
import { Establishment, EstablishmentCreateValues, EstablishmentWithList } from "../models/establishment";
import agent from "../api/agent";
import { store } from "./store";
import { toast } from "react-toastify";
import { history } from "../..";

export default class EstablishmentStore {
    establishmentList: Establishment[] = [];
    establishment: EstablishmentWithList | undefined = undefined;
    isEstablishmentCreated: boolean = false;
    loadingInitial: boolean = false;
    errorMessages: string[] = [];

    currentPage: number = 1;
    maxPage: number = 1;
    

    constructor() {
        makeAutoObservable(this)
    }

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    setEstablishmentCreated = (val: boolean) => {
        this.isEstablishmentCreated = val
    }  

    setCurrentPage = (value: number) => {
        if(value > this.maxPage || value < 1) {
            return;
        }
        this.currentPage = value;
    }

    getEstablishmentList = async () => {
        try{
            this.setLoadingInitial(true);
            const establishments = await agent.EstablishmentRequests.list();
            this.maxPage = Math.ceil(establishments.length / 10);
            runInAction(() => this.establishmentList = establishments);
            this.setLoadingInitial(false);
        }catch(error){
            console.log(error);
        }
    }

    getEstablishment = async (id: number): Promise<EstablishmentWithList> =>  {
        this.setLoadingInitial(true);
        try{
            const establishment = await agent.EstablishmentRequests.get(id);
            console.log(establishment);
            runInAction(() => this.establishment = establishment);
            this.setLoadingInitial(false);
            return establishment;
        }catch(error){
            console.log(error);
            return {} as EstablishmentWithList;
        }
    }

    createEstablishment = async(establishmentValues: EstablishmentCreateValues) => {
        try{
            const isCreated = await agent.EstablishmentRequests.create(establishmentValues);
            runInAction(() => this.isEstablishmentCreated = isCreated);
            return isCreated;
        }catch(error){
            console.log(error);
        }
    }

    updateEstablishment = async(id: number, establishmentValues: EstablishmentCreateValues) => {
        try {
            this.setLoadingInitial(true);
            let success = true;
            let errorMessages: string[] = [];
            await agent.EstablishmentRequests.updateEstablishment(id, establishmentValues)
                .catch(error => {
                    errorMessages = error.response.data.errors as string[];
                    success = false;
                })
            runInAction(() => this.errorMessages = errorMessages);
            this.setLoadingInitial(false);
            if(success) {
                toast.success("Заведение успешно обновлен");
            } else {
                toast.error("Ошибка сервера! Заведение не обновлен.")
            }
            
        } catch(error) {
            console.log(error);
        }
    }

    uploadPhoto = async (file: File) => {
        if(!store.userStore.user) return;
        this.setLoadingInitial(true);
        try {
            await agent.EstablishmentRequests.uploadPhoto(store.userStore.user.establishmentId!, file!)
                .then(response => {
                    runInAction(() => this.establishment = response.data as EstablishmentWithList);
                })
                .catch(err => {
                    toast.error(err.response.data.errors);
                });
            this.setLoadingInitial(false);
        } catch (error) {
            console.log(error);
        }
    }
}