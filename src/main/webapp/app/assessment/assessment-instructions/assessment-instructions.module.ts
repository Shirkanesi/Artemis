import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'app/shared/shared.module';
import { ArtemisModelingEditorModule } from 'app/exercises/modeling/shared/modeling-editor.module';
import { ArtemisProgrammingExerciseInstructionsRenderModule } from 'app/exercises/programming/shared/instructions-render/programming-exercise-instructions-render.module';
import { ExpandableSectionComponent } from './expandable-section/expandable-section.component';
import { CollapsableAssessmentInstructionsComponent } from './collapsable-assessment-instructions/collapsable-assessment-instructions.component';
import { AssessmentInstructionsComponent } from './assessment-instructions/assessment-instructions.component';
import { ArtemisAssessmentSharedModule } from 'app/assessment/assessment-shared.module';
import { StructuredGradingInstructionsAssessmentLayoutComponent } from 'app/assessment/structured-grading-instructions-assessment-layout/structured-grading-instructions-assessment-layout.component';
import { ArtemisSharedComponentModule } from 'app/shared/components/shared-component.module';
import { ArtemisMarkdownModule } from 'app/shared/markdown.module';

@NgModule({
    imports: [
        CommonModule,
        NgbModule,
        SharedModule,
        ArtemisModelingEditorModule,
        ArtemisProgrammingExerciseInstructionsRenderModule,
        ArtemisAssessmentSharedModule,
        ArtemisSharedComponentModule,
        ArtemisMarkdownModule,
    ],
    declarations: [ExpandableSectionComponent, AssessmentInstructionsComponent, CollapsableAssessmentInstructionsComponent, StructuredGradingInstructionsAssessmentLayoutComponent],
    exports: [CollapsableAssessmentInstructionsComponent, ExpandableSectionComponent, StructuredGradingInstructionsAssessmentLayoutComponent, AssessmentInstructionsComponent],
})
export class AssessmentInstructionsModule {}
