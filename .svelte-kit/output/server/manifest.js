export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.ico"]),
	mimeTypes: {},
	_: {
		client: {start:"_app/immutable/entry/start.DCr9goUL.js",app:"_app/immutable/entry/app.DBY4yC0O.js",imports:["_app/immutable/entry/start.DCr9goUL.js","_app/immutable/chunks/jCKqsZiR.js","_app/immutable/chunks/BuijjFxb.js","_app/immutable/chunks/Bpv75Ngb.js","_app/immutable/entry/app.DBY4yC0O.js","_app/immutable/chunks/D9Z9MdNV.js","_app/immutable/chunks/Bpv75Ngb.js","_app/immutable/chunks/C9ZkF2k7.js","_app/immutable/chunks/B37GFagT.js","_app/immutable/chunks/BuijjFxb.js","_app/immutable/chunks/D3nlvN1e.js","_app/immutable/chunks/BfAaTREW.js","_app/immutable/chunks/QBEKSanO.js","_app/immutable/chunks/CEgkY6kx.js","_app/immutable/chunks/70moWVVj.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js')),
			__memo(() => import('./nodes/6.js')),
			__memo(() => import('./nodes/7.js')),
			__memo(() => import('./nodes/8.js')),
			__memo(() => import('./nodes/9.js')),
			__memo(() => import('./nodes/10.js')),
			__memo(() => import('./nodes/11.js')),
			__memo(() => import('./nodes/12.js')),
			__memo(() => import('./nodes/13.js')),
			__memo(() => import('./nodes/14.js')),
			__memo(() => import('./nodes/15.js')),
			__memo(() => import('./nodes/16.js')),
			__memo(() => import('./nodes/17.js')),
			__memo(() => import('./nodes/18.js')),
			__memo(() => import('./nodes/19.js')),
			__memo(() => import('./nodes/20.js')),
			__memo(() => import('./nodes/21.js')),
			__memo(() => import('./nodes/22.js')),
			__memo(() => import('./nodes/23.js')),
			__memo(() => import('./nodes/24.js')),
			__memo(() => import('./nodes/25.js')),
			__memo(() => import('./nodes/26.js')),
			__memo(() => import('./nodes/27.js')),
			__memo(() => import('./nodes/28.js')),
			__memo(() => import('./nodes/29.js')),
			__memo(() => import('./nodes/30.js')),
			__memo(() => import('./nodes/31.js')),
			__memo(() => import('./nodes/32.js')),
			__memo(() => import('./nodes/33.js')),
			__memo(() => import('./nodes/34.js')),
			__memo(() => import('./nodes/35.js')),
			__memo(() => import('./nodes/36.js')),
			__memo(() => import('./nodes/37.js')),
			__memo(() => import('./nodes/38.js')),
			__memo(() => import('./nodes/39.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/api/attendance",
				pattern: /^\/api\/attendance\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/attendance/_server.ts.js'))
			},
			{
				id: "/api/auth/session",
				pattern: /^\/api\/auth\/session\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/auth/session/_server.ts.js'))
			},
			{
				id: "/api/check-auth",
				pattern: /^\/api\/check-auth\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/check-auth/_server.ts.js'))
			},
			{
				id: "/api/class-skills",
				pattern: /^\/api\/class-skills\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/class-skills/_server.ts.js'))
			},
			{
				id: "/api/class-students",
				pattern: /^\/api\/class-students\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/class-students/_server.ts.js'))
			},
			{
				id: "/api/classes",
				pattern: /^\/api\/classes\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/classes/_server.ts.js'))
			},
			{
				id: "/api/classes/[id]",
				pattern: /^\/api\/classes\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/classes/_id_/_server.ts.js'))
			},
			{
				id: "/api/health-check",
				pattern: /^\/api\/health-check\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/health-check/_server.ts.js'))
			},
			{
				id: "/api/payments",
				pattern: /^\/api\/payments\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/payments/_server.ts.js'))
			},
			{
				id: "/api/schools",
				pattern: /^\/api\/schools\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/schools/_server.ts.js'))
			},
			{
				id: "/api/schools/[id]",
				pattern: /^\/api\/schools\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/schools/_id_/_server.ts.js'))
			},
			{
				id: "/api/skills",
				pattern: /^\/api\/skills\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/skills/_server.ts.js'))
			},
			{
				id: "/api/students",
				pattern: /^\/api\/students\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/students/_server.ts.js'))
			},
			{
				id: "/api/students/[studentId]",
				pattern: /^\/api\/students\/([^/]+?)\/?$/,
				params: [{"name":"studentId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/students/_studentId_/_server.ts.js'))
			},
			{
				id: "/api/subscriptions",
				pattern: /^\/api\/subscriptions\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/subscriptions/_server.ts.js'))
			},
			{
				id: "/api/tournaments",
				pattern: /^\/api\/tournaments\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/tournaments/_server.ts.js'))
			},
			{
				id: "/api/whoami",
				pattern: /^\/api\/whoami\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/whoami/_server.ts.js'))
			},
			{
				id: "/(app)/attendance",
				pattern: /^\/attendance\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/(app)/classes",
				pattern: /^\/classes\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/(app)/classes/create",
				pattern: /^\/classes\/create\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/(app)/classes/[classId]",
				pattern: /^\/classes\/([^/]+?)\/?$/,
				params: [{"name":"classId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/(app)/classes/[classId]/attendance",
				pattern: /^\/classes\/([^/]+?)\/attendance\/?$/,
				params: [{"name":"classId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/(app)/classes/[classId]/edit",
				pattern: /^\/classes\/([^/]+?)\/edit\/?$/,
				params: [{"name":"classId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 9 },
				endpoint: null
			},
			{
				id: "/(app)/classes/[classId]/skills",
				pattern: /^\/classes\/([^/]+?)\/skills\/?$/,
				params: [{"name":"classId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 10 },
				endpoint: null
			},
			{
				id: "/(app)/classes/[classId]/students",
				pattern: /^\/classes\/([^/]+?)\/students\/?$/,
				params: [{"name":"classId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 11 },
				endpoint: null
			},
			{
				id: "/(app)/dashboard",
				pattern: /^\/dashboard\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 12 },
				endpoint: null
			},
			{
				id: "/debug-auth",
				pattern: /^\/debug-auth\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 35 },
				endpoint: null
			},
			{
				id: "/debug",
				pattern: /^\/debug\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 34 },
				endpoint: null
			},
			{
				id: "/legal/cookies",
				pattern: /^\/legal\/cookies\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 36 },
				endpoint: null
			},
			{
				id: "/legal/privacy",
				pattern: /^\/legal\/privacy\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 37 },
				endpoint: null
			},
			{
				id: "/legal/terms",
				pattern: /^\/legal\/terms\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 38 },
				endpoint: null
			},
			{
				id: "/login",
				pattern: /^\/login\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 39 },
				endpoint: null
			},
			{
				id: "/(app)/payments",
				pattern: /^\/payments\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 13 },
				endpoint: null
			},
			{
				id: "/(app)/payments/create",
				pattern: /^\/payments\/create\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 14 },
				endpoint: null
			},
			{
				id: "/(app)/reports",
				pattern: /^\/reports\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 15 },
				endpoint: null
			},
			{
				id: "/(app)/reports/[studentId]",
				pattern: /^\/reports\/([^/]+?)\/?$/,
				params: [{"name":"studentId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 16 },
				endpoint: null
			},
			{
				id: "/(app)/schools",
				pattern: /^\/schools\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 17 },
				endpoint: null
			},
			{
				id: "/(app)/schools/create",
				pattern: /^\/schools\/create\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 18 },
				endpoint: null
			},
			{
				id: "/(app)/schools/[schoolId]",
				pattern: /^\/schools\/([^/]+?)\/?$/,
				params: [{"name":"schoolId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 19 },
				endpoint: null
			},
			{
				id: "/(app)/schools/[schoolId]/edit",
				pattern: /^\/schools\/([^/]+?)\/edit\/?$/,
				params: [{"name":"schoolId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 20 },
				endpoint: null
			},
			{
				id: "/(app)/schools/[schoolId]/lessons",
				pattern: /^\/schools\/([^/]+?)\/lessons\/?$/,
				params: [{"name":"schoolId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 21 },
				endpoint: null
			},
			{
				id: "/(app)/schools/[schoolId]/tournaments",
				pattern: /^\/schools\/([^/]+?)\/tournaments\/?$/,
				params: [{"name":"schoolId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 22 },
				endpoint: null
			},
			{
				id: "/(app)/skills",
				pattern: /^\/skills\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 23 },
				endpoint: null
			},
			{
				id: "/(app)/skills/create",
				pattern: /^\/skills\/create\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 24 },
				endpoint: null
			},
			{
				id: "/(app)/skills/[skillId]/edit",
				pattern: /^\/skills\/([^/]+?)\/edit\/?$/,
				params: [{"name":"skillId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 25 },
				endpoint: null
			},
			{
				id: "/(app)/students",
				pattern: /^\/students\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 26 },
				endpoint: null
			},
			{
				id: "/(app)/students/create",
				pattern: /^\/students\/create\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 27 },
				endpoint: null
			},
			{
				id: "/(app)/students/[studentId]/edit",
				pattern: /^\/students\/([^/]+?)\/edit\/?$/,
				params: [{"name":"studentId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 28 },
				endpoint: null
			},
			{
				id: "/(app)/tournaments",
				pattern: /^\/tournaments\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 29 },
				endpoint: null
			},
			{
				id: "/(app)/tournaments/create",
				pattern: /^\/tournaments\/create\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 30 },
				endpoint: null
			},
			{
				id: "/(app)/tournaments/[tournamentId]",
				pattern: /^\/tournaments\/([^/]+?)\/?$/,
				params: [{"name":"tournamentId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 31 },
				endpoint: null
			},
			{
				id: "/(app)/tournaments/[tournamentId]/edit",
				pattern: /^\/tournaments\/([^/]+?)\/edit\/?$/,
				params: [{"name":"tournamentId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 32 },
				endpoint: null
			},
			{
				id: "/(app)/upgrade",
				pattern: /^\/upgrade\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 33 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
