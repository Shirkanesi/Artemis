import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import * as chai from 'chai';
import * as sinonChai from 'sinon-chai';
import { SharedModule } from 'app/shared/shared.module';
import { ArtemisTestModule } from '../test.module';
import { DeleteDialogService } from 'app/shared/delete-dialog/delete-dialog.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as sinon from 'sinon';
import { TranslateModule } from '@ngx-translate/core';

import { ActionType, DeleteDialogData } from 'app/shared/delete-dialog/delete-dialog.model';
import { EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { JhiAlertService } from 'ng-jhipster';

chai.use(sinonChai);
const expect = chai.expect;

describe('Delete Dialog Service', () => {
    let service: DeleteDialogService;
    let modalService: NgbModal;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ArtemisTestModule, SharedModule, HttpClientTestingModule, TranslateModule.forRoot()],
            providers: [DeleteDialogService, JhiAlertService],
        });

        service = TestBed.inject(DeleteDialogService);
        modalService = TestBed.inject(NgbModal);
    });

    it('should open delete dialog', () => {
        expect(service.modalRef).to.be.undefined;
        const data: DeleteDialogData = {
            dialogError: new Observable<string>(),
            entityTitle: 'title',
            deleteQuestion: 'artemisApp.exercise.delete.question',
            deleteConfirmationText: 'artemisApp.exercise.delete.typeNameToConfirm',
            actionType: ActionType.Delete,
            delete: new EventEmitter<any>(),
        };
        const modalSpy = sinon.spy(modalService, 'open');
        service.openDeleteDialog(data);
        expect(modalSpy.callCount).to.be.equal(1);
        const args = modalSpy.getCall(0).args;
        expect(args[0].name).to.be.equal('DeleteDialogComponent');
        expect(args[1]).to.be.not.null;
    });
});
