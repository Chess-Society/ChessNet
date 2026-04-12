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
		client: {start:"_app/immutable/entry/start.BI0wEjwJ.js",app:"_app/immutable/entry/app.tTlYbtTR.js",imports:["_app/immutable/entry/start.BI0wEjwJ.js","_app/immutable/chunks/D_FzZ_Fc.js","_app/immutable/chunks/BIYOSaNE.js","_app/immutable/chunks/0MC4xOQl.js","_app/immutable/chunks/DlekFfjM.js","_app/immutable/chunks/C0EKSxHY.js","_app/immutable/chunks/CPDqQ9Ql.js","_app/immutable/entry/app.tTlYbtTR.js","_app/immutable/chunks/DlekFfjM.js","_app/immutable/chunks/0MC4xOQl.js","_app/immutable/chunks/BIYOSaNE.js","_app/immutable/chunks/C0EKSxHY.js","_app/immutable/chunks/CPDqQ9Ql.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
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
			__memo(() => import('./nodes/39.js')),
			__memo(() => import('./nodes/40.js')),
			__memo(() => import('./nodes/41.js')),
			__memo(() => import('./nodes/42.js')),
			__memo(() => import('./nodes/43.js')),
			__memo(() => import('./nodes/44.js'))
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
				id: "/debug-auth",
				pattern: /^\/debug-auth\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/debug",
				pattern: /^\/debug\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/donar",
				pattern: /^\/donar\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/hoja-de-ruta",
				pattern: /^\/hoja-de-ruta\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/legal/cookies",
				pattern: /^\/legal\/cookies\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/legal/privacy",
				pattern: /^\/legal\/privacy\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 9 },
				endpoint: null
			},
			{
				id: "/legal/terms",
				pattern: /^\/legal\/terms\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 10 },
				endpoint: null
			},
			{
				id: "/login",
				pattern: /^\/login\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 11 },
				endpoint: null
			},
			{
				id: "/panel",
				pattern: /^\/panel\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 12 },
				endpoint: null
			},
			{
				id: "/panel/alumnos",
				pattern: /^\/panel\/alumnos\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 13 },
				endpoint: null
			},
			{
				id: "/panel/alumnos/create",
				pattern: /^\/panel\/alumnos\/create\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 14 },
				endpoint: null
			},
			{
				id: "/panel/alumnos/[studentId]/edit",
				pattern: /^\/panel\/alumnos\/([^/]+?)\/edit\/?$/,
				params: [{"name":"studentId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 15 },
				endpoint: null
			},
			{
				id: "/panel/asistencia",
				pattern: /^\/panel\/asistencia\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 16 },
				endpoint: null
			},
			{
				id: "/panel/centros",
				pattern: /^\/panel\/centros\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 17 },
				endpoint: null
			},
			{
				id: "/panel/centros/create",
				pattern: /^\/panel\/centros\/create\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 18 },
				endpoint: null
			},
			{
				id: "/panel/centros/[schoolId]",
				pattern: /^\/panel\/centros\/([^/]+?)\/?$/,
				params: [{"name":"schoolId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 19 },
				endpoint: null
			},
			{
				id: "/panel/centros/[schoolId]/edit",
				pattern: /^\/panel\/centros\/([^/]+?)\/edit\/?$/,
				params: [{"name":"schoolId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 20 },
				endpoint: null
			},
			{
				id: "/panel/centros/[schoolId]/lessons",
				pattern: /^\/panel\/centros\/([^/]+?)\/lessons\/?$/,
				params: [{"name":"schoolId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 21 },
				endpoint: null
			},
			{
				id: "/panel/centros/[schoolId]/tournaments",
				pattern: /^\/panel\/centros\/([^/]+?)\/tournaments\/?$/,
				params: [{"name":"schoolId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 22 },
				endpoint: null
			},
			{
				id: "/panel/clases",
				pattern: /^\/panel\/clases\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 23 },
				endpoint: null
			},
			{
				id: "/panel/clases/create",
				pattern: /^\/panel\/clases\/create\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 24 },
				endpoint: null
			},
			{
				id: "/panel/clases/[classId]",
				pattern: /^\/panel\/clases\/([^/]+?)\/?$/,
				params: [{"name":"classId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 25 },
				endpoint: null
			},
			{
				id: "/panel/clases/[classId]/attendance",
				pattern: /^\/panel\/clases\/([^/]+?)\/attendance\/?$/,
				params: [{"name":"classId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 26 },
				endpoint: null
			},
			{
				id: "/panel/clases/[classId]/edit",
				pattern: /^\/panel\/clases\/([^/]+?)\/edit\/?$/,
				params: [{"name":"classId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 27 },
				endpoint: null
			},
			{
				id: "/panel/clases/[classId]/skills",
				pattern: /^\/panel\/clases\/([^/]+?)\/skills\/?$/,
				params: [{"name":"classId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 28 },
				endpoint: null
			},
			{
				id: "/panel/clases/[classId]/students",
				pattern: /^\/panel\/clases\/([^/]+?)\/students\/?$/,
				params: [{"name":"classId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 29 },
				endpoint: null
			},
			{
				id: "/panel/configuracion",
				pattern: /^\/panel\/configuracion\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 30 },
				endpoint: null
			},
			{
				id: "/panel/habilidades",
				pattern: /^\/panel\/habilidades\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 31 },
				endpoint: null
			},
			{
				id: "/panel/habilidades/create",
				pattern: /^\/panel\/habilidades\/create\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 32 },
				endpoint: null
			},
			{
				id: "/panel/habilidades/[skillId]/edit",
				pattern: /^\/panel\/habilidades\/([^/]+?)\/edit\/?$/,
				params: [{"name":"skillId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 33 },
				endpoint: null
			},
			{
				id: "/panel/informes",
				pattern: /^\/panel\/informes\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 34 },
				endpoint: null
			},
			{
				id: "/panel/informes/[studentId]",
				pattern: /^\/panel\/informes\/([^/]+?)\/?$/,
				params: [{"name":"studentId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 35 },
				endpoint: null
			},
			{
				id: "/panel/logros",
				pattern: /^\/panel\/logros\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 36 },
				endpoint: null
			},
			{
				id: "/panel/pagos",
				pattern: /^\/panel\/pagos\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 37 },
				endpoint: null
			},
			{
				id: "/panel/pagos/create",
				pattern: /^\/panel\/pagos\/create\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 38 },
				endpoint: null
			},
			{
				id: "/panel/torneos",
				pattern: /^\/panel\/torneos\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 39 },
				endpoint: null
			},
			{
				id: "/panel/torneos/create",
				pattern: /^\/panel\/torneos\/create\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 40 },
				endpoint: null
			},
			{
				id: "/panel/torneos/[tournamentId]",
				pattern: /^\/panel\/torneos\/([^/]+?)\/?$/,
				params: [{"name":"tournamentId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 41 },
				endpoint: null
			},
			{
				id: "/panel/torneos/[tournamentId]/edit",
				pattern: /^\/panel\/torneos\/([^/]+?)\/edit\/?$/,
				params: [{"name":"tournamentId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 42 },
				endpoint: null
			},
			{
				id: "/panel/upgrade",
				pattern: /^\/panel\/upgrade\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 43 },
				endpoint: null
			},
			{
				id: "/precios",
				pattern: /^\/precios\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 44 },
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
