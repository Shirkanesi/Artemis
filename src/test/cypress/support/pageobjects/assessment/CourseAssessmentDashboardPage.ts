import { COURSE_BASE } from '../../requests/CourseManagementRequests';
import { POST } from '../../constants';

/**
 * A class which encapsulates UI selectors and actions for the course assessment dashboard page.
 */
export class CourseAssessmentDashboardPage {
    readonly exerciseDashboardButtonSelector = '[jhitranslate="entity.action.exerciseDashboard"]';

    openComplaints(courseId: number) {
        cy.get(`[href="/course-management/${courseId}/complaints"]`).click();
    }

    showTheComplaint() {
        cy.get('.btn-primary').should('contain.text', 'Show the complaint').click();
    }

    clickExerciseDashboardButton() {
        // Sometimes the page does not load properly, so we reload it if the button is not found
        cy.reloadUntilFound(this.exerciseDashboardButtonSelector);
        cy.get(this.exerciseDashboardButtonSelector).click();
    }

    checkShowFinishedExercises() {
        cy.get('#field_showFinishedExercise').check();
    }

    clickEvaluateQuizzes() {
        cy.intercept(POST, COURSE_BASE + '*/exams/*/student-exams/evaluate-quiz-exercises').as('evaluateQuizzes');
        cy.get('#evaluateQuizExercisesButton').click();
        return cy.wait('@evaluateQuizzes');
    }
}
