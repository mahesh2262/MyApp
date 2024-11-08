import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AttachmentsPage } from './attachments.page';

describe('AttachmentsPage', () => {
  let component: AttachmentsPage;
  let fixture: ComponentFixture<AttachmentsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachmentsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
