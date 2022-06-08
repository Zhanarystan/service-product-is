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
import { ToastContainer } from 'react-toastify';
import ProductsPage from './features/enterprise/products/ProductsPage';
import EstablishmentPage from './features/enterprise/establishment/EstablishmentPage';
import UserListPage from './features/admin/users/UserListPage';
import EmployeeCreatePage from './features/enterprise/employees/EmployeeCreatePage';
import UserCreatePage from './features/admin/users/UserCreatePage';
import UserEditPage from './features/admin/users/UserEditPage';
import ProductListPage from './features/admin/product/ProductListPage';
import ProductCreatePage from './features/admin/product/ProductCreatePage';
import ProductEditPage from './features/admin/product/ProductEditPage';
import ServiceListPage from './features/admin/service/ServiceListPage';
import ServiceCreatePage from './features/admin/service/ServiceCreatePage';
import ServiceEditPage from './features/admin/service/ServiceEditPage';
import ManufacturerCreatePage from './features/admin/manufacturer/ManufacturerCreatePage';
import ManufacturerEditPage from './features/admin/manufacturer/ManufacturerEditPage';
import ProductListToAddPage from './features/enterprise/productsToAdd/ProductListToAddPage';

function App() {
  const {userStore: {getUser ,user}, commonStore} = useStore();

  useEffect(() => {
    if(commonStore.token){
      getUser().finally(() => commonStore.setAppLoaded());
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
            if(!user.roles.includes("establishment_seller") && !user.roles.includes("establishment_seller")) 
              return <Redirect to={{pathname:'/error/not-found'}} />
            return (
              <>
                <Navbar/>
                <Route 
                  path={'/enterprise/admin(.+)'}
                  render={() => {
                    if(!user.roles.includes("establishment_admin")) 
                      return <Redirect to={{pathname:'/error/not-found'}} />
                    return (
                      <>
                        <Route exact path='/enterprise/admin/establishment' component={EstablishmentPage} />
                        <Route exact path='/enterprise/admin/employees' component={EmployeesPage} />
                        <Route exact path='/enterprise/admin/employees/create' component={EmployeeCreatePage}/>
                        <Route exact path='/enterprise/admin/products' component={ProductsPage}/>
                        <Route exact path='/enterprise/admin/products-to-add' component={ProductListToAddPage}/>
                      </>
                    )
                  }}
                  />
                <Route exact path='/enterprise/cash-register' component={CashRegister} /> 
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
                    <div className='col-9 mb-5'>
                      <Navbar/>   
                      <Route exact path='/admin/establishments' component={EstablishmentListPage} />
                      <Route exact path='/admin/establishments/:id' component={EstablishmentEditPage} />
                      <Route exact path='/admin/establishments-create' component={EstablishmentCreatePage} />
                      <Route exact path='/admin/manufacturers/:manufacturerId' component={ManufacturerEditPage} />
                      <Route exact path='/admin/manufacturers' component={ManufacturerListPage} />
                      <Route exact path='/admin/manufacturer-create' component={ManufacturerCreatePage} />
                      <Route exact path='/admin/users/:id' component={UserEditPage} />
                      <Route exact path='/admin/users' component={UserListPage} />
                      <Route exact path='/admin/user-create' component={UserCreatePage} />
                      <Route exact path='/admin/products/:productId' component={ProductEditPage} />
                      <Route exact path='/admin/products' component={ProductListPage} />
                      <Route exact path='/admin/product-create' component={ProductCreatePage} />
                      <Route exact path='/admin/services/:serviceId' component={ServiceEditPage} />
                      <Route exact path='/admin/services' component={ServiceListPage} />
                      <Route exact path='/admin/service-create' component={ServiceCreatePage} />
                    </div>  
                  </div>
                }
              </>
            )
          }}/>
        <Route 
          exact 
          path={'/'}
          render={() => {
            if(user && user.roles.includes("establishment_seller"))
              return <Redirect to={{pathname: '/enterprise/cash-register'}}/>
            else if(user && user.roles.includes("system_admin")) 
              return <Redirect to={{pathname: '/admin/establishments'}} />
          }}
        />
      </Switch>
      <ToastContainer position="bottom-right"/>
    </>
  );
}

export default observer(App);