import Student from './Student.js';

import {
    calculateAverage,
    calculateGPA,
    calculateGrade as getGrade
} from './gradeUtils.js';

export function processTranscripts(rawJSON) {
    let records;

    try {
        records = JSON.parse(rawJSON);
    } catch (error) {
        throw new SyntaxError(
            `Malformed JSON: ${error.message}`
        );
    }

    if (!Array.isArray(records)) {
        throw new TypeError('Expected an array of student records');
    }

    const seen = new Set();

    const students = records.map(record => {
        if (!record ||
            typeof record !== 'object' ||
            Array.isArray(record)) {
            throw new TypeError('Invalid student record');
        }

        if (record.id === null ||
            record.id === undefined ||
            record.id === '') {
            throw new Error('Missing student ID');
        }

        if (seen.has(record.id)) {
            throw new Error(
                `Duplicate student ID: ${record.id}`
            );
        }

        seen.add(record.id);

        if (typeof record.name !== 'string' ||
            !record.name.trim()) {
            throw new TypeError('Missing student name');
        }

        if (!Array.isArray(record.courses) ||
            !record.courses.length) {
            throw new TypeError(
                'Courses must be a nonempty array'
            );
        }

        for (const course of record.courses) {
            if (typeof course?.code !== 'string' ||
                !course.code.trim()) {
                throw new Error('Missing course code');
            }

            if (typeof course.marks !== 'number' ||
                !Number.isFinite(course.marks)) {
                throw new TypeError(
                    `Invalid marks in ${course.code}`
                );
            }

            if (course.marks < 0 || course.marks > 100) {
                throw new RangeError(
                    `Marks out of range in ${course.code}`
                );
            }
        }

        const student = new Student(
            record.id,
            record.name,
            record.courses.map(course => ({
                ...course,
                grade: getGrade(course.marks)
            }))
        );

        return {
            id: student.id,
            name: student.name,
            courses: student.courses,
            average: Number(
                calculateAverage(record.courses).toFixed(2)
            ),
            gpa: Number(
                calculateGPA(record.courses).toFixed(2)
            )
        };
    });

    const report = {
        totalStudents: students.length,
        students
    };

    const json = JSON.stringify(report, null, 2);

    return { report, json };
}