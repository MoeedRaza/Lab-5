export function calculateGrade(marks) {
    if (marks >= 85) return 'A';
    if (marks >= 80) return 'A-';
    if (marks >= 75) return 'B+';
    if (marks >= 70) return 'B';
    if (marks >= 65) return 'B-';
    if (marks >= 60) return 'C+';
    if (marks >= 50) return 'C';

    return 'F';
}

export function calculateAverage(courses) {
    if (!courses.length) {
        throw new RangeError('At least one course is required');
    }

    const total = courses.reduce(
        (sum, course) => sum + course.marks,
        0
    );

    return total / courses.length;
}

export function calculateGPA(courses) {
    const points = {
        A: 4.00,
        'A-': 3.67,
        'B+': 3.33,
        B: 3.00,
        'B-': 2.67,
        'C+': 2.33,
        C: 2.00,
        F: 0
    };

    const total = courses.reduce((sum, course) => {
        const grade = calculateGrade(course.marks);
        return sum + points[grade];
    }, 0);

    return total / courses.length;
}