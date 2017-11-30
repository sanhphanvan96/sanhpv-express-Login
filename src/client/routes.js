import App from "./containers/app";
import Home from "./containers/home/home";

export default [
    {
        component: App,
        routes: [
            {
                component: Home,
                exact: true,
                path: "/"
            }
        ]
    }
]