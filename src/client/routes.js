import App from "./containers/app";
import Home from "./containers/home/home";
import AllUser from "./containers/users/allUser";
import NotFound from "./containers/notFound/notFound";
import CreateUser from "./containers/users/createUser";

export default [
    {
        component: App,
        routes: [
            {
                component: CreateUser,
                path: "/admin/users/create"
            },
            {
                component: AllUser,
                path: "/admin/users"
            },
            {
                component: Home,
                exact: true,
                path: "/admin"
            },
            {
                component: NotFound,
                path: "*"
            }
        ]
    }
]