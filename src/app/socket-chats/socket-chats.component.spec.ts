import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocketChatsComponent } from './socket-chats.component';

describe('SocketChatsComponent', () => {
  let component: SocketChatsComponent;
  let fixture: ComponentFixture<SocketChatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SocketChatsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SocketChatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
