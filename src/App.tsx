import React, { useEffect } from 'react';
import { useStore } from './app/stores/store';
import { observer } from 'mobx-react-lite';
import LoginPage from './features/login/LoginPage';
import { Redirect, Route, Switch } from 'react-router-dom';
import { history } from './index';
import Sidebar from './features/layouts/Sidebar';
import Navbar from './features/layouts/Navbar';
import ManufacturerListPage from './features/admin/manufacturer/ManufacturerListPage';
import EstablishmentListPage from './features/admin/establishment/EstablishmentListPage';
import EstablishmentCreatePage from './features/admin/establishment/EstablishmentCreatePage';
import EstablishmentEditPage from './features/admin/establishment/edit/EstablishmentEditPage';
import CashRegister from './features/enterprise/cashRegister/CashRegister';
import NotFound from './features/errors/NotFound';
import Loading from './features/common/Loading';
import EmployeesPage from './features/enterprise/employees/EmployeesPage';
import EmployeeCreateEditPage from './features/enterprise/employees/EmployeeCreateEditPage';
import { ToastContainer } from 'react-toastify';


function App() {
  const {userStore: {getUser ,user}, commonStore} = useStore();

  useEffect(() => {
    if(commonStore.token){
      getUser().finally(() => commonStore.setAppLoaded());
      console.log(commonStore.token);
    }else{
      commonStore.setAppLoaded();
      history.push('/login');
    }
  }, [commonStore, getUser, user]);

  return (
    <>
    {/* <p>{user?.token}</p> */}
     
      <Switch>
        <Route exact path='/login' component={LoginPage} />
        <Route
          path={'/error(.+)'}
          render={() => {
            if(!user)
              return <Loading/>
            return (
              <>
                <Navbar/>
                <Route exact path='/error/not-found' component={NotFound} /> 
              </>
            )
          }}
        />
        <Route
          path={'/enterprise(.+)'}
          render={() => {
            if(!user)
              return <Loading/>
            return (
              <>
                <Navbar/>
                <Route exact path='/enterprise/cash-register' render={() => {
                    if(!user.roles.includes("establishment_seller")) 
                      return <Redirect to={{pathname:'/error/not-found'}} />
                    return (
                      <CashRegister />
                    )
                  }} /> 
                <Route exact path='/enterprise/employees'
                  render={() => {
                    if(!user.roles.includes("establishment_admin")) 
                      return <Redirect to={{pathname:'/error/not-found'}} />
                    return (
                      <EmployeesPage/>
                    )
                  }}
                /> 
                <Route exact path='/enterprise/employees/create'
                  render={() => {
                    if(!user.roles.includes("establishment_admin")) 
                      return <Redirect to={{pathname:'/error/not-found'}} />
                    return (
                      <EmployeeCreateEditPage userId={0}/>
                    )
                  }}
                /> 
              </>
            )
          }}
        />
        <Route
          path={'/admin(.+)'}
          render={() => {
            if(!user)
              return <Loading/>
            return (
              <>
                {!user.roles.includes("system_admin") ? <Redirect to={{pathname: '/error/not-found'}} /> : 
                  <div className='row'>
                    <div className='col-2'>
                      <Sidebar />
                    </div>
                    <div className='col-9'>
                      <Navbar/>   
                      <Route exact path='/admin/establishments' component={EstablishmentListPage} />
                      <Route exact path='/admin/establishments/:id' component={EstablishmentEditPage} />
                      <Route exact path='/admin/establishments-create' component={EstablishmentCreatePage} />
                      <Route exact path='/admin/manufacturers' component={ManufacturerListPage} />
                    </div>  
                  </div>
                }
              </>
            )
          }}/>
      </Switch>
      <ToastContainer position="bottom-right"/>
    </>
  );
}

export default observer(App);
