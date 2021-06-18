import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { instructorExerciseDashboardRoute } from './instructor-exercise-dashboard.route';
import { InstructorExerciseDashboardComponent } from './instructor-exercise-dashboard.component';
import { MomentModule } from 'ngx-moment';
import { ClipboardModule } from 'ngx-clipboard';
import { ChartsModule } from 'ng2-charts';
import { ArtemisSidePanelModule } from 'app/shared/side-panel/side-panel.module';
import { ArtemisTutorLeaderboardModule } from 'app/shared/dashboards/tutor-leaderboard/tutor-leaderboard.module';
import { SharedModule } from 'app/shared/shared.module';
import { ArtemisHeaderExercisePageWithDetailsModule } from 'app/exercises/shared/exercise-headers/exercise-headers.module';
import { ArtemisInstructorCourseStatsDashboardModule } from 'app/course/dashboards/instructor-course-dashboard/instructor-course-dashboard.module';

const ENTITY_STATES = instructorExerciseDashboardRoute;

@NgModule({
    imports: [
        SharedModule,
        MomentModule,
        ClipboardModule,
        RouterModule.forChild(ENTITY_STATES),
        ChartsModule,
        ArtemisInstructorCourseStatsDashboardModule,
        ArtemisHeaderExercisePageWithDetailsModule,
        ArtemisSidePanelModule,
        ArtemisTutorLeaderboardModule,
    ],
    declarations: [InstructorExerciseDashboardComponent],
})
export class ArtemisInstructorExerciseStatsDashboardModule {}
