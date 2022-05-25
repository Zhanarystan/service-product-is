import { makeAutoObservable, runInAction } from "mobx"
import { Establishment, EstablishmentCreateValues, EstablishmentWithList } from "../models/establishment";
import agent from "../api/agent";

export default class EstablishmentStore {
    establishmentList: Establishment[] = [];
    establishment: EstablishmentWithList | undefined = undefined;
    isEstablishmentCreated: boolean = false;
    loadingInitial: boolean = false;

    constructor() {
        makeAutoObservable(this)
    }

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    setEstablishmentCreated = (val: boolean) => {
        this.isEstablishmentCreated = val
    }  

    getEstablishmentList = async () => {
        try{
            const establishments = await agent.EstablishmentRequests.list();
            runInAction(() => this.establishmentList = establishments);
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
}