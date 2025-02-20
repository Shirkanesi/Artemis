import { Interception } from 'cypress/types/net-stubbing';
import { ProgrammingExercise } from 'app/entities/programming-exercise.model';
import { Course } from 'app/entities/course.model';
import { CypressAssessmentType, convertCourseAfterMultiPart } from '../../../support/requests/CourseManagementRequests';
import dayjs from 'dayjs/esm';
import {
    courseAssessment,
    courseManagement,
    courseManagementRequest,
    exerciseAssessment,
    exerciseResult,
    programmingExerciseAssessment,
    programmingExerciseEditor,
    programmingExerciseFeedback,
} from '../../../support/artemis';
import { admin, instructor, studentOne, tutor } from '../../../support/users';

describe('Programming exercise assessment', () => {
    let course: Course;
    let exercise: ProgrammingExercise;
    const tutorFeedback = 'You are missing some classes! The classes, which you implemented look good though.';
    const tutorFeedbackPoints = 5;
    const tutorCodeFeedback = 'The input parameter should be mentioned in javadoc!';
    const tutorCodeFeedbackPoints = -2;
    const complaint = "That feedback wasn't very useful!";
    let dueDate: dayjs.Dayjs;
    let assessmentDueDate: dayjs.Dayjs;

    before('Creates a programming exercise and makes a student submission', () => {
        createCourseWithProgrammingExercise().then(() => {
            makeProgrammingSubmissionAsStudent();
        });
    });

    it('Assesses the programming exercise submission and verifies it', () => {
        assessSubmission();
        verifyAssessmentAsStudent();
        acceptComplaintAsInstructor();
    });

    after(() => {
        if (course) {
            cy.login(admin);
            courseManagementRequest.deleteCourse(course.id!);
        }
    });

    function assessSubmission() {
        cy.login(tutor, '/course-management');
        courseManagement.openAssessmentDashboardOfCourse(course.shortName!);
        courseAssessment.clickExerciseDashboardButton();
        exerciseAssessment.clickHaveReadInstructionsButton();
        exerciseAssessment.clickStartNewAssessment();
        programmingExerciseEditor.openFileWithName(exercise.id!, 'BubbleSort.java');
        programmingExerciseAssessment.provideFeedbackOnCodeLine(9, tutorCodeFeedbackPoints, tutorCodeFeedback);
        programmingExerciseAssessment.addNewFeedback(tutorFeedbackPoints, tutorFeedback);
        programmingExerciseAssessment.submit().then((request: Interception) => {
            expect(request.response!.statusCode).to.eq(200);
            // Wait until the assessment due date is over
            const now = dayjs();
            if (now.isBefore(assessmentDueDate)) {
                cy.wait(assessmentDueDate.diff(now, 'ms'));
            }
        });
    }

    function verifyAssessmentAsStudent() {
        cy.login(studentOne, `/courses/${course.id}/exercises/${exercise.id}`);
        const totalPoints = tutorFeedbackPoints + tutorCodeFeedbackPoints;
        const percentage = totalPoints * 10;
        exerciseResult.shouldShowExerciseTitle(exercise.title!);
        programmingExerciseFeedback.complain(complaint);
        exerciseResult.clickOpenCodeEditor(exercise.id!);
        programmingExerciseFeedback.shouldShowRepositoryLockedWarning();
        programmingExerciseFeedback.shouldShowAdditionalFeedback(tutorFeedbackPoints, tutorFeedback);
        programmingExerciseFeedback.shouldShowScore(percentage);
        programmingExerciseFeedback.shouldShowCodeFeedback(exercise.id!, 'BubbleSort.java', tutorCodeFeedback, '-2', programmingExerciseEditor);
    }

    function acceptComplaintAsInstructor() {
        cy.login(instructor, `/course-management/${course.id}/complaints`);
        programmingExerciseAssessment.acceptComplaint('Makes sense', false).then((request: Interception) => {
            expect(request.response!.statusCode).to.equal(200);
        });
    }

    function createCourseWithProgrammingExercise() {
        cy.login(admin);
        return courseManagementRequest.createCourse(true).then((response) => {
            course = convertCourseAfterMultiPart(response);
            courseManagementRequest.addStudentToCourse(course, studentOne);
            courseManagementRequest.addTutorToCourse(course, tutor);
            courseManagementRequest.addInstructorToCourse(course, instructor);
            dueDate = dayjs().add(25, 'seconds');
            assessmentDueDate = dueDate.add(30, 'seconds');
            courseManagementRequest
                .createProgrammingExercise({ course }, undefined, false, dayjs(), dueDate, undefined, undefined, undefined, assessmentDueDate, CypressAssessmentType.SEMI_AUTOMATIC)
                .then((programmingResponse) => {
                    exercise = programmingResponse.body;
                });
        });
    }

    function makeProgrammingSubmissionAsStudent() {
        cy.login(studentOne);
        courseManagementRequest
            .startExerciseParticipation(exercise.id!)
            .its('body.id')
            .then((participationId) => {
                courseManagementRequest.makeProgrammingExerciseSubmission(participationId);
                // Wait until the due date is in the past
                const now = dayjs();
                if (now.isBefore(dueDate)) {
                    cy.wait(dueDate.diff(now, 'ms'));
                }
            });
    }
});
