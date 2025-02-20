import { Exam } from 'app/entities/exam.model';
import { Course } from 'app/entities/course.model';
import { EXERCISE_TYPE } from '../../constants';
import { getExercise } from '../../utils';
import {
    courseList,
    courseOverview,
    examNavigation,
    examStartEnd,
    modelingExerciseEditor,
    programmingExerciseEditor,
    quizExerciseMultipleChoice,
    textExerciseEditor,
} from '../../artemis';
import { Interception } from 'cypress/types/net-stubbing';
import { CypressCredentials } from '../../users';
import { ProgrammingExerciseSubmission } from '../exercises/programming/OnlineEditorPage';

/**
 * A class which encapsulates UI selectors and actions for the exam details page.
 */
export class ExamParticipation {
    /**
     * Makes a submission in a provided exercise
     * @param exerciseID the id of the exercise
     * @param exerciseType the type of the exercise
     * @param additionalData additional data such as the expected score
     */
    makeSubmission(exerciseID: number, exerciseType: EXERCISE_TYPE, additionalData?: AdditionalData) {
        switch (exerciseType) {
            case EXERCISE_TYPE.Text:
                this.makeTextExerciseSubmission(exerciseID, additionalData!.textFixture!);
                break;
            case EXERCISE_TYPE.Modeling:
                this.makeModelingExerciseSubmission(exerciseID);
                break;
            case EXERCISE_TYPE.Quiz:
                this.makeQuizExerciseSubmission(exerciseID, additionalData!.quizExerciseID!);
                break;
            case EXERCISE_TYPE.Programming:
                this.makeProgrammingExerciseSubmission(exerciseID, additionalData!.submission!, additionalData!.practiceMode);
                break;
        }
    }

    makeTextExerciseSubmission(exerciseID: number, textFixture: string) {
        cy.fixture(textFixture).then((submissionText) => {
            textExerciseEditor.typeSubmission(exerciseID, submissionText);
        });
        cy.wait(1000);
    }

    private makeProgrammingExerciseSubmission(exerciseID: number, submission: ProgrammingExerciseSubmission, practiceMode = false) {
        programmingExerciseEditor.toggleCompressFileTree(exerciseID);
        programmingExerciseEditor.deleteFile(exerciseID, 'Client.java');
        programmingExerciseEditor.deleteFile(exerciseID, 'BubbleSort.java');
        programmingExerciseEditor.deleteFile(exerciseID, 'MergeSort.java');
        programmingExerciseEditor.typeSubmission(exerciseID, submission, 'de.test');
        if (practiceMode) {
            programmingExerciseEditor.submitPractice(exerciseID);
        } else {
            programmingExerciseEditor.submit(exerciseID);
        }
        programmingExerciseEditor.getResultScoreFromExercise(exerciseID).contains(submission.expectedResult).and('be.visible');
    }

    makeModelingExerciseSubmission(exerciseID: number) {
        modelingExerciseEditor.addComponentToModel(exerciseID, 1, false);
        modelingExerciseEditor.addComponentToModel(exerciseID, 2, false);
        modelingExerciseEditor.addComponentToModel(exerciseID, 3, false);
    }

    makeQuizExerciseSubmission(exerciseID: number, quizExerciseID: number) {
        quizExerciseMultipleChoice.tickAnswerOption(exerciseID, 0, quizExerciseID);
        quizExerciseMultipleChoice.tickAnswerOption(exerciseID, 2, quizExerciseID);
    }

    startParticipation(student: CypressCredentials, course: Course, exam: Exam) {
        cy.login(student, '/');
        courseList.openCourse(course.id!);
        courseOverview.openExamsTab();
        courseOverview.openExam(exam.id!);
        cy.url().should('contain', `/exams/${exam.id}`);
        examStartEnd.startExam();
    }

    selectExerciseOnOverview(index: number) {
        cy.get(`.exercise-table tr:nth-child(${index}) a`).click();
    }

    clickSaveAndContinue() {
        cy.get('#save').click();
    }

    checkExerciseTitle(exerciseID: number, title: string) {
        getExercise(exerciseID).find('.exercise-title').contains(title);
    }

    checkExamTitle(title: string) {
        cy.get('#exam-title').contains(title);
    }

    handInEarly() {
        examNavigation.handInEarly();
        examStartEnd.finishExam().then((request: Interception) => {
            expect(request.response!.statusCode).to.eq(200);
        });
    }

    verifyExerciseTitleOnFinalPage(exerciseID: number, exerciseTitle: string) {
        getExercise(exerciseID).find('.exercise-title').contains(exerciseTitle).should('be.visible');
    }

    verifyTextExerciseOnFinalPage(textFixture: string) {
        cy.fixture(textFixture).then((submissionText) => {
            cy.contains(submissionText).should('be.visible');
        });
    }
}

export class AdditionalData {
    quizExerciseID?: number;
    submission?: ProgrammingExerciseSubmission;
    expectedScore?: number;
    textFixture?: string;
    practiceMode?: boolean;
}

export type Exercise = {
    title: string;
    type: EXERCISE_TYPE;
    id: number;
    additionalData?: AdditionalData;
};
