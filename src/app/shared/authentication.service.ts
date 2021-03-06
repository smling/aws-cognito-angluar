import { Injectable } from '@angular/core';
import { AuthenticationDetails, CognitoUser, CognitoUserAttribute, CognitoUserPool } from 'amazon-cognito-identity-js';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthenticationService {
  private userPool = new CognitoUserPool({
    UserPoolId: environment.poolConfig.UserPoolId,
    ClientId: environment.poolConfig.AppClientId
  });

  cognitoUser: any;

  constructor() { }

  setUserPool(userPool: CognitoUserPool) {
    this.userPool = userPool;    
  }

  register(email: string, password: string) {

    let attributeList: CognitoUserAttribute[];
    let validationData: CognitoUserAttribute[];

    return new Observable(observer => {
      this.userPool.signUp(email, password, attributeList, validationData, (err, result) => {
        if (err) {
          console.log("signUp error", err);
          observer.error(err);
        }

        this.cognitoUser = result?.user;
        console.log("signUp success", result);
        observer.next(result);
        observer.complete();
      });
    });
  }

  confirmAuthCode(code: string) {
    const user = {
      Username: this.cognitoUser.username,
      Pool: this.userPool
    };
    return new Observable(observer => {
      const cognitoUser = new CognitoUser(user);
      cognitoUser.confirmRegistration(code, true, function (err, result) {
        if (err) {
          console.log(err);
          observer.error(err);
        }
        console.log("confirmAuthCode() success", result);
        observer.next(result);
        observer.complete();
      });
    });
  }

  signIn(email: string, password: string) {

    const authenticationData = {
      Username: email,
      Password: password,
    };
    const authenticationDetails = new AuthenticationDetails(authenticationData);

    const userData = {
      Username: email,
      Pool: this.userPool
    };
    const cognitoUser = new CognitoUser(userData);

    return new Observable(observer => {

      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
          observer.next(result);
          observer.complete();
        },
        onFailure: function (err) {
          console.log(err);
          observer.error(err);
        },
      });
    });
  }

  isLoggedIn() {
    return this.userPool.getCurrentUser() != null;
  }

  getAuthenticatedUser() {
    // gets the current user from the local storage
    return this.userPool.getCurrentUser();
  }

  logOut() {
    this.getAuthenticatedUser()?.signOut();
    this.cognitoUser = null;
  }
}