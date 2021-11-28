import { NgModule } from '@angular/core';
import { ArtemisSharedModule } from 'app/shared/shared.module';
import { CourseStatisticsComponent } from 'app/overview/course-statistics/course-statistics.component';
import { ChartsModule } from 'ng2-charts';
import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { RouterModule, Routes } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CourseLearningGoalsComponent } from 'app/overview/course-learning-goals/course-learning-goals.component';
import { ArtemisLearningGoalsModule } from 'app/course/learning-goals/learning-goal.module';
import { ArtemisExerciseScoresChartModule } from 'app/overview/visualizations/exercise-scores-chart.module';

const routes: Routes = [
    {
        path: '',
        component: CourseStatisticsComponent,
        data: {
            authorities: [Authority.USER],
            pageTitle: 'overview.statistics',
        },
        canActivate: [UserRouteAccessService],
    },
];

@NgModule({
    imports: [ArtemisLearningGoalsModule, ArtemisExerciseScoresChartModule, ArtemisSharedModule, ChartsModule, FontAwesomeModule, RouterModule.forChild(routes)],
    declarations: [CourseStatisticsComponent, CourseLearningGoalsComponent],
})
export class CourseStatisticsModule {}
