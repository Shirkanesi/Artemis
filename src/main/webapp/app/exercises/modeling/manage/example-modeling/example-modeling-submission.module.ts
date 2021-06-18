import { NgModule } from '@angular/core';
import { MomentModule } from 'ngx-moment';
import { ClipboardModule } from 'ngx-clipboard';
import { ArtemisExampleModelingSubmissionRoutingModule } from 'app/exercises/modeling/manage/example-modeling/example-modeling-submission.route';
import { ExampleModelingSubmissionComponent } from 'app/exercises/modeling/manage/example-modeling/example-modeling-submission.component';
import { ArtemisModelingEditorModule } from 'app/exercises/modeling/shared/modeling-editor.module';
import { AssessmentInstructionsModule } from 'app/assessment/assessment-instructions/assessment-instructions.module';
import { SharedModule } from 'app/shared/shared.module';
import { ArtemisResultModule } from 'app/exercises/shared/result/result.module';
import { ModelingAssessmentModule } from 'app/exercises/modeling/assess/modeling-assessment.module';

@NgModule({
    imports: [
        SharedModule,
        ArtemisResultModule,
        ArtemisModelingEditorModule,
        ArtemisExampleModelingSubmissionRoutingModule,
        ModelingAssessmentModule,
        AssessmentInstructionsModule,
        ClipboardModule,
        MomentModule,
    ],
    declarations: [ExampleModelingSubmissionComponent],
})
export class ArtemisExampleModelingSubmissionModule {}
