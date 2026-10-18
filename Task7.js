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
    }
];

const courses = [
    {
        code: 'CS401',
        prerequisite: 'CS301',
        seats: 3
    },
    {
        code: 'CS402',
        prerequisite: 'CS301',
        seats: 0
    }
];

function delayed(action, ms = 30) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                resolve(action());
            } catch (error) {
                reject(error);
            }
        }, ms);
    });
}

function getStudent(id) {
    return delayed(() => {
        const student = students.find(s => s.id === id);

        if (!student) {
            throw new Error('Student not found');
        }

        return student;
    });
}

function getCourse(code) {
    return delayed(() => {
        const course = courses.find(c => c.code === code);

        if (!course) {
            throw new Error('Course not found');
        }

        return course;
    });
}

function checkPrerequisites({ student, course }) {
    return delayed(() => {
        if (!student.completed.includes(course.prerequisite)) {
            throw new Error('Prerequisite missing');
        }

        return { student, course };
    });
}

function checkSeats(context) {
    return delayed(() => {
        if (context.course.seats <= 0) {
            throw new Error('Course full');
        }

        return context;
    });
}

function registerStudent({ student, course }) {
    return delayed(() => {
        if (student.registered.includes(course.code)) {
            throw new Error('Already registered');
        }

        student.registered.push(course.code);
        course.seats--;

        return {
            studentId: student.id,
            course: course.code,
            status: 'REGISTERED'
        };
    });
}

function sendEmail(confirmation) {
    return delayed(() => ({
        message: `Email sent for ${confirmation.course}`
    }));
}

function sendSMS() {
    return delayed(() => {
        throw new Error('SMS gateway unavailable');
    });
}

function writeAuditLog(confirmation) {
    return delayed(() => ({
        logged: confirmation.studentId
    }));
}

function postRegistration(confirmation) {
    const names = ['Email', 'SMS', 'Audit'];

    return Promise.allSettled([
        sendEmail(confirmation),
        sendSMS(confirmation),
        writeAuditLog(confirmation)
    ]).then(results => {
        return results.map((result, index) => ({
            service: names[index],
            status: result.status,
            ...(result.status === 'rejected'
                ? { error: result.reason.message }
                : { value: result.value })
        }));
    });
}

function register(id, code) {
    return getStudent(id)
        .then(student =>
            getCourse(code).then(course => ({
                student,
                course
            }))
        )
        .then(context => checkPrerequisites(context))
        .then(context => checkSeats(context))
        .then(context => registerStudent(context))
        .then(confirmation =>
            postRegistration(confirmation).then(services => ({
                confirmation,
                services
            }))
        )
        .catch(error => ({
            error: error.message
        }))
        .finally(() => {
            console.log(
                `Registration attempt ${id}/${code} finished`
            );
        });
}

function firstSuccessfulCourse() {
    const serverA = delayed(() => {
        throw new Error('Server A unavailable');
    }, 15);

    const serverB = delayed(() => ({
        code: 'CS401',
        source: 'Server B'
    }), 35);

    return Promise.any([serverA, serverB]);
}

register(101, 'CS401')
    .then(result => {
        console.log('Success + services:', result);
        return register(102, 'CS401');
    })
    .then(result => {
        console.log('Prerequisite failure:', result);
        return register(999, 'CS401');
    })
    .then(result => {
        console.log('Missing student:', result);
        return register(101, 'CS402');
    })
    .then(result => {
        console.log('Full course:', result);
        return register(101, 'CS401');
    })
    .then(result => {
        console.log('Duplicate registration:', result);
        return firstSuccessfulCourse();
    })
    .then(course => {
        console.log('First successful course server:', course);
    })
    .catch(error => {
        console.log('Unexpected failure:', error.message);
    });