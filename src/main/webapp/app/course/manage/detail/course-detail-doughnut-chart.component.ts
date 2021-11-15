import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { roundScoreSpecifiedByCourseSettings } from 'app/shared/util/utils';
import { DoughnutChartType } from './course-detail.component';
import { Router } from '@angular/router';
import { Course } from 'app/entities/course.model';
import { ScaleType, Color } from '@swimlane/ngx-charts';

@Component({
    selector: 'jhi-course-detail-doughnut-chart',
    templateUrl: './course-detail-doughnut-chart.component.html',
    styleUrls: ['./course-detail-doughnut-chart.component.scss'],
})
export class CourseDetailDoughnutChartComponent implements OnChanges, OnInit {
    @Input() contentType: DoughnutChartType;
    @Input() currentPercentage: number | undefined;
    @Input() currentAbsolute: number | undefined;
    @Input() currentMax: number | undefined;
    @Input() course: Course;

    receivedStats = false;
    doughnutChartTitle: string;
    stats: number[];
    titleLink: string | undefined;

    constructor(private router: Router) {}

    // ngx-charts
    ngxData: any[] = [
        { name: 'Done', value: 0 },
        { name: 'Not done', value: 0 },
    ];
    ngxColor = {
        name: 'vivid',
        selectable: true,
        group: ScaleType.Ordinal,
        domain: ['#32cd32', '#ff0000'],
    } as Color;
    bindFormatting = this.valueFormatting.bind(this);

    ngOnChanges(): void {
        // [0, 0] will lead to the chart not being displayed,
        // assigning [1, 0] works around this issue and displays 0 %, 0 / 0 with a green circle
        if (this.currentAbsolute == undefined && !this.receivedStats) {
            this.assignValuesToData([1, 0]);
        } else {
            this.receivedStats = true;
            const remaining = roundScoreSpecifiedByCourseSettings(this.currentMax! - this.currentAbsolute!, this.course);
            this.stats = [this.currentAbsolute!, remaining];
            return this.currentMax === 0 ? this.assignValuesToData([1, 0]) : this.assignValuesToData(this.stats);
        }
    }

    /**
     * Depending on the information we want to display in the doughnut chart, we need different titles and links
     */
    ngOnInit(): void {
        switch (this.contentType) {
            case DoughnutChartType.ASSESSMENT:
                this.doughnutChartTitle = 'assessments';
                this.titleLink = 'assessment-dashboard';
                break;
            case DoughnutChartType.COMPLAINTS:
                this.doughnutChartTitle = 'complaints';
                this.titleLink = 'complaints';
                break;
            case DoughnutChartType.FEEDBACK:
                this.doughnutChartTitle = 'moreFeedback';
                this.titleLink = undefined;
                break;
            case DoughnutChartType.AVERAGE_COURSE_SCORE:
                this.doughnutChartTitle = 'averageStudentScore';
                this.titleLink = undefined;
                if (this.course.isAtLeastInstructor) {
                    this.titleLink = 'scores';
                }
                this.ngxData[0].name = 'Average score';
                break;
            default:
                this.doughnutChartTitle = '';
                this.titleLink = undefined;
        }
        this.ngxData = [...this.ngxData];
    }

    /**
     * handles clicks onto the graph, which then redirects the user to the corresponding page, e.g. complaints page for the complaints chart
     */
    openCorrespondingPage() {
        if (this.course.id && this.titleLink) {
            this.router.navigate(['/course-management', this.course.id, this.titleLink]);
        }
    }

    /**
     * Asigns a given array of numbers to ngxData
     * @param values the values that should be displayed by the chart
     * @private
     */
    private assignValuesToData(values: number[]) {
        this.ngxData[0].value = values[0];
        this.ngxData[1].value = values[1];
        this.ngxData = [...this.ngxData];
    }

    /**
     * Modifies the tooltip content of the chart.
     * Returns absolute value represented by doughnut piece or 0 if the currentMax is 0.
     * This is necessary in order to compensate the workaround for
     * displaying a chart even if no values are there to display (i.e. currentMax is 0)
     * @param value
     */
    valueFormatting(value: any) {
        return this.currentMax === 0 ? '0' : value.value;
    }
}
