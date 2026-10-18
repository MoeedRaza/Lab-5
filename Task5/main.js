import Student from './Student.js';

import {
    calculateGrade as gradeOf
} from './gradeUtils.js';

import {
    processTranscripts
} from './transcriptService.js';

const examples = [
    [
        'Valid',
        JSON.stringify([
            {
                id: 101,
                name: 'Ali',
                courses: [
                    { code: 'CS301', marks: 81 },
                    { code: 'CS302', marks: 74 }
                ]
            }
        ])
    ],

    [
        'Malformed',
        '{bad json'
    ],

    [
        'Missing ID',
        JSON.stringify([
            {
                name: 'Ali',
                courses: [
                    { code: 'CS301', marks: 81 }
                ]
            }
        ])
    ],

    [
        'Duplicate ID',
        JSON.stringify([
            {
                id: 1,
                name: 'Ali',
                courses: [
                    { code: 'CS301', marks: 81 }
                ]
            },
            {
                id: 1,
                name: 'Sara',
                courses: [
                    { code: 'CS301', marks: 90 }
                ]
            }
        ])
    ],

    [
        'Bad marks',
        JSON.stringify([
            {
                id: 1,
                name: 'Ali',
                courses: [
                    { code: 'CS301', marks: 101 }
                ]
            }
        ])
    ],

    [
        'Missing course code',
        JSON.stringify([
            {
                id: 1,
                name: 'Ali',
                courses: [
                    { marks: 90 }
                ]
            }
        ])
    ]
];

for (const [label, data] of examples) {
    try {
        const { report, json } = processTranscripts(data);

        console.log(`\n${label}:`);
        console.log(report);

        console.log('JSON OUTPUT:');
        console.log(json);

    } catch (error) {
        console.log(
            `\n${label} caught ${error.name}: ${error.message}`
        );

    } finally {
        console.log(`${label} processing finished`);
    }
}

console.log('Named import alias:', gradeOf(86));

console.log(
    'Default import:',
    new Student(102, 'Sara', []) instanceof Student
);