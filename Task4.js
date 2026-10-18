'use strict';

class Person {
    constructor(name, email) {
        this.name = name;
        this.email = email;
    }

    introduce() {
        return `I am ${this.name} (${this.email}).`;
    }
}

class Student extends Person {
    constructor(name, email, rollNo, marks) {
        super(name, email);

        this.rollNo = rollNo;
        this.marks = marks;
    }

    introduce() {
        return `${super.introduce()} Student roll: ${this.rollNo}.`;
    }

    getResult() {
        return this.marks >= 50 ? 'PASS' : 'FAIL';
    }
}

class FacultyMember extends Person {
    constructor(name, email, employeeId, department) {
        super(name, email);

        this.employeeId = employeeId;
        this.department = department;
    }

    introduce() {
        return `${super.introduce()} Faculty in ${this.department}, employee ${this.employeeId}.`;
    }
}

const ali = new Student(
    'Ali',
    'ali@university.edu',
    '241201',
    82
);

const sara = new Student(
    'Sara',
    'sara@university.edu',
    '241052',
    40
);

const professor = new FacultyMember(
    'Dr. Khan',
    'khan@university.edu',
    'EMP-10',
    'CS'
);

const users = [
    ali,
    professor,
    sara,
    new FacultyMember(
        'Dr. Noor',
        'noor@university.edu',
        'EMP-20',
        'AI'
    )
];

console.log('USER INTRODUCTIONS');

users.forEach(user => {
    console.log(user.introduce());
});

console.log('STUDENT RESULTS');
console.log('Ali:', ali.getResult());
console.log('Sara:', sara.getResult());

console.log('INSTANCEOF CHECKS');

console.log(ali instanceof Student);
console.log(ali instanceof Person);
console.log(professor instanceof Student);

const guest = {
    name: 'Dr. Ahmed',
    email: 'ahmed@example.com'
};

console.log('CALL METHOD');

console.log(
    Person.prototype.introduce.call(guest)
);

const fn = ali.introduce;

try {
    console.log(fn());
} catch (error) {
    console.log('Detached method error:', error.message);
}

const safeFn = ali.introduce.bind(ali);

console.log('BOUND METHOD');
console.log(safeFn());