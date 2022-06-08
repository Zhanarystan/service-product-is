import { createContext, useContext } from "react";
import AdminStore from "./adminStore";
import CashRegisterStore from "./cashRegisterStore";
import CommonStore from "./commonStore";
import EnterpriseAdminStore from "./enterpriseAdminStore";
import EstablishmentStore from "./establishmentStore";
import UserStore from "./userStore";

interface Store {
    establishmentStore: EstablishmentStore;
    commonStore: CommonStore;
    userStore: UserStore;
    cashRegisterStore: CashRegisterStore;
    enterpriseAdminStore: EnterpriseAdminStore;
    adminStore: AdminStore;
}

export const store: Store = {
    establishmentStore: new EstablishmentStore(),
    commonStore: new CommonStore(),
    userStore: new UserStore(),
    cashRegisterStore: new CashRegisterStore(),
    enterpriseAdminStore: new EnterpriseAdminStore(),
    adminStore: new AdminStore(),
}

export const StoreContext = createContext(store)

export function useStore() {
    return useContext(StoreContext)
}