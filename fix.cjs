const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

// Fix loaders
walkDir('./src/routes', function(filePath) {
    if (filePath.endsWith('.ts') || filePath.endsWith('.svelte')) {
        let content = fs.readFileSync(filePath, 'utf-8');
        let original = content;

        // Fix expected 0 arguments
        content = content.replace(/schoolsApi\.getMySchools\([^)]+\)/g, 'schoolsApi.getMySchools()');
        content = content.replace(/studentsApi\.getMyStudents\([^)]+\)/g, 'studentsApi.getMyStudents()');
        content = content.replace(/classesApi\.getMyClasses\([^)]+\)/g, 'classesApi.getMyClasses()');
        content = content.replace(/classesApi\.getClassesBySchool\([^,]+,\s*[^)]+\)/g, match => {
            return match.split(',')[0] + ')';
        });
        content = content.replace(/classesApi\.getClass\([^,]+,\s*[^)]+\)/g, match => {
            return match.split(',')[0] + ')';
        });
        content = content.replace(/tournamentsApi\.getMyTournaments\([^)]+\)/g, 'tournamentsApi.getMyTournaments()');
        content = content.replace(/tournamentsApi\.getTournamentMatches\([^,]+,\s*[^)]+\)/g, match => {
            return match.split(',')[0] + ')';
        });
        content = content.replace(/classSkillsApi\.getClassSkills\([^,]+,\s*[^)]+\)/g, match => {
            return match.split(',')[0] + ')';
        });
        content = content.replace(/skillsApi\.getMySkills\([^)]+\)/g, 'skillsApi.getMySkills()');
        content = content.replace(/schoolsApi\.getSchool\([^,]+,\s*[^)]+\)/g, match => {
            return match.split(',')[0] + ')';
        });

        // Other type fixes
        content = content.replace(/\(tournament as any\)\.user_id \|\| tournament\.created_by/g, 'tournament.owner_id');

        // pagos/+page.svelte fixes
        if (filePath.includes('pagos') && filePath.endsWith('.svelte')) {
            content = content.replace(/p\.date/g, 'p.paid_date');
            content = content.replace(/p\.studentId/g, 'p.student_id');
        }

        if (original !== content) {
            fs.writeFileSync(filePath, content, 'utf-8');
            console.log('Fixed', filePath);
        }
    }
});

// Fix api errors
walkDir('./src/lib/api', function(filePath) {
    if (filePath.endsWith('.ts')) {
        let content = fs.readFileSync(filePath, 'utf-8');
        let original = content;

        content = content.replace(/cls\.school_id && !cls\.school_name/g, 'cls.school_id'); // Just wait, we added school_name to Class
        content = content.replace(/getSchool\(classData\.school_id\)/g, 'getSchool(classData.school_id as string)');
        content = content.replace(/Object\.entries\(countMap\)/g, 'Object.entries(countMap as any)');
        content = content.replace(/doc\.data\(\)\.student_id/g, '(doc.data() as any).student_id');
        content = content.replace(/e\.data\(\)\.student_id/g, '(e.data() as any).student_id');
        content = content.replace(/data\.skill_id/g, '(data as any).skill_id');
        content = content.replace(/data\.order_index/g, '(data as any).order_index');
        content = content.replace(/data\.status/g, '(data as any).status');
        content = content.replace(/data\.tournament_id/g, '(data as any).tournament_id');
        content = content.replace(/\(a => a\.status === 'P'\)/g, '(a: any => a.status === \'P\')');
        content = content.replace(/attendance\.reduce\(\(acc, record\) => {/g, 'attendance.reduce((acc: any, record: any) => {');
        content = content.replace(/attendance\.filter\(a => a\.date/g, 'attendance.filter((a: any) => a.date');
        content = content.replace(/attendanceMap\[key\]/g, '(attendanceMap as any)[key]');
        content = content.replace(/enrollments\.reduce\(\(acc, e\)/g, 'enrollments.reduce((acc: any, e: any)');

        if (original !== content) {
            fs.writeFileSync(filePath, content, 'utf-8');
            console.log('Fixed', filePath);
        }
    }
});
