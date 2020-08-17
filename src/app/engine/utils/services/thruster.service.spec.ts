import { TestBed } from '@angular/core/testing';

import { ThrusterService } from './thruster.service';

describe('ThrusterService', () => {
  let service: ThrusterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThrusterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
