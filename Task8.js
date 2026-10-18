'use strict';

const data = {
    '/users': [
        { id: 101, name: 'Moeed', department: 'CS' },
        { id: 102, name: 'Sara', department: 'CS' },
        { id: 103, name: 'Bruce Banner', department: 'SE' },
        { id: 104, name: 'Tony Stark', department: 'AI' }
    ],

    '/courses': [
        { code: 'FSWD' },
        { code: 'OS' },
        { code: 'AI' }
    ],

    '/results': [
        { studentId: 101, marks: 82 },
        { studentId: 102, marks: 91 },
        { studentId: 103, marks: 47 },
        { studentId: 104, marks: 73 }
    ]
};

function fakeFetch(url, options = {}) {
    return new Promise((resolve, reject) => {
        let finished = false;

        const delay = url === '/slow' ? 500 : 40;
        const signal = options.signal;

        if (signal?.aborted) {
            return reject(
                Object.assign(new Error('Request aborted'), {
                    name: 'AbortError'
                })
            );
        }

        function abort() {
            if (finished) return;

            finished = true;
            clearTimeout(timer);

            reject(
                Object.assign(new Error('Request aborted'), {
                    name: 'AbortError'
                })
            );
        }

        signal?.addEventListener('abort', abort, { once: true });

        const timer = setTimeout(() => {
            if (finished) return;

            finished = true;
            signal?.removeEventListener('abort', abort);

            if (url === '/network') {
                return reject(new TypeError('Network failure'));
            }

            const status = url === '/server-error'
                ? 500
                : url === '/missing'
                    ? 404
                    : 200;

            resolve({
                ok: status >= 200 && status < 300,
                status,

                async json() {
                    if (url === '/invalid-json') {
                        throw new SyntaxError(
                            'Unexpected token in JSON'
                        );
                    }

                    return data[url] ?? [];
                }
            });
        }, delay);
    });
}

async function getJSON(url, fetchImplementation = fakeFetch) {
    const response = await fetchImplementation(url);

    if (!response.ok) {
        const error = new Error(
            `HTTP ${response.status} for ${url}`
        );

        error.name = 'HTTPError';
        throw error;
    }

    return await response.json();
}

function makeDashboard(users, courses, results) {
    const joined = results.map(result => ({
        ...result,
        ...users.find(user => user.id === result.studentId)
    }));

    const valid = joined.filter(result =>
        typeof result.marks === 'number' &&
        Number.isFinite(result.marks) &&
        result.marks >= 0 &&
        result.marks <= 100
    );

    const stats = valid.reduce((acc, result) => {
        const dept = result.department ?? 'Unknown';

        if (!acc[dept]) {
            acc[dept] = {
                students: 0,
                totalMarks: 0,
                passed: 0,
                highest: null
            };
        }

        acc[dept].students++;
        acc[dept].totalMarks += result.marks;

        if (result.marks >= 50) {
            acc[dept].passed++;
        }

        acc[dept].highest = Math.max(
            acc[dept].highest ?? result.marks,
            result.marks
        );

        return acc;
    }, {});

    Object.values(stats).forEach(stat => {
        stat.average = Number(
            (stat.totalMarks / stat.students).toFixed(2)
        );

        delete stat.totalMarks;
    });

    const highest = valid.length
        ? valid.reduce((a, b) =>
            b.marks > a.marks ? b : a
        )
        : null;

    const overallAverage = valid.length
        ? valid.reduce((sum, r) => sum + r.marks, 0) / valid.length
        : null;

    return {
        totalStudents: users.length,

        totalCourses: courses.length,

        overallAverageMarks: overallAverage === null
            ? null
            : Number(overallAverage.toFixed(2)),

        highestPerformingStudent: highest
            ? {
                id: highest.studentId,
                name: highest.name,
                marks: highest.marks
            }
            : null,

        failedStudents: valid.filter(
            r => r.marks < 50
        ).length,

        departmentStatistics: stats
    };
}

async function loadDashboard(fetchImplementation = fakeFetch) {
    const [users, courses, results] = await Promise.all([
        getJSON('/users', fetchImplementation),
        getJSON('/courses', fetchImplementation),
        getJSON('/results', fetchImplementation)
    ]);

    return makeDashboard(users, courses, results);
}

async function fetchWithTimeout(
    url,
    milliseconds,
    fetchImplementation = fakeFetch
) {
    const controller = new AbortController();

    const timer = setTimeout(() => {
        controller.abort();
    }, milliseconds);

    try {
        return await getJSON(
            url,
            u => fetchImplementation(u, {
                signal: controller.signal
            })
        );

    } catch (error) {
        if (error.name === 'AbortError') {
            const timeout = new Error(
                `Timed out after ${milliseconds} ms`
            );

            timeout.name = 'TimeoutError';
            throw timeout;
        }

        throw error;

    } finally {
        clearTimeout(timer);
    }
}

async function main() {
    try {
        const dashboard = await loadDashboard();

        console.log('CAMPUSFLOW DASHBOARD');
        console.log(dashboard);

    } catch (error) {
        console.log(
            'Dashboard failed:',
            error.message
        );
    }

    const urls = [
        '/users',
        '/missing',
        '/server-error',
        '/network',
        '/invalid-json',
        '/slow'
    ];

    for (const url of urls) {
        try {
            const milliseconds = url === '/slow'
                ? 50
                : 200;

            const result = await fetchWithTimeout(
                url,
                milliseconds
            );

            console.log(
                url,
                'SUCCESS:',
                result.length
            );

        } catch (error) {
            console.log(
                url,
                `${error.name}: ${error.message}`
            );
        }
    }
}

main().catch(error => {
    console.error(error);
});