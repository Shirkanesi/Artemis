import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts';
import { ExamScoresComponent } from './exam-scores.component';
import { SharedModule } from 'app/shared/shared.module';
import { MomentModule } from 'ngx-moment';
import { ArtemisExamScoresRoutingModule } from 'app/exam/exam-scores/exam-scores.route';
import { ArtemisDataTableModule } from 'app/shared/data-table/data-table.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ArtemisResultModule } from 'app/exercises/shared/result/result.module';
import { ArtemisSharedComponentModule } from 'app/shared/components/shared-component.module';
import { ExamScoresAverageScoresGraphComponent } from 'app/exam/exam-scores/exam-scores-average-scores-graph.component';

@NgModule({
    declarations: [ExamScoresComponent, ExamScoresAverageScoresGraphComponent],
    imports: [
        SharedModule,
        ChartsModule,
        MomentModule,
        ArtemisExamScoresRoutingModule,
        ArtemisDataTableModule,
        NgxDatatableModule,
        ArtemisResultModule,
        ArtemisSharedComponentModule,
    ],
})
export class ArtemisExamScoresModule {}
