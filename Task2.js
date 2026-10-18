'use strict';

const results = [
    { id: 1, name: 'Ali', department: 'CS', course: 'FSWD', marks: 82 },
    { id: 2, name: 'Sara', department: 'CS', course: 'FSWD', marks: 91 },
    { id: 3, name: 'Usman', department: 'SE', course: 'FSWD', marks: 47 },
    { id: 4, name: 'Hina', department: 'AI', course: 'FSWD', marks: 73 },
    { id: 5, name: 'Ahmed', department: 'SE', course: 'FSWD', marks: 64 },
    { id: 6, name: 'Zoya', department: 'AI', course: 'FSWD', marks: 91 }
];

function gradeDetails(marks) {
    if (typeof marks !== 'number' ||
        !Number.isFinite(marks) ||
        marks < 0 || marks > 100) {
        return {
            grade: 'INVALID',
            status: 'INVALID',
            gradePoints: null
        };
    }

    if (marks >= 85) return { grade: 'A', status: 'PASS', gradePoints: 4.00 };
    if (marks >= 80) return { grade: 'A-', status: 'PASS', gradePoints: 3.67 };
    if (marks >= 75) return { grade: 'B+', status: 'PASS', gradePoints: 3.33 };
    if (marks >= 70) return { grade: 'B', status: 'PASS', gradePoints: 3.00 };
    if (marks >= 65) return { grade: 'B-', status: 'PASS', gradePoints: 2.67 };
    if (marks >= 60) return { grade: 'C+', status: 'PASS', gradePoints: 2.33 };
    if (marks >= 50) return { grade: 'C', status: 'PASS', gradePoints: 2.00 };

    return { grade: 'F', status: 'FAIL', gradePoints: 0 };
}

const processed = results.map(student => ({
    ...student,
    ...gradeDetails(student.marks)
}));

const ranked = [...processed].sort(
    (a, b) => b.marks - a.marks || a.name.localeCompare(b.name)
);

const departmentStats = processed.reduce((stats, student) => {
    const dept = stats[student.department] ?? {
        students: 0,
        totalMarks: 0,
        highest: null,
        passed: 0
    };

    dept.students++;

    if (student.status !== 'INVALID') {
        dept.totalMarks += student.marks;

        dept.highest = dept.highest === null
            ? student.marks
            : Math.max(dept.highest, student.marks);

        if (student.status === 'PASS') {
            dept.passed++;
        }
    }

    stats[student.department] = dept;
    return stats;
}, {});

Object.values(departmentStats).forEach(stats => {
    stats.average = Number(
        (stats.totalMarks / stats.students).toFixed(2)
    );

    delete stats.totalMarks;
});

const valid = processed.filter(s => s.status !== 'INVALID');

const average = valid.length
    ? valid.reduce((sum, s) => sum + s.marks, 0) / valid.length
    : null;

const queries = {
    firstAbove85: processed.find(s => s.marks > 85) ?? null,

    firstFailedIndex: processed.findIndex(
        s => s.status === 'FAIL'
    ),

    hasFailure: processed.some(
        s => s.status === 'FAIL'
    ),

    allMarksValid: processed.every(
        s => s.status !== 'INVALID'
    ),

    aboveAverage: average === null
        ? []
        : processed.filter(s => s.marks > average),

    topThreeNames: ranked.slice(0, 3).map(s => s.name)
};

console.log('STUDENT RESULTS');
console.table(processed);

console.log('RANKED MERIT LIST');
console.table(ranked);

console.log('DEPARTMENT STATISTICS');
console.log(departmentStats);

console.log('OVERALL AVERAGE:', average);

console.log('ACADEMIC QUERIES');
console.log(queries);

console.log(
    'ORIGINAL ARRAY UNCHANGED:',
    results[0].grade === undefined
);

console.log('BOUNDARY TESTS');

console.table(
    [0, 49, 50, 60, 65, 70, 75, 80, 85, 100, -1, 101, '90']
        .map(marks => ({
            marks,
            ...gradeDetails(marks)
        }))
);