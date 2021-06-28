import { TestBed } from '@angular/core/testing';
import { CognitoUserPool } from 'amazon-cognito-identity-js';

import { AuthenticationService } from './authentication.service';

describe('AuthenticationService', () => {
  let service: AuthenticationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthenticationService);
    service.setUserPool(new CognitoUserPool({
      UserPoolId: 'ap-southeast-1_7sj29bIno',
      ClientId: '766cqbgp6qg9qrqkgjl7384lfk'
    }));
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login success', () => {
    service.signIn('test', '1234').subscribe(o => {
      expect(o);
    });
  });
});
