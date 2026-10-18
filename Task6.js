'use strict';

const students = [
    {
        id: 101,
        completed: ['CS301'],
        registered: []
    },
    {
        id: 102,
        completed: [],
        registered: []
    },
    {
        id: 103,
        completed: ['CS301'],
        registered: ['CS401']
    }
];

const courses = [
    {
        code: 'CS401',
        prerequisite: 'CS301',
        seats: 1
    },
    {
        code: 'CS402',
        prerequisite: 'CS301',
        seats: 0
    }
];

function loadStudent(id, callback) {
    setTimeout(() => {
        const student = students.find(s => s.id === id);

        if (!student) {
            return callback(
                new Error('Student does not exist'),
                null
            );
        }

        callback(null, student);
    }, 30);
}

function checkPrerequisites(student, course, callback) {
    setTimeout(() => {
        if (!student.completed.includes(course.prerequisite)) {
            return callback(
                new Error('Prerequisite not completed'),
                null
            );
        }

        callback(null, { student, course });
    }, 30);
}

function checkAvailableSeats(context, callback) {
    setTimeout(() => {
        if (context.course.seats <= 0) {
            return callback(
                new Error('Course is full'),
                null
            );
        }

        callback(null, context);
    }, 30);
}

function registerCourse(context, callback) {
    setTimeout(() => {
        const { student, course } = context;

        if (student.registered.includes(course.code)) {
            return callback(
                new Error('Student already registered'),
                null
            );
        }

        student.registered.push(course.code);
        course.seats--;

        callback(null, {
            studentId: student.id,
            course: course.code,
            status: 'REGISTERED'
        });
    }, 30);
}

function runRegistration(studentId, courseCode, callback) {
    const course = courses.find(
        c => c.code === courseCode
    );

    if (!course) {
        return callback(new Error('Course not found'), null);
    }

    loadStudent(studentId, (err, student) => {
        if (err) {
            return callback(err, null);
        }

        checkPrerequisites(student, course, (err, context) => {
            if (err) {
                return callback(err, null);
            }

            checkAvailableSeats(context, (err, ready) => {
                if (err) {
                    return callback(err, null);
                }

                registerCourse(ready, callback);
            });
        });
    });
}

function show(label, id, course) {
    runRegistration(id, course, (error, result) => {
        console.log(
            label,
            error ? `ERROR: ${error.message}` : result
        );
    });
}

show('Success', 101, 'CS401');

show('Student missing', 999, 'CS401');

show('Prerequisite missing', 102, 'CS401');

show('Full course', 101, 'CS402');

show('Already registered', 103, 'CS401');