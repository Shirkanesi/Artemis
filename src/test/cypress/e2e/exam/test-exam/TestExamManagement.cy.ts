import { Exam } from 'app/entities/exam.model';
import { Course } from 'app/entities/course.model';
import { CypressExamBuilder, convertCourseAfterMultiPart } from '../../../support/requests/CourseManagementRequests';
import { generateUUID } from '../../../support/utils';
import { ExerciseGroup } from 'app/entities/exercise-group.model';
import {
    courseManagement,
    courseManagementRequest,
    examExerciseGroupCreation,
    examExerciseGroups,
    examManagement,
    modelingExerciseCreation,
    navigationBar,
    programmingExerciseCreation,
    quizExerciseCreation,
    textExerciseCreation,
} from '../../../support/artemis';
import { admin, instructor, studentOne } from '../../../support/users';

// Common primitives
const uid = generateUUID();
const examTitle = 'test-exam' + uid;
let groupCount = 0;
let createdGroup: ExerciseGroup;

describe('Test Exam management', () => {
    let course: Course;
    let exam: Exam;

    before(() => {
        cy.login(admin);
        courseManagementRequest.createCourse(true).then((response) => {
            course = convertCourseAfterMultiPart(response);
            courseManagementRequest.addStudentToCourse(course, studentOne);
            const examConfig = new CypressExamBuilder(course).title(examTitle).testExam().build();
            courseManagementRequest.createExam(examConfig).then((examResponse) => {
                exam = examResponse.body;
            });
        });
    });

    describe('Manage Group', () => {
        let exerciseGroup: ExerciseGroup;

        before(() => {
            cy.login(instructor);
            courseManagementRequest.addExerciseGroupForExam(exam).then((response) => {
                exerciseGroup = response.body;
                groupCount++;
            });
        });

        beforeEach(() => {
            cy.login(instructor);
        });

        it('Create exercise group', () => {
            cy.visit('/');
            navigationBar.openCourseManagement();
            courseManagement.openExamsOfCourse(course.shortName!);
            examManagement.openExerciseGroups(exam.id!);
            examExerciseGroups.shouldShowNumberOfExerciseGroups(groupCount);
            examExerciseGroups.clickAddExerciseGroup();
            const groupName = 'Group 1';
            examExerciseGroupCreation.typeTitle(groupName);
            examExerciseGroupCreation.isMandatoryBoxShouldBeChecked();
            examExerciseGroupCreation.clickSave().then((interception) => {
                const group = interception.response!.body;
                groupCount++;
                examExerciseGroups.shouldHaveTitle(group.id, groupName);
                examExerciseGroups.shouldShowNumberOfExerciseGroups(groupCount);
                createdGroup = group;
            });
        });

        it('Adds a text exercise', () => {
            cy.visit(`/course-management/${course.id}/exams`);
            examManagement.openExerciseGroups(exam.id!);
            examExerciseGroups.clickAddTextExercise(exerciseGroup.id!);
            const textExerciseTitle = 'text' + uid;
            textExerciseCreation.typeTitle(textExerciseTitle);
            textExerciseCreation.typeMaxPoints(10);
            textExerciseCreation.create().its('response.statusCode').should('eq', 201);
            examExerciseGroups.visitPageViaUrl(course.id!, exam.id!);
            examExerciseGroups.shouldContainExerciseWithTitle(exerciseGroup.id!, textExerciseTitle);
        });

        it('Adds a quiz exercise', () => {
            cy.visit(`/course-management/${course.id}/exams`);
            examManagement.openExerciseGroups(exam.id!);
            examExerciseGroups.clickAddQuizExercise(exerciseGroup.id!);
            const quizExerciseTitle = 'quiz' + uid;
            quizExerciseCreation.setTitle(quizExerciseTitle);
            quizExerciseCreation.addMultipleChoiceQuestion(quizExerciseTitle, 10);
            quizExerciseCreation.saveQuiz().its('response.statusCode').should('eq', 201);
            examExerciseGroups.visitPageViaUrl(course.id!, exam.id!);
            examExerciseGroups.shouldContainExerciseWithTitle(exerciseGroup.id!, quizExerciseTitle);
        });

        it('Adds a modeling exercise', () => {
            cy.visit(`/course-management/${course.id}/exams`);
            examManagement.openExerciseGroups(exam.id!);
            examExerciseGroups.clickAddModelingExercise(exerciseGroup.id!);
            const modelingExerciseTitle = 'modeling' + uid;
            modelingExerciseCreation.setTitle(modelingExerciseTitle);
            modelingExerciseCreation.setPoints(10);
            modelingExerciseCreation.save().its('response.statusCode').should('eq', 201);
            examExerciseGroups.visitPageViaUrl(course.id!, exam.id!);
            examExerciseGroups.shouldContainExerciseWithTitle(exerciseGroup.id!, modelingExerciseTitle);
        });

        it('Adds a programming exercise', () => {
            cy.visit(`/course-management/${course.id}/exams`);
            examManagement.openExerciseGroups(exam.id!);
            examExerciseGroups.clickAddProgrammingExercise(exerciseGroup.id!);
            const programmingExerciseTitle = 'programming' + uid;
            programmingExerciseCreation.setTitle(programmingExerciseTitle);
            programmingExerciseCreation.setShortName(programmingExerciseTitle);
            programmingExerciseCreation.setPackageName('de.test');
            programmingExerciseCreation.setPoints(10);
            programmingExerciseCreation.generate().its('response.statusCode').should('eq', 201);
            examExerciseGroups.visitPageViaUrl(course.id!, exam.id!);
            examExerciseGroups.shouldContainExerciseWithTitle(exerciseGroup.id!, programmingExerciseTitle);
        });

        it('Edits an exercise group', () => {
            cy.visit(`/course-management/${course.id}/exams`);
            examManagement.openExerciseGroups(exam.id!);
            examExerciseGroups.shouldHaveTitle(exerciseGroup.id!, exerciseGroup.title!);
            examExerciseGroups.clickEditGroup(exerciseGroup.id!);
            const newGroupName = 'Group 3';
            examExerciseGroupCreation.typeTitle(newGroupName);
            examExerciseGroupCreation.update();
            examExerciseGroups.shouldHaveTitle(exerciseGroup.id!, newGroupName);
            exerciseGroup.title = newGroupName;
        });

        it('Delete an exercise group', () => {
            cy.visit('/');
            navigationBar.openCourseManagement();
            courseManagement.openExamsOfCourse(course.shortName!);
            examManagement.openExerciseGroups(exam.id!);
            // If the group in the "Create group test" was created successfully, we delete it so there is no group with no exercise
            let group = exerciseGroup;
            if (createdGroup) {
                group = createdGroup;
            }
            examExerciseGroups.clickDeleteGroup(group.id!, group.title!);
            examExerciseGroups.shouldNotExist(group.id!);
        });
    });

    after(() => {
        if (course) {
            cy.login(admin);
            courseManagementRequest.deleteCourse(course.id!);
        }
    });
});
