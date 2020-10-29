import 'reflect-metadata';
import { Router } from 'express';
import { Injectable } from 'injection-js';

import { Roles } from '../../constants/roles';
import { asyncRouterErrorHandler } from '../../error';
import { validate } from '../../validation/validate.middleware';
import { AuthGuard } from '../auth/auth.middleware';
import { requiredId } from '../shared/base.validation';
import { UserController } from './user.controller';
import { createAdminUser, createUser, updateUser } from './user.validation';

@Injectable()
export class UserRouter {
    constructor(private userController: UserController, private authGuard: AuthGuard) { }

    get router(): Router {
        const user: Router = asyncRouterErrorHandler(Router());

        user.get('/paginate', this.authGuard.checkRoles([Roles.Admin]), this.userController.getUsers);
        //get user by Id
        user.get('/:id', this.authGuard.checkAuthenticated(), validate(requiredId), this.userController.get);
        //create user
        user.post('/', validate(createUser), this.userController.create);
        user.post('/admin', validate(createAdminUser), this.userController.createAdminUser);
        //update user by id
        user.put('/:id', this.authGuard.checkAuthenticated(), validate(updateUser), this.userController.update);
        //delete user by id
        user.delete('/:id', this.authGuard.checkAuthenticated(), validate(requiredId), this.userController.delete);

        return user;
    }
}