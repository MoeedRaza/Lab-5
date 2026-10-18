'use strict';

const applicants = [
    {
        id: 'A101', name: 'Sara Khan', age: '19',
        matricMarks: '91', intermediateMarks: '87',
        entryTest: '78', program: 'BSCS', feePaid: 'true'
    },
    {
        id: 'A102', name: 'Ahmed Ali', age: 'twenty',
        matricMarks: '88', intermediateMarks: '',
        entryTest: '72', program: 'BSSE', feePaid: 'false'
    },
    {
        id: 'A103', name: 'Hassan', age: '18',
        matricMarks: '76', intermediateMarks: '83',
        entryTest: '91', program: 'BSAI', feePaid: 'true'
    },
    {
        id: 'A104', name: 'Moeed', age: '22',
        matricMarks: '70', intermediateMarks: '70',
        entryTest: '62', program: 'BSCS', feePaid: 'false'
    },
    {
        id: 'A105', name: 'Tony Stark', age: '30',
        matricMarks: '90', intermediateMarks: '50',
        entryTest: '95', program: 'BSSE', feePaid: 'true'
    },
    {
        id: 'A106', name: 'Peter Parker', age: '18',
        matricMarks: '100', intermediateMarks: '100',
        entryTest: '100', program: 'BSDS', feePaid: 'true'
    },
    {
        id: 'A107', name: 'Barry Allen', age: '24',
        matricMarks: '85', intermediateMarks: '80',
        entryTest: '90', program: 'BSCS', feePaid: 'false'
    }
];

const programs = ['BSCS', 'BSSE', 'BSAI'];

function convertNumber(value, field, errors) {
    if (value === null || value === undefined ||
        String(value).trim() === '') {
        errors.push(`${field} is missing`);
        return null;
    }

    const number = Number(value);

    if (!Number.isFinite(number)) {
        errors.push(`${field} is not a valid number`);
        return null;
    }

    return number;
}

function processApplicant(applicant) {
    const errors = [];

    const age = convertNumber(applicant.age, 'Age', errors);
    const matric = convertNumber(applicant.matricMarks, 'Matric', errors);
    const intermediate = convertNumber(applicant.intermediateMarks, 'Intermediate', errors);
    const entry = convertNumber(applicant.entryTest, 'Entry test', errors);

    if (age !== null &&
        (!Number.isInteger(age) || age < 17 || age > 30)) {
        errors.push('Age must be a whole number from 17 to 30');
    }

    for (const [field, value] of [
        ['Matric', matric],
        ['Intermediate', intermediate],
        ['Entry test', entry]
    ]) {
        if (value !== null && (value < 0 || value > 100)) {
            errors.push(`${field} must be from 0 to 100`);
        }
    }

    switch (applicant.program) {
        case 'BSCS':
        case 'BSSE':
        case 'BSAI':
            break;
        default:
            errors.push('Unsupported program');
    }

    if (!['true', 'false'].includes(String(applicant.feePaid))) {
        errors.push('Invalid feePaid value');
    }

    if (!applicant.id || !applicant.name?.trim()) {
        errors.push('ID and name are required');
    }

    if (errors.length > 0) {
        return {
            id: applicant.id,
            name: applicant.name,
            program: applicant.program,
            status: 'INVALID DATA',
            merit: null,
            errors
        };
    }

    const merit = (matric * 0.20) +
                  (intermediate * 0.30) +
                  (entry * 0.50);

    const eligible = merit >= 70 &&
                     entry >= 60 &&
                     intermediate >= 60;

    let status;

    if (!eligible) {
        status = 'REJECTED';
    } else if (applicant.feePaid === 'true') {
        status = 'SELECTED';
    } else {
        status = 'WAITING';
    }

    return {
        id: applicant.id,
        name: applicant.name,
        program: applicant.program,
        merit: Number(merit.toFixed(2)),
        status,
        errors
    };
}

const processed = applicants.map(processApplicant);

const valid = processed.filter(
    applicant => applicant.status !== 'INVALID DATA'
);

const highest = valid.length
    ? valid.reduce((a, b) => a.merit >= b.merit ? a : b)
    : null;

const lowest = valid.length
    ? Math.min(...valid.map(a => a.merit))
    : null;

const average = valid.length
    ? valid.reduce((sum, a) => sum + a.merit, 0) / valid.length
    : null;

const summary = {
    validApplicants: valid.length,
    invalidApplicants: processed.length - valid.length,
    highestMeritApplicant: highest,
    lowestValidMerit: lowest,
    averageMerit: average === null ? null : Number(average.toFixed(2)),
    applicantsPerProgram: Object.fromEntries(
        programs.map(program => [
            program,
            applicants.filter(a => a.program === program).length
        ])
    )
};

console.log('APPLICATION DECISIONS');

console.table(processed.map(({ id, name, program, merit, status }) => ({
    id, name, program, merit, status
})));

console.log('INVALID DATA DETAILS');
console.log(processed.filter(a => a.errors.length > 0));

console.log('FINAL SUMMARY');
console.log(summary);