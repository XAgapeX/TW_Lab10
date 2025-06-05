import App from './app';
import IndexController from "./controllers/index.controller";
import DataController from "./controllers/data.controllers";
import UserController from "./controllers/user.controller";
import TokenService from './modules/services/token.service';

const app: App = new App([
    new UserController(),
    new DataController(),
    new IndexController()
]);

app.listen();

const tokenService = new TokenService();

setInterval(async () => {
    await tokenService.removeExpiredTokens();
}, 60 * 60 * 1000);

