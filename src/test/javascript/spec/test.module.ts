import { DatePipe, registerLocaleData } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ElementRef, NgModule, Renderer2 } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgbActiveModal, NgbModal, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';

import { JhiLanguageHelper } from 'app/core/language/language.helper';
import { AccountService } from 'app/core/auth/account.service';
import { MockAccountService } from './helpers/mocks/service/mock-account.service';
import { MockActivatedRoute } from './helpers/mocks/activated-route/mock-activated-route';
import { MockRouter } from './helpers/mocks/mock-router';
import { MockActiveModal } from './helpers/mocks/service/mock-active-modal.service';
import { MockEventManager } from './helpers/mocks/service/mock-event-manager.service';
import { CookieService } from 'ngx-cookie-service';
import { FaIconLibrary, FontAwesomeModule, FaIconComponent } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import locale from '@angular/common/locales/en';
import { fontAwesomeIcons } from 'app/core/icons/font-awesome-icons';
import * as moment from 'moment';
import { MockComponent } from 'ng-mocks';
import { MockAlertService } from './helpers/mocks/service/mock-alert.service';
import { EventManager } from 'app/core/util/event-manager.service';
import { MockLanguageHelper } from './helpers/mocks/service/mock-language.service';
import { AlertService } from 'app/core/util/alert.service';
import { TranslateService } from '@ngx-translate/core';

@NgModule({
    imports: [HttpClientTestingModule, FontAwesomeModule],
    providers: [
        DatePipe,
        CookieService,
        {
            provide: JhiLanguageHelper,
            useClass: MockLanguageHelper,
        },
        {
            provide: EventManager,
            useClass: MockEventManager,
        },
        {
            provide: NgbActiveModal,
            useClass: MockActiveModal,
        },
        {
            provide: ActivatedRoute,
            useValue: new MockActivatedRoute({ id: 123 }),
        },
        {
            provide: Router,
            useClass: MockRouter,
        },
        {
            provide: AccountService,
            useClass: MockAccountService,
        },
        {
            provide: AlertService,
            useClass: MockAlertService,
        },
        {
            provide: ElementRef,
            useValue: null,
        },
        {
            provide: Renderer2,
            useValue: null,
        },
        {
            provide: NgbModal,
            useValue: null,
        },
    ],
    declarations: [MockComponent(FaIconComponent)],
    exports: [MockComponent(FaIconComponent)],
})
export class ArtemisTestModule {
    constructor(iconLibrary: FaIconLibrary, dpConfig: NgbDatepickerConfig, translateService: TranslateService) {
        registerLocaleData(locale);
        iconLibrary.addIconPacks(fas);
        iconLibrary.addIcons(...fontAwesomeIcons);
        dpConfig.minDate = { year: moment().year() - 100, month: 1, day: 1 };
        translateService.setDefaultLang('en');
    }
}
