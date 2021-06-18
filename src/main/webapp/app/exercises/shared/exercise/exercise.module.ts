import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { ExerciseLtiConfigurationComponent } from 'app/exercises/shared/exercise/exercise-lti-configuration.component';
import { exercisePopupRoute } from 'app/exercises/shared/exercise/exercise.route';
import { FormsModule } from '@angular/forms';

const ENTITY_STATES = [...exercisePopupRoute];

@NgModule({
    imports: [SharedModule, RouterModule.forChild(ENTITY_STATES), FormsModule],
    declarations: [ExerciseLtiConfigurationComponent],
})
export class ArtemisExerciseModule {}
