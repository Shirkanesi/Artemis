import { DatePipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { ArTEMiSSharedCommonModule, ArTEMiSSharedLibsModule, HasAnyAuthorityDirective, RemoveKeysPipe, SafeHtmlPipe, SafeUrlPipe, JhiDynamicTranslateDirective } from './';
import { FileUploaderService } from './http/file-uploader.service';
import { NgbDateMomentAdapter } from './util/datepicker-adapter';
import { HomeComponent } from 'app/home';

@NgModule({
    imports: [ArTEMiSSharedLibsModule, ArTEMiSSharedCommonModule],
    declarations: [HasAnyAuthorityDirective, SafeHtmlPipe, SafeUrlPipe, RemoveKeysPipe, JhiDynamicTranslateDirective],
    providers: [FileUploaderService, DatePipe, { provide: NgbDateAdapter, useClass: NgbDateMomentAdapter }],
    entryComponents: [],
    exports: [ArTEMiSSharedCommonModule, HasAnyAuthorityDirective, DatePipe, SafeHtmlPipe, SafeUrlPipe, RemoveKeysPipe, JhiDynamicTranslateDirective],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ArTEMiSSharedModule {
    static forRoot() {
        return {
            ngModule: ArTEMiSSharedModule
        };
    }
}
