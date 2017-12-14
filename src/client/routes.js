import App from "./containers/app";
import Home from "./containers/home/home";
import AllUser from "./containers/users/allUser";
import NotFound from "./containers/notFound/notFound";
import CreateUser from "./containers/users/createUser";
import Redirector from "./components/redirector";

export default [
    {
        component: App,
        routes: [
            {
                component: Home,
                exact: true,
                path: "/admin"
            },
            {
                component: CreateUser,
                exact: true,
                path: "/admin/users/create"
            },
            {
                component: Redirector,
                exact: true,
                redirect: "/admin/users/1",
                path: "/admin/users"
            },
            {
                component: AllUser,
                path: "/admin/users/:page"
            },
            {
                component: NotFound,
                path: "*"
            }
        ]
    }
]