export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11'),
	() => import('./nodes/12'),
	() => import('./nodes/13'),
	() => import('./nodes/14'),
	() => import('./nodes/15'),
	() => import('./nodes/16'),
	() => import('./nodes/17'),
	() => import('./nodes/18'),
	() => import('./nodes/19'),
	() => import('./nodes/20'),
	() => import('./nodes/21'),
	() => import('./nodes/22'),
	() => import('./nodes/23'),
	() => import('./nodes/24'),
	() => import('./nodes/25'),
	() => import('./nodes/26'),
	() => import('./nodes/27'),
	() => import('./nodes/28'),
	() => import('./nodes/29'),
	() => import('./nodes/30'),
	() => import('./nodes/31'),
	() => import('./nodes/32'),
	() => import('./nodes/33'),
	() => import('./nodes/34'),
	() => import('./nodes/35'),
	() => import('./nodes/36'),
	() => import('./nodes/37'),
	() => import('./nodes/38'),
	() => import('./nodes/39')
];

export const server_loads = [0,2];

export const dictionary = {
		"/": [~3],
		"/(app)/attendance": [~4,[2]],
		"/(app)/classes": [~5,[2]],
		"/(app)/classes/create": [~6,[2]],
		"/(app)/classes/[classId]": [~7,[2]],
		"/(app)/classes/[classId]/attendance": [~8,[2]],
		"/(app)/classes/[classId]/edit": [~9,[2]],
		"/(app)/classes/[classId]/skills": [~10,[2]],
		"/(app)/classes/[classId]/students": [~11,[2]],
		"/(app)/dashboard": [~12,[2]],
		"/debug-auth": [35],
		"/debug": [34],
		"/legal/cookies": [36],
		"/legal/privacy": [37],
		"/legal/terms": [38],
		"/login": [~39],
		"/(app)/payments": [~13,[2]],
		"/(app)/payments/create": [~14,[2]],
		"/(app)/reports": [~15,[2]],
		"/(app)/reports/[studentId]": [~16,[2]],
		"/(app)/schools": [~17,[2]],
		"/(app)/schools/create": [~18,[2]],
		"/(app)/schools/[schoolId]": [~19,[2]],
		"/(app)/schools/[schoolId]/edit": [~20,[2]],
		"/(app)/schools/[schoolId]/lessons": [~21,[2]],
		"/(app)/schools/[schoolId]/tournaments": [~22,[2]],
		"/(app)/skills": [~23,[2]],
		"/(app)/skills/create": [~24,[2]],
		"/(app)/skills/[skillId]/edit": [~25,[2]],
		"/(app)/students": [~26,[2]],
		"/(app)/students/create": [~27,[2]],
		"/(app)/students/[studentId]/edit": [~28,[2]],
		"/(app)/tournaments": [~29,[2]],
		"/(app)/tournaments/create": [~30,[2]],
		"/(app)/tournaments/[tournamentId]": [~31,[2]],
		"/(app)/tournaments/[tournamentId]/edit": [~32,[2]],
		"/(app)/upgrade": [~33,[2]]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
	
	reroute: (() => {}),
	transport: {}
};

export const decoders = Object.fromEntries(Object.entries(hooks.transport).map(([k, v]) => [k, v.decode]));

export const hash = false;

export const decode = (type, value) => decoders[type](value);

export { default as root } from '../root.js';