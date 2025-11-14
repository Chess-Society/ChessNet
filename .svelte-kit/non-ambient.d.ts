
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	export interface AppTypes {
		RouteId(): "/(app)" | "/" | "/api" | "/api/attendance" | "/api/check-auth" | "/api/class-skills" | "/api/class-students" | "/api/classes" | "/api/classes/[id]" | "/api/create-test-user" | "/api/debug-auth" | "/api/debug-classes-detailed" | "/api/debug-classes-schema" | "/api/debug-classes" | "/api/debug-colleges-schema" | "/api/debug-colleges-test" | "/api/debug-colleges" | "/api/debug-oauth" | "/api/debug-schools-detailed" | "/api/debug-schools-post" | "/api/debug-schools-simple" | "/api/debug-simple" | "/api/debug-student-creation" | "/api/debug-students-schema" | "/api/debug-students" | "/api/debug-supabase" | "/api/diagnostic-oauth" | "/api/health-check" | "/api/payments" | "/api/schools" | "/api/schools/[id]" | "/api/skills" | "/api/students" | "/api/students/[studentId]" | "/api/subscriptions" | "/api/test-auth" | "/api/tournaments" | "/api/whoami" | "/(app)/attendance" | "/auth" | "/auth/callback" | "/(app)/classes" | "/(app)/classes/create" | "/(app)/classes/[classId]" | "/(app)/classes/[classId]/attendance" | "/(app)/classes/[classId]/edit" | "/(app)/classes/[classId]/skills" | "/(app)/classes/[classId]/students" | "/dashboard-success" | "/dashboard-temp" | "/(app)/dashboard" | "/debug-auth" | "/debug" | "/legal" | "/legal/cookies" | "/legal/privacy" | "/legal/terms" | "/login-success" | "/login" | "/logout" | "/(app)/payments" | "/(app)/payments/create" | "/(app)/reports" | "/(app)/reports/[studentId]" | "/(app)/schools" | "/(app)/schools/create" | "/(app)/schools/[schoolId]" | "/(app)/schools/[schoolId]/edit" | "/(app)/schools/[schoolId]/lessons" | "/(app)/schools/[schoolId]/tournaments" | "/(app)/skills" | "/(app)/skills/create" | "/(app)/skills/[skillId]" | "/(app)/skills/[skillId]/edit" | "/(app)/students" | "/(app)/students/create" | "/(app)/students/[studentId]" | "/(app)/students/[studentId]/edit" | "/(app)/tournaments" | "/(app)/tournaments/create" | "/(app)/tournaments/[tournamentId]" | "/(app)/tournaments/[tournamentId]/edit" | "/(app)/upgrade";
		RouteParams(): {
			"/api/classes/[id]": { id: string };
			"/api/schools/[id]": { id: string };
			"/api/students/[studentId]": { studentId: string };
			"/(app)/classes/[classId]": { classId: string };
			"/(app)/classes/[classId]/attendance": { classId: string };
			"/(app)/classes/[classId]/edit": { classId: string };
			"/(app)/classes/[classId]/skills": { classId: string };
			"/(app)/classes/[classId]/students": { classId: string };
			"/(app)/reports/[studentId]": { studentId: string };
			"/(app)/schools/[schoolId]": { schoolId: string };
			"/(app)/schools/[schoolId]/edit": { schoolId: string };
			"/(app)/schools/[schoolId]/lessons": { schoolId: string };
			"/(app)/schools/[schoolId]/tournaments": { schoolId: string };
			"/(app)/skills/[skillId]": { skillId: string };
			"/(app)/skills/[skillId]/edit": { skillId: string };
			"/(app)/students/[studentId]": { studentId: string };
			"/(app)/students/[studentId]/edit": { studentId: string };
			"/(app)/tournaments/[tournamentId]": { tournamentId: string };
			"/(app)/tournaments/[tournamentId]/edit": { tournamentId: string }
		};
		LayoutParams(): {
			"/(app)": { classId?: string; studentId?: string; schoolId?: string; skillId?: string; tournamentId?: string };
			"/": { id?: string; studentId?: string; classId?: string; schoolId?: string; skillId?: string; tournamentId?: string };
			"/api": { id?: string; studentId?: string };
			"/api/attendance": Record<string, never>;
			"/api/check-auth": Record<string, never>;
			"/api/class-skills": Record<string, never>;
			"/api/class-students": Record<string, never>;
			"/api/classes": { id?: string };
			"/api/classes/[id]": { id: string };
			"/api/create-test-user": Record<string, never>;
			"/api/debug-auth": Record<string, never>;
			"/api/debug-classes-detailed": Record<string, never>;
			"/api/debug-classes-schema": Record<string, never>;
			"/api/debug-classes": Record<string, never>;
			"/api/debug-colleges-schema": Record<string, never>;
			"/api/debug-colleges-test": Record<string, never>;
			"/api/debug-colleges": Record<string, never>;
			"/api/debug-oauth": Record<string, never>;
			"/api/debug-schools-detailed": Record<string, never>;
			"/api/debug-schools-post": Record<string, never>;
			"/api/debug-schools-simple": Record<string, never>;
			"/api/debug-simple": Record<string, never>;
			"/api/debug-student-creation": Record<string, never>;
			"/api/debug-students-schema": Record<string, never>;
			"/api/debug-students": Record<string, never>;
			"/api/debug-supabase": Record<string, never>;
			"/api/diagnostic-oauth": Record<string, never>;
			"/api/health-check": Record<string, never>;
			"/api/payments": Record<string, never>;
			"/api/schools": { id?: string };
			"/api/schools/[id]": { id: string };
			"/api/skills": Record<string, never>;
			"/api/students": { studentId?: string };
			"/api/students/[studentId]": { studentId: string };
			"/api/subscriptions": Record<string, never>;
			"/api/test-auth": Record<string, never>;
			"/api/tournaments": Record<string, never>;
			"/api/whoami": Record<string, never>;
			"/(app)/attendance": Record<string, never>;
			"/auth": Record<string, never>;
			"/auth/callback": Record<string, never>;
			"/(app)/classes": { classId?: string };
			"/(app)/classes/create": Record<string, never>;
			"/(app)/classes/[classId]": { classId: string };
			"/(app)/classes/[classId]/attendance": { classId: string };
			"/(app)/classes/[classId]/edit": { classId: string };
			"/(app)/classes/[classId]/skills": { classId: string };
			"/(app)/classes/[classId]/students": { classId: string };
			"/dashboard-success": Record<string, never>;
			"/dashboard-temp": Record<string, never>;
			"/(app)/dashboard": Record<string, never>;
			"/debug-auth": Record<string, never>;
			"/debug": Record<string, never>;
			"/legal": Record<string, never>;
			"/legal/cookies": Record<string, never>;
			"/legal/privacy": Record<string, never>;
			"/legal/terms": Record<string, never>;
			"/login-success": Record<string, never>;
			"/login": Record<string, never>;
			"/logout": Record<string, never>;
			"/(app)/payments": Record<string, never>;
			"/(app)/payments/create": Record<string, never>;
			"/(app)/reports": { studentId?: string };
			"/(app)/reports/[studentId]": { studentId: string };
			"/(app)/schools": { schoolId?: string };
			"/(app)/schools/create": Record<string, never>;
			"/(app)/schools/[schoolId]": { schoolId: string };
			"/(app)/schools/[schoolId]/edit": { schoolId: string };
			"/(app)/schools/[schoolId]/lessons": { schoolId: string };
			"/(app)/schools/[schoolId]/tournaments": { schoolId: string };
			"/(app)/skills": { skillId?: string };
			"/(app)/skills/create": Record<string, never>;
			"/(app)/skills/[skillId]": { skillId: string };
			"/(app)/skills/[skillId]/edit": { skillId: string };
			"/(app)/students": { studentId?: string };
			"/(app)/students/create": Record<string, never>;
			"/(app)/students/[studentId]": { studentId: string };
			"/(app)/students/[studentId]/edit": { studentId: string };
			"/(app)/tournaments": { tournamentId?: string };
			"/(app)/tournaments/create": Record<string, never>;
			"/(app)/tournaments/[tournamentId]": { tournamentId: string };
			"/(app)/tournaments/[tournamentId]/edit": { tournamentId: string };
			"/(app)/upgrade": Record<string, never>
		};
		Pathname(): "/" | "/api" | "/api/" | "/api/attendance" | "/api/attendance/" | "/api/check-auth" | "/api/check-auth/" | "/api/class-skills" | "/api/class-skills/" | "/api/class-students" | "/api/class-students/" | "/api/classes" | "/api/classes/" | `/api/classes/${string}` & {} | `/api/classes/${string}/` & {} | "/api/create-test-user" | "/api/create-test-user/" | "/api/debug-auth" | "/api/debug-auth/" | "/api/debug-classes-detailed" | "/api/debug-classes-detailed/" | "/api/debug-classes-schema" | "/api/debug-classes-schema/" | "/api/debug-classes" | "/api/debug-classes/" | "/api/debug-colleges-schema" | "/api/debug-colleges-schema/" | "/api/debug-colleges-test" | "/api/debug-colleges-test/" | "/api/debug-colleges" | "/api/debug-colleges/" | "/api/debug-oauth" | "/api/debug-oauth/" | "/api/debug-schools-detailed" | "/api/debug-schools-detailed/" | "/api/debug-schools-post" | "/api/debug-schools-post/" | "/api/debug-schools-simple" | "/api/debug-schools-simple/" | "/api/debug-simple" | "/api/debug-simple/" | "/api/debug-student-creation" | "/api/debug-student-creation/" | "/api/debug-students-schema" | "/api/debug-students-schema/" | "/api/debug-students" | "/api/debug-students/" | "/api/debug-supabase" | "/api/debug-supabase/" | "/api/diagnostic-oauth" | "/api/diagnostic-oauth/" | "/api/health-check" | "/api/health-check/" | "/api/payments" | "/api/payments/" | "/api/schools" | "/api/schools/" | `/api/schools/${string}` & {} | `/api/schools/${string}/` & {} | "/api/skills" | "/api/skills/" | "/api/students" | "/api/students/" | `/api/students/${string}` & {} | `/api/students/${string}/` & {} | "/api/subscriptions" | "/api/subscriptions/" | "/api/test-auth" | "/api/test-auth/" | "/api/tournaments" | "/api/tournaments/" | "/api/whoami" | "/api/whoami/" | "/attendance" | "/attendance/" | "/auth" | "/auth/" | "/auth/callback" | "/auth/callback/" | "/classes" | "/classes/" | "/classes/create" | "/classes/create/" | `/classes/${string}` & {} | `/classes/${string}/` & {} | `/classes/${string}/attendance` & {} | `/classes/${string}/attendance/` & {} | `/classes/${string}/edit` & {} | `/classes/${string}/edit/` & {} | `/classes/${string}/skills` & {} | `/classes/${string}/skills/` & {} | `/classes/${string}/students` & {} | `/classes/${string}/students/` & {} | "/dashboard-success" | "/dashboard-success/" | "/dashboard-temp" | "/dashboard-temp/" | "/dashboard" | "/dashboard/" | "/debug-auth" | "/debug-auth/" | "/debug" | "/debug/" | "/legal" | "/legal/" | "/legal/cookies" | "/legal/cookies/" | "/legal/privacy" | "/legal/privacy/" | "/legal/terms" | "/legal/terms/" | "/login-success" | "/login-success/" | "/login" | "/login/" | "/logout" | "/logout/" | "/payments" | "/payments/" | "/payments/create" | "/payments/create/" | "/reports" | "/reports/" | `/reports/${string}` & {} | `/reports/${string}/` & {} | "/schools" | "/schools/" | "/schools/create" | "/schools/create/" | `/schools/${string}` & {} | `/schools/${string}/` & {} | `/schools/${string}/edit` & {} | `/schools/${string}/edit/` & {} | `/schools/${string}/lessons` & {} | `/schools/${string}/lessons/` & {} | `/schools/${string}/tournaments` & {} | `/schools/${string}/tournaments/` & {} | "/skills" | "/skills/" | "/skills/create" | "/skills/create/" | `/skills/${string}` & {} | `/skills/${string}/` & {} | `/skills/${string}/edit` & {} | `/skills/${string}/edit/` & {} | "/students" | "/students/" | "/students/create" | "/students/create/" | `/students/${string}` & {} | `/students/${string}/` & {} | `/students/${string}/edit` & {} | `/students/${string}/edit/` & {} | "/tournaments" | "/tournaments/" | "/tournaments/create" | "/tournaments/create/" | `/tournaments/${string}` & {} | `/tournaments/${string}/` & {} | `/tournaments/${string}/edit` & {} | `/tournaments/${string}/edit/` & {} | "/upgrade" | "/upgrade/";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/favicon.ico" | string & {};
	}
}